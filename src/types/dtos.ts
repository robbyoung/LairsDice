import type { Bid } from './types';

export type OpponentDto = {
	name: string;
	lastBid: Bid | undefined;
	currentTurn: boolean;
};

export type GameDto = {
	opponents: OpponentDto[];
	dice: number[];
	playerTurn: boolean;
};

export type PlayerDto = {
	name: string;
};
