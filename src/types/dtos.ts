import type { Bid } from './types';

export type Opponent = {
	name: string;
	peeking: boolean;
	lastBid: Bid;
};

export type GameDto = {
	opponents: Opponent[];
	dice: number[];
	turn: number;
};

export type PlayerDto = {
	name: string;
};
