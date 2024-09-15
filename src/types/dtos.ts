import type { Bid } from './types';

export type Opponent = {
	name: string;
	peeking: boolean;
	lastBid: Bid;
};

export type GameDto = {
	left: Opponent;
	right: Opponent;
	dice: number[];
	turn: 'player' | 'left' | 'right';
};

export type PlayerDto = {
	name: string;
};
