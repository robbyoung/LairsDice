import { type Bid } from './types';

export type Event = RoundStartEvent | PeekEvent | ChallengeEvent | BidEvent | GameEndEvent;

export enum EventType {
	RoundStart = 'RoundStart',
	Peek = 'Peek',
	Challenge = 'Challenge',
	Bid = 'Bid',
	GameEnd = 'GameEnd'
}

export interface RoundStartEvent {
	type: EventType.RoundStart;
	diceCounts: { name: string; diceCount: number }[];
}

export interface PeekEvent {
	type: EventType.Peek;
	peekerName: string;
}

export interface ChallengeEvent {
	type: EventType.Challenge;
	challengerName: string;
	defenderName: string;
	dicePool: { name: string; dice: number[] }[];
	bid: Bid;
	challengeSuccess: boolean;
}

export interface BidEvent {
	type: EventType.Bid;
	bidderName: string;
	bid: Bid;
}

export interface GameEndEvent {
	type: EventType.GameEnd;
	winnerName: string;
}
