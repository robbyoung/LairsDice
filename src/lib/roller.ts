/* eslint-disable @typescript-eslint/no-unused-vars */
export class Roller {
	rollDice(diceCount: number): number[] {
		const playerDice: number[] = [];

		while (playerDice.length < diceCount) {
			playerDice.push(this.randomNumber(6));
		}

		console.log('Result: ' + playerDice);

		return playerDice;
	}

	randomNumber(max: number): number {
		return Math.floor(Math.random() * max) + 1;
	}
}
