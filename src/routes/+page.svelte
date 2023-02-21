<script lang="ts">
	import {Portal} from '@feltcoop/dealt';

	import SsagScene from '$routes/SsagScene.svelte';
</script>

<main>
	<Portal>
		<SsagScene />
	</Portal>
</main>

<style>
	main {
		position: absolute;
		inset: 0;
	}
</style>
