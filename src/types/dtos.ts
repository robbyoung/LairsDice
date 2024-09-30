import type { Bid } from './types';

export type OpponentDto = {
	name: string;
	lastBid: Bid | undefined;
};

export type GameDto = {
	opponents: OpponentDto[];
	dice: number[];
	turn: number;
};

export type PlayerDto = {
	name: string;
};
