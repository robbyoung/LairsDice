import type { Game } from './types';
import type { Event } from './event';

export interface IGameRepository {
	getGame(code: string): Promise<Game | undefined>;
	saveGame(game: Game): Promise<void>;
}

export interface IEventRepository {
	savePlayerEvent(playerCode: string, event: Event): Promise<void>;
	getPlayerEvents(playerCode: string): Promise<Event[]>;
	deletePlayerEvents(playerCode: string): Promise<void>;
}
