import type { Bid, GameState } from './types';

export type GameDto = {
	players: PlayerDto[];
	state: GameState;
};

export type PlayerDto = {
	name: string;
	dice?: number[];
	lastBid?: Bid;
	currentTurn?: boolean;
};
