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
	type EntityCircle,
	type EntityPolygon,
	type Renderer,
} from '@feltcoop/dealt';
import {COLOR_DANGER} from './constants';

// TODO rewrite this to use a route Svelte component? `dealt.dev/membrane/home`

// TODO what if this file were named `home.stage.ts` instead of `stage0.ts` ?

const meta: StageMeta = {
	name: 'stage0',
	icon: '🐭',
};

export class Stage0 extends Stage {
	static override meta = meta;

	// these are instantiated in `setup`
	player!: Entity<EntityCircle>;
	bounds!: Entity<EntityPolygon>;

	// TODO not calling `setup` first is error-prone
	override async setup(): Promise<void> {
		const collisions = (this.collisions = new Collisions());
		this.sim = new Simulation(collisions);

		// create the controllable player
		const player = (this.player = new Entity(
			collisions.createCircle(100, 147, this.playerRadius) as EntityCircle,
		));
		player.speed = 0.2;
		player.color = COLOR_PLAYER;
		this.addEntity(player);

		// create the bounds around the stage edges
		const bounds = (this.bounds = new Entity(
			collisions.createPolygon(0, 0, [
				[0, 0],
				[1, 0],
				[1, 1],
				[0, 1],
			]) as EntityPolygon,
		));
		bounds.invisible = true;
		bounds.ghostly = true;
		bounds.body.scale_x = this.$camera.width;
		bounds.body.scale_y = this.$camera.height;
		this.addEntity(bounds);

		// TODO create these programmatically from data

		// create some things
		const obstacle = new Entity(
			collisions.createCircle(150, 110, player.radius * 4) as EntityCircle,
		);
		obstacle.speed = 0.03;
		this.addEntity(obstacle);

		// create danger
		const danger1 = new Entity(
			collisions.createCircle(120, 100, player.radius / 3) as EntityCircle,
		);
		danger1.color = COLOR_DANGER;
		this.addEntity(danger1);
		console.log('set up');
	}

	override update(dt: number): void {
		const {controller, player} = this;

		super.update(dt);

		this.sim.update(dt, (entityA, entityB, result) => {
			// TODO make a better system
			if (
				(entityA === player && entityB.color === COLOR_DANGER) ||
				(entityB === player && entityA.color === COLOR_DANGER)
			) {
				this.restart();
			}
			collide(entityA, entityB, result);
		});

		updateEntityDirection(controller, player, this.$camera, this.$viewport, this.$layout);

		if (!this.bounds.body.collides(this.player.body, collisionResult)) {
			this.restart();
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
}
