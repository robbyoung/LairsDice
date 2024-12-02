<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { getPlayers, startGame } from '../../../lib/apiClient.js';

	let { data } = $props();

	let playerList = $state(data.players);

	let playerPoller = $state<number | undefined>(undefined);

	async function start() {
		await startGame(data.playerToken);

		goto(`/${data.gameCode}/game?p=${data.playerToken}`);
	}

	onMount(() => {
		setInterval(async () => {
			const players = await getPlayers(data.playerToken);

			playerList = players;
		}, 5000);
	});

	onDestroy(() => {
		clearInterval(playerPoller);
	});
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
