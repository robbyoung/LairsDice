import { EventType, type Event, type RoundStartEvent } from '../types/event';
import type { Player } from '../types/types';
import { eventRepository, type EventRepository } from './eventRepository';

export class EventService {
	constructor(private repository: EventRepository) {}

	public async popPlayerEvents(playerCode: string): Promise<Event[]> {
		const events = await this.repository.getPlayerEvents(playerCode);
		await this.repository.deletePlayerEvents(playerCode);

		return events;
	}

	public async recordRoundStart(players: Player[], roundNumber: number): Promise<void> {
		const event: RoundStartEvent = {
			type: EventType.RoundStart,
			roundNumber
		};

		for (const player of players) {
			await this.repository.savePlayerEvent(player.code, event);
		}
	}
}

export const eventService = new EventService(eventRepository);
