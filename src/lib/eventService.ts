import {
	EventType,
	type BidEvent,
	type ChallengeEvent,
	type Event,
	type GameEndEvent,
	type PeekEvent,
	type RoundStartEvent,
	type TurnStartEvent
} from '../types/event';
import type { Bid, Player } from '../types/types';
import { eventRepository, type EventRepository } from './eventRepository';

export class EventService {
	constructor(private repository: EventRepository) {}

	public async popPlayerEvents(playerCode: string): Promise<Event[]> {
		const events = await this.repository.getPlayerEvents(playerCode);
		await this.repository.deletePlayerEvents(playerCode);

		return events;
	}

	public async recordRoundStart(players: Player[]): Promise<void> {
		const event: RoundStartEvent = {
			type: EventType.RoundStart,
			diceCounts: players.map((p) => ({ name: p.name, diceCount: p.dice.length }))
		};

		for (const player of players) {
			await this.repository.savePlayerEvent(player.code, event);
		}
	}

	public async recordBidEvent(players: Player[], bid: Bid, biddingPlayer: Player): Promise<void> {
		const event: BidEvent = {
			type: EventType.Bid,
			bid,
			bidderName: biddingPlayer.name
		};

		for (const player of players) {
			await this.repository.savePlayerEvent(player.code, event);
		}
	}

	public async recordChallengeEvent(
		players: Player[],
		bid: Bid,
		challenger: Player,
		defender: Player,
		challengeSuccess: boolean
	): Promise<void> {
		const dicePool = players.map((p) => ({ name: p.name, dice: [...p.dice] }));
		const event: ChallengeEvent = {
			type: EventType.Challenge,
			challengerName: challenger.name,
			defenderName: defender.name,
			bid,
			dicePool,
			challengeSuccess
		};

		for (const player of players) {
			await this.repository.savePlayerEvent(player.code, event);
		}
	}

	public async recordGameEndEvent(players: Player[], winnerName: string): Promise<void> {
		const event: GameEndEvent = {
			type: EventType.GameEnd,
			winnerName
		};

		for (const player of players) {
			await this.repository.savePlayerEvent(player.code, event);
		}
	}

	public async recordPeekEvent(players: Player[], peekerName: string): Promise<void> {
		const event: PeekEvent = {
			type: EventType.Peek,
			peekerName
		};

		for (const player of players) {
			if (player.name !== peekerName) {
				await this.repository.savePlayerEvent(player.code, event);
			}
		}
	}

	public async recordTurnStartEvent(playerCode: string): Promise<void> {
		const event: TurnStartEvent = {
			type: EventType.TurnStart
		};

		await this.repository.savePlayerEvent(playerCode, event);
	}
}

export const eventService = new EventService(eventRepository);
