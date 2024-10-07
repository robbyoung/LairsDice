import { type Event } from '../types/event';
import type { IEventRepository } from '../types/interfaces';

export class EventDynamoDbRepository implements IEventRepository {
	savePlayerEvent(playerCode: string, event: Event): Promise<void> {
		throw new Error('Method not implemented.');
	}
	getPlayerEvents(playerCode: string): Promise<Event[]> {
		throw new Error('Method not implemented.');
	}
	deletePlayerEvents(playerCode: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
