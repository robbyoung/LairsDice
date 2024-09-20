/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GameDto, PlayerDto } from '../types/dtos';
import { GameState, type Bid, type Game, type Player } from '../types/types';
import { gameRepository, GameRepository } from './gameRepository';
import { Roller } from './roller';

export class GameService {
	constructor(private repository: GameRepository) {}

	public async createGame(): Promise<string> {
		const game: Game = {
			state: GameState.Lobby,
			code: this.generateCode(),
			currentPlayer: undefined,
			players: [],
			currentBid: undefined,
			maxPlayers: 8,
			numberOfPlayers: 0,
			initialDiceCount: 6
		};

		this.repository.saveGame(game);

		return game.code;
	}

	public async addPlayer(playerName: string, gameCode: string): Promise<string> {
		const game: Game | undefined = await gameRepository.getGame(gameCode);

		if (!game) {
			throw new Error('Game is undefined');
		}

		if (game.state === GameState.InProgress) {
			throw new Error('The game is already in progress');
		} else if (game.state === GameState.Finished) {
			throw new Error('The game has already finished');
		}

		const newPlayer: Player = {
			name: playerName,
			code: gameCode,
			dice: []
		};

		if (game.players.length <= game.maxPlayers) {
			game.players.push(newPlayer);
		} else {
			throw new Error('max player cap check failed');
		}

		this.repository.saveGame(game);

		return playerName;

		// throw new Error('not implemented');
	}

	// Should this instead return OpponentDto[]?
	public async getPlayers(gameCode: string): Promise<PlayerDto[]> {
		const game: Game | undefined = await gameRepository.getGame(gameCode);

		if (!game) {
			throw new Error('Game is undefined');
		}

		return game.players;

		// throw new Error('not implemented');
	}

	public async startGame(playerToken: string): Promise<void> {
		const gameCode = this.getGameCode(playerToken);
		const game: Game | undefined = await gameRepository.getGame(gameCode);
		if (!game) {
			throw new Error('Game is undefined');
		}

		if (game.players[0].name !== this.getPlayerName(playerToken)) {
			throw new Error('Player is not the host');
		}

		const diceRoller: Roller = new Roller();
		const numPlayers = game.players.length;

		game.players.forEach((player) => {
			player.dice = diceRoller.rollDice(game.initialDiceCount);
		});
		// ^^^
		// |||  What do you think of making the dice roller roll all of the dice in the game in
		// its "rollDice" function because you would always roll all of the dice.
		// Would need a Game to be passed to it though: "diceRoller.rollAllDice(game.initialDiceCount, game)"";
		this.chooseStartingPlayer(numPlayers, game);
		this.updateGameState(GameState.InProgress, game);

		this.repository.saveGame(game);

		// throw new Error('not implemented');
	}

	public async getGame(playerToken: string): Promise<GameDto> {
		// // Currently not sure where to convert to OpponentDtos for left and right players.
		// const gameCode = this.getGameCode(playerToken);
		// const game: Game | undefined = await gameRepository.getGame(gameCode);
		// if (!game) {
		// 	throw new Error('Game is undefined');
		// }
		// const players: PlayerDto[] = await this.getPlayers(gameCode);
		// const numPlayers = players.length;
		// const playerIndex: number = game.players.findIndex((player) =>
		// 	player.name.includes(this.getPlayerName(playerToken))
		// );
		// const leftPlayerIndex: number = (playerIndex - 1 + numPlayers) % numPlayers;
		// const rightPlayerIndex: number = (playerIndex + 1) % numPlayers;

		// const playerToLeft: PlayerDto = players[leftPlayerIndex];
		// const playerToRight: PlayerDto = players[rightPlayerIndex];
		// const playerDice: number[] = game.players[playerIndex].dice;
		// let playerTurn: 'player' | 'left' | 'right';
		// if (game.currentPlayer == playerIndex) {
		// 	playerTurn = 'player';
		// } else if (playerIndex >= leftPlayerIndex) {
		// 	playerTurn = 'left';
		// } else {
		// 	playerTurn = 'right';
		// }

		// const gameDetails: GameDto = {
		// 	left: playerToLeft,
		// 	right: playerToRight,
		// 	dice: playerDice,
		// 	turn: playerTurn
		// };

		// return gameDetails;

		throw new Error('not implemented');
	}

	public async placeBid(bid: Bid, playerToken: string): Promise<void> {
		const gameCode = this.getGameCode(playerToken);
		const game: Game | undefined = await gameRepository.getGame(gameCode);
		if (!game) {
			throw new Error('Game is undefined');
		}

		throw new Error('not implemented');
	}

	public async challengeBid(bid: Bid, playerToken: string): Promise<void> {
		throw new Error('not implemented');
	}

	public async peekDice(playerToken: string): Promise<void> {
		throw new Error('not implemented');
	}

	public generateCode() {
		const firstPart = (Math.random() * 46656) | 0;
		const secondPart = (Math.random() * 46656) | 0;
		return ('000' + firstPart.toString(36)).slice(-3) + ('000' + secondPart.toString(36)).slice(-3);
	}

	private getGameCode(playerToken: string): string {
		const splitToken: string[] = playerToken.split('-');
		return splitToken[1];
	}

	private getPlayerName(playerToken: string): string {
		const splitToken: string[] = playerToken.split('-');
		return splitToken[0];
	}

	private chooseStartingPlayer(numberOfPlayers: number, game: Game) {
		const numberRoller: Roller = new Roller();
		game.currentPlayer = numberRoller.randomNumber(numberOfPlayers);
	}

	private updateGameState(newState: GameState, game: Game) {
		game.state = newState;
	}
}

export const gameService = new GameService(gameRepository);
