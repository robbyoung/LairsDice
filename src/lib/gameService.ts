import { GameState, type Game } from '../types/types';
import { gameRepository, GameRepository } from './gameRepository';

export class GameService {
	constructor(private repository: GameRepository) {}

	createGame() {
		const game: Game = {
			state: GameState.Lobby,
			code: this.generateCode(),
			currentPlayer: undefined,
			players: [],
			currentBid: undefined
		};

		this.repository.saveGame(game);

		return game.code;
	}

	generateCode() {
		let firstPart = (Math.random() * 46656) | 0;
		let secondPart = (Math.random() * 46656) | 0;
		return ('000' + firstPart.toString(36)).slice(-3) + ('000' + secondPart.toString(36)).slice(-3);
	}
}

export const gameService = new GameService(gameRepository);
