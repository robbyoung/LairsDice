/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GameDto, PlayerDto } from '../types/dtos';
import { GameState, type Bid, type Game } from '../types/types';
import { gameRepository, GameRepository } from './gameRepository';

export class GameService {
	constructor(private repository: GameRepository) {}

	public async createGame(): Promise<string> {
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

	public async addPlayer(name: string, gameCode: string): Promise<string> {
		throw new Error('not implemented');
	}

	public async getPlayers(name: string, gameCode: string): Promise<PlayerDto[]> {
		throw new Error('not implemented');
	}

	public async startGame(gameCode: string): Promise<void> {
		throw new Error('not implemented');
	}

	public getGame(playerToken: string): Promise<GameDto> {
		throw new Error('not implemented');
	}

	public async placeBid(bid: Bid, playerToken: string): Promise<void> {}

	public async challengeBid(bid: Bid, playerToken: string): Promise<void> {}

	public async peekDice(playerToken: string): Promise<void> {}

	private generateCode() {
		const firstPart = (Math.random() * 46656) | 0;
		const secondPart = (Math.random() * 46656) | 0;
		return ('000' + firstPart.toString(36)).slice(-3) + ('000' + secondPart.toString(36)).slice(-3);
	}
}

export const gameService = new GameService(gameRepository);
