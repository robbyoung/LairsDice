<script lang="ts">
	import { challengeBid, getGame, placeBid } from '../../../lib/apiClient.js';

	let { data } = $props();

	let player = $state(data.game.players.find((p) => p.isCaller)!);
	let events = $state(data.game.events.reverse());

	let bidDice = $state('');
	let bidQuantity = $state('');

	setInterval(async () => {
		const game = await getGame(data.playerToken);

		player = game.players.find((p) => p.isCaller)!;
		events = [...game.events.reverse(), ...events];
	}, 5000);

	async function bid() {
		const parsedQuantity = parseInt(bidQuantity ?? '');
		const parsedDice = parseInt(bidDice ?? '');

		if (!bidDice || !bidQuantity) {
			throw new Error('Invalid bid');
		}

		await placeBid(data.playerToken, parsedQuantity, parsedDice);
	}

	async function challenge() {
		await challengeBid(data.playerToken);
	}
</script>

{#if player.currentTurn}
	<div>
		<label for="bid-quantity">Quantity:</label>
		<input
			id="bid-quantity"
			oninput={(event) => (bidQuantity = (event.target as HTMLInputElement).value)}
			value={bidQuantity}
		/>
	</div>
	<div>
		<label for="bid-dice">Dice:</label>
		<input
			id="bid-dice"
			oninput={(event) => (bidDice = (event.target as HTMLInputElement).value)}
			value={bidDice}
		/>
	</div>
	<button type="button" onclick={bid}>Bid</button>
	<button type="button" onclick={challenge}>Challenge</button>
{:else}
	<p>Waiting for your turn</p>
{/if}

<p>Dice</p>
{JSON.stringify(player.dice)}

{#each events as event}
	<p>{JSON.stringify(event)}</p>
{/each}
