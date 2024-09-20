export enum GameState {
	Lobby = 'Lobby',
	InProgress = 'In Progress',
	Finished = 'Finished'
}

export type Bid = {
	dice: number;
	quantity: number;
};

export type Player = {
	name: string;
	code: string;
	dice: number[];
};

export type Game = {
	code: string;
	state: GameState;
	currentPlayer: number | undefined;
	players: Player[];
	currentBid: Bid | undefined;
	maxPlayers: number;
	numberOfPlayers: number;
	initialDiceCount: number;
};
