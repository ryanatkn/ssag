import {
	Stage,
	Item,
	COLOR_PLAYER,
	updateItemDirection,
	collide,
	collisionResult,
	type StageMeta,
	type CircleBody,
	type PolygonBody,
	COLOR_ROOTED,
	COLOR_EXIT,
	COLOR_DEFAULT,
	hslToHex,
	PLAYER_RADIUS,
	createItemId,
	type ItemData,
	type StageData,
	SPEED_SLOW,
	hslToStr,
} from '@feltcoop/dealt';

import {COLOR_DANGER} from './constants';
import {goto} from '$app/navigation';

// TODO rewrite this to use a route Svelte component? `dealt.dev/membrane/home`

// TODO what if this file were named `home.stage.ts` instead of `stage0.ts` ?

const meta: StageMeta = {
	name: 'stage0',
	icon: '🐭',
};

export class Stage0 extends Stage {
	static override meta = meta;

	place: 'inside' | 'outside' = 'outside';

	// these are instantiated in `setup`
	bounds!: Item<PolygonBody>;
	obstacle!: Item<CircleBody>;
	portal!: Item<CircleBody>;
	portalHitboxOuter!: Item<CircleBody>;

	links: Set<Item> = new Set();

	static override createInitialData(): Partial<StageData> {
		const items: Array<Partial<ItemData>> = [];
		const data: Partial<StageData> = {freezeCamera: true, items};

		const controlled = {
			type: 'circle', // TODO needs type safety, should error when omitted
			id: createItemId(),
			x: 100,
			y: 147,
			radius: PLAYER_RADIUS,
			speed: SPEED_SLOW,
			color: COLOR_PLAYER,
		} satisfies Partial<ItemData>;
		items.push(controlled);
		data.controlled = controlled.id;

		items.push({
			type: 'circle',
			x: 150,
			y: 110,
			radius: controlled.radius * 4,
			speed: 0.03,
			tags: ['obstacle'],
		});

		// create some links
		items.push({
			type: 'polygon',
			x: 150,
			y: 190,
			points: [
				[-55, -13],
				[55, -13],
				[55, 13],
				[-55, 13],
			],
			invisible: true,
			ghostly: true,
			color: COLOR_EXIT,
			scale_x: 1,
			scale_y: 1,
			text: 'control',
			textFill: hslToHex(...COLOR_EXIT),
			fontFamily: 'monospace',
			href: 'https://control.ssag.dev/',
		});
		items.push({
			type: 'polygon',
			x: 70,
			y: 50,
			points: [
				[-29, -8],
				[29, -8],
				[29, 8],
				[-29, 8],
			],
			invisible: true,
			ghostly: true,
			color: COLOR_EXIT,
			scale_x: 1,
			scale_y: 1,
			text: 'source',
			textFill: hslToHex(...COLOR_EXIT),
			fontFamily: 'monospace',
			fontSize: 16,
			href: 'https://github.com/ryanatkn/ssag',
		});

		console.log(`toInitialData`, data);

		return data;
	}

	// TODO not calling `setup` first is error-prone
	override async setup(): Promise<void> {
		const {collisions} = this;

		// TODO do this better, maybe with `tags` automatically, same with `bounds`
		for (const item of this.itemById.values()) {
			if (item.href !== undefined) {
				this.links.add(item);
			}
			if (item.tags?.has('obstacle')) {
				this.obstacle = item as Item<CircleBody>;
			}
		}

		// create the bounds around the stage edges
		const bounds = (this.bounds = new Item(collisions, {
			type: 'polygon',
			x: 0,
			y: 0,
			points: [
				[0, 0],
				[1, 0],
				[1, 1],
				[0, 1],
			],
			invisible: true,
			ghostly: true,
			scale_x: this.$camera.width,
			scale_y: this.$camera.height,
		}));
		this.addItem(bounds);

		// create the exit portal
		const portal = (this.portal = new Item(collisions, {
			type: 'circle',
			x: 120,
			y: 100,
			radius: PLAYER_RADIUS / 3,
			color: COLOR_DANGER,
			strength: 100_000_000,
		}));
		this.addItem(portal);
		this.portalHitboxOuter = this.createCircleOuterHitbox(portal, 1);
		console.log('set up');
	}

	override update(dt: number): void {
		const {controller, controlled, obstacle, portal, place, links} = this;
		super.update(dt);

		let obstacleAndPortalAreColliding = false;

		this.sim.update(dt, (itemA, itemB, result) => {
			// TODO make a better system
			if (
				(itemA === controlled && itemB.color === COLOR_DANGER) ||
				(itemB === controlled && itemA.color === COLOR_DANGER)
			) {
				this.restart();
			} else if (
				place === 'inside' &&
				((itemA === controlled && links.has(itemB)) || (itemB === controlled && links.has(itemA)))
			) {
				const item = itemA === controlled ? itemB : itemA;
				const {href} = item;
				if (href) {
					item.color = COLOR_ROOTED;
					item.textFill = hslToStr(...COLOR_ROOTED);
					void this.goToHref(href);
				}
			} else if (
				(itemA === controlled && itemB.color === COLOR_EXIT) ||
				(itemB === controlled && itemA.color === COLOR_EXIT)
			) {
				this.goInside();
			} else if (
				(itemA === obstacle && itemB === portal) ||
				(itemB === obstacle && itemA === portal)
			) {
				obstacle.color = COLOR_ROOTED;
				portal.color = COLOR_EXIT;
				obstacleAndPortalAreColliding = true;
			}
			collide(itemA, itemB, result);
		});

		if (
			!obstacleAndPortalAreColliding &&
			obstacle.color === COLOR_ROOTED &&
			!this.portalHitboxOuter.body.collides(obstacle.body, collisionResult)
		) {
			obstacle.color = COLOR_DEFAULT;
			portal.color = COLOR_DANGER;
		}

		if (controlled) {
			updateItemDirection(controller, controlled, this.$camera, this.$viewport, this.$layout);

			if (place === 'inside') {
				if (!portal.body.collides(controlled.body, collisionResult)) {
					this.goOutside();
				}
			} else {
				if (!this.bounds.body.collides(controlled.body, collisionResult)) {
					this.restart();
				}
			}
		}

		if (this.shouldRestart) {
			this.exit({next_stage: meta.name});
		}
	}

	shouldRestart = false; // this is a flag because we want to do it after updating, otherwise disposed items get updated and throw errors
	restart(): void {
		this.shouldRestart = true;
	}

	// TODO refactor all of this
	goInside(): void {
		if (this.place === 'inside') return;
		this.place = 'inside';
		const {obstacle, portal} = this;
		obstacle.invisible = true;
		obstacle.ghostly = true;
		portal.color = COLOR_DEFAULT;
		portal.radius = 250 / 2; // TODO animate the radius
		portal.ghostly = true;
		portal.x = 125;
		portal.y = 125;
		for (const link of this.links) {
			link.invisible = false;
			link.ghostly = false;
		}
	}

	goOutside(): void {
		if (this.place === 'outside') return;
		this.place = 'outside';
		const {obstacle, portal} = this;
		obstacle.invisible = false;
		obstacle.ghostly = false;
		portal.color = this.portalHitboxOuter.body.collides(obstacle.body, collisionResult)
			? COLOR_EXIT
			: COLOR_DANGER;
		portal.radius = (this.controlled?.radius ?? PLAYER_RADIUS) / 3;
		portal.ghostly = false;
		portal.x = 120;
		portal.y = 100;
		for (const link of this.links) {
			link.invisible = true;
			link.ghostly = true;
		}
	}

	goingToHref: Promise<void> | null = null;

	goToHref(href: string, opts?: Parameters<typeof goto>[1]): void | Promise<void> {
		if (this.goingToHref) return this.goingToHref;
		return (this.goingToHref = goto(href, opts));
	}
}
