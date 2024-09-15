/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GameDto, PlayerDto } from '../types/dtos';
import { GameState, type Bid, type Game } from '../types/types';
import { gameRepository, GameRepository } from './gameRepository';

export class GameService {
	constructor(private repository: GameRepository) {}

	public createGame(): string {
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

	public addPlayer(name: string, gameCode: string): string {
		throw new Error('not implemented');
	}

	public getPlayers(name: string, gameCode: string): PlayerDto[] {
		throw new Error('not implemented');
	}

	public startGame(gameCode: string): void {
		throw new Error('not implemented');
	}

	public getGame(playerToken: string): GameDto {
		throw new Error('not implemented');
	}

	public placeBid(bid: Bid, playerToken: string): void {}

	public challengeBid(bid: Bid, playerToken: string): void {}

	public peekDice(playerToken: string): void {}

	private generateCode() {
		const firstPart = (Math.random() * 46656) | 0;
		const secondPart = (Math.random() * 46656) | 0;
		return ('000' + firstPart.toString(36)).slice(-3) + ('000' + secondPart.toString(36)).slice(-3);
	}
}

export const gameService = new GameService(gameRepository);
