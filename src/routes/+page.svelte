<script lang="ts">
	import Mreows from '$lib/Mreows.svelte';

	let mreows: Array<{icon: string}> | undefined;
</script>

<main class="markup column">
	<section>
		<header class="centered-hz">
			<h1><a href="https://github.com/ryanatkn/ssag">ssag</a></h1>
		</header>
	</section>
	<Mreows bind:mreows />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 auto;
	}
	h1 {
		text-align: center;
	}
</style>
