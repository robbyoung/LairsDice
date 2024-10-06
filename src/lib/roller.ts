export class Roller {
	rollDice(diceCount: number): number[] {
		const playerDice: number[] = [];

		while (playerDice.length < diceCount) {
			playerDice.push(this.randomNumber(6));
		}

		return playerDice;
	}

	randomNumber(max: number): number {
		return Math.floor(Math.random() * max);
	}
}
