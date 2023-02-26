import {Collisions} from '@ryanatkn/collisions';
import {
	Stage,
	Simulation,
	Entity,
	COLOR_PLAYER,
	updateEntityDirection,
	collide,
	collisionResult,
	type StageMeta,
	type CircleBody,
	type PolygonBody,
	type Renderer,
	COLOR_ROOTED,
	COLOR_EXIT,
	COLOR_DEFAULT,
	hslToHex,
	SPEED_MEDIUM,
	PLAYER_RADIUS,
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
	player!: Entity<CircleBody>;
	bounds!: Entity<PolygonBody>;
	obstacle!: Entity<CircleBody>;
	portal!: Entity<CircleBody>;
	portalHitboxOuter!: Entity<CircleBody>;

	links: Set<Entity> = new Set();

	// TODO not calling `setup` first is error-prone
	override async setup(): Promise<void> {
		const collisions = (this.collisions = new Collisions());
		this.sim = new Simulation(collisions);

		// create the controllable player
		const player = (this.player = new Entity(collisions, {
			type: 'circle',
			x: 100,
			y: 147,
			radius: PLAYER_RADIUS,
			speed: SPEED_MEDIUM,
			color: COLOR_PLAYER,
		}));
		this.addEntity(player);

		// create the bounds around the stage edges
		const bounds = (this.bounds = new Entity(collisions, {
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
		this.addEntity(bounds);

		// TODO create these programmatically from data

		// create some things
		const obstacle = (this.obstacle = new Entity(collisions, {
			type: 'circle',
			x: 150,
			y: 110,
			radius: player.radius * 4,
			speed: 0.03,
		}));
		this.addEntity(obstacle);

		// create the exit portal
		const portal = (this.portal = new Entity(collisions, {
			type: 'circle',
			x: 120,
			y: 100,
			radius: player.radius / 3,
			color: COLOR_DANGER,
			strength: 100_000_000,
		}));
		this.addEntity(portal);
		this.portalHitboxOuter = this.createCircleOuterHitbox(portal, 1);
		console.log('set up');

		// create some links
		const link0 = new Entity(collisions, {
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
		this.addEntity(link0);
		this.links.add(link0);
	}

	override update(dt: number): void {
		const {controller, player, obstacle, portal, place, links} = this;

		super.update(dt);

		let obstacleAndPortalAreColliding = false;

		this.sim.update(dt, (entityA, entityB, result) => {
			// TODO make a better system
			if (
				(entityA === player && entityB.color === COLOR_DANGER) ||
				(entityB === player && entityA.color === COLOR_DANGER)
			) {
				this.restart();
			} else if (
				place === 'inside' &&
				((entityA === player && links.has(entityB)) || (entityB === player && links.has(entityA)))
			) {
				const href = (entityA === player ? entityB : entityA).href;
				if (href) void this.goToHref(href);
			} else if (
				(entityA === player && entityB.color === COLOR_EXIT) ||
				(entityB === player && entityA.color === COLOR_EXIT)
			) {
				this.goInside();
			} else if (
				(entityA === obstacle && entityB === portal) ||
				(entityB === obstacle && entityA === portal)
			) {
				obstacle.color = COLOR_ROOTED;
				portal.color = COLOR_EXIT;
				obstacleAndPortalAreColliding = true;
			}
			console.log(`place`, place);
			collide(entityA, entityB, result);
		});

		if (
			!obstacleAndPortalAreColliding &&
			obstacle.color === COLOR_ROOTED &&
			!this.portalHitboxOuter.body.collides(obstacle.body, collisionResult)
		) {
			obstacle.color = COLOR_DEFAULT;
			portal.color = COLOR_DANGER;
		}

		updateEntityDirection(controller, player, this.$camera, this.$viewport, this.$layout);

		if (this.place === 'inside') {
			if (!portal.body.collides(player.body, collisionResult)) {
				this.goOutside();
			}
		} else {
			if (!this.bounds.body.collides(player.body, collisionResult)) {
				this.restart();
			}
		}

		if (this.shouldRestart) {
			this.exit({next_stage: meta.name});
		}
	}

	render(renderer: Renderer): void {
		renderer.clear();
		renderer.render(this.sim.entities);
	}

	shouldRestart = false; // this is a flag because we want to do it after updating, otherwise disposed entities get updated and throw errors
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
		portal.radius = this.player.radius / 3;
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
