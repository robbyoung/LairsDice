<script lang="ts">
	import { createGame } from '$lib/apiClient';

	let gameCode: string | undefined = $state(undefined);

	async function createGameClicked() {
		const response = await createGame();

		gameCode = response.gameCode;
	}
</script>

{#if gameCode === undefined}
	<button onclick={createGameClicked}>Create Game</button>
{:else}
	<h1>Game code: {gameCode}</h1>
{/if}
