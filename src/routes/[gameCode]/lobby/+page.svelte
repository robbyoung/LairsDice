<script lang="ts">
	import { goto } from '$app/navigation';
	import { startGame } from '../../../lib/apiClient.js';

	let { data } = $props();

	let playerList = $state(data.players);

	async function start() {
		await startGame(data.playerToken);

		goto(`/${data.gameCode}/game?p=${data.playerToken}`);
	}
</script>

<h1>{data.gameCode}</h1>

<h3>Players</h3>
{#each playerList as player}
	<p>{player.name}</p>
{/each}

{#if data.isHost}
	<button type="button" onclick={start}>Start</button>
{:else}
	<p>Waiting for host...</p>
{/if}
