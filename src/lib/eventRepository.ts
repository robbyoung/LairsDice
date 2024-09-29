import { type Event } from '../types/event';

export class EventRepository {
	private playerEvents: { [playerCode: string]: Event[] };

	constructor() {
		this.playerEvents = {};
	}

	public async savePlayerEvent(playerCode: string, event: Event): Promise<void> {
		if (!this.playerEvents[playerCode]) {
			this.playerEvents[playerCode] = [];
		}

		this.playerEvents[playerCode].push(event);
	}

	public async getPlayerEvents(playerCode: string): Promise<Event[]> {
		return Promise.resolve(this.playerEvents[playerCode] ?? []);
	}

	public async deletePlayerEvents(playerCode: string): Promise<void> {
		delete this.playerEvents[playerCode];
	}
}

export const eventRepository = new EventRepository();
