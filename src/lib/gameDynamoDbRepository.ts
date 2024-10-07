import type { IGameRepository } from '../types/interfaces';
import { type Game } from '../types/types';

export class GameDynamoDbRepository implements IGameRepository {
	getGame(code: string): Promise<Game | undefined> {
		throw new Error('Method not implemented.');
	}
	saveGame(game: Game): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
