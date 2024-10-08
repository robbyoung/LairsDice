export enum GameState {
	Lobby = 'Lobby',
	InProgress = 'In Progress',
	Finished = 'Finished'
}

export enum PlayerDifficulty {
	Human = 'Human',
	Easy = 'Easy',
	Medium = 'Medium',
	Hard = 'Hard'
}

export type Bid = {
	dice: number;
	quantity: number;
};

export type Player = {
	name: string;
	code: string;
	dice: number[];
	difficulty: PlayerDifficulty;
};

export type Game = {
	code: string;
	state: GameState;
	currentPlayer: number | undefined;
	players: Player[];
	currentBid: Bid | undefined;
	maxPlayers: number;
	initialDiceCount: number;
};
