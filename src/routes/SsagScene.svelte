<script lang="ts">
	import {onDestroy, onMount} from 'svelte';
	import {writable} from 'svelte/store';
	import {
		World,
		setViewport,
		SurfaceWithController,
		getPixi,
		createCameraStore,
		getLayout,
		Stage,
		type ExitStage,
	} from '@feltcoop/dealt';

	import {Stage0} from '$routes/stage0';

	export let pixi = getPixi();
	export let layout = getLayout();

	let viewportSize = Math.min($layout.width, $layout.height);
	$: viewportSize = Math.min($layout.width, $layout.height);

	const WORLD_SIZE = 256;

	// Scenes control the `viewport` and `camera`.
	const viewport = setViewport(writable({width: viewportSize, height: viewportSize}));
	$: viewport.set({width: viewportSize, height: viewportSize});
	const camera = createCameraStore();
	$: camera.setDimensions(WORLD_SIZE, WORLD_SIZE, $viewport.width, $viewport.height);

	let stage: Stage | undefined | null;
	let settingUp: boolean | undefined;

	const exit: ExitStage = (outcome) => {
		console.log(`exit outcome`, outcome);
		createStage();
	};

	const createStage = () => {
		if (settingUp) return;
		settingUp = true;
		if (stage) destroyStage();
		stage = new Stage0({exit, camera, viewport, layout});
		void stage.setup({stageStates: []});
		settingUp = false;
	};

	onMount(() => {
		createStage();
	});

	// TODO abstract this
	const destroyStage = () => {
		if (!stage) return;
		console.log(`destroying stage`, stage);
		stage.destroy();
		stage = null;
	};
	onDestroy(destroyStage);
</script>

{#if stage}
	{#key stage}
		<World {stage} {pixi} />
		<SurfaceWithController controller={stage.controller} />
	{/key}
{/if}
