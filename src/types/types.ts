export enum GameState {
	Lobby = 'Lobby',
	InProgress = 'In Progress',
	Finished = 'Finished'
}

export enum BotDifficulty {
	Normal = 'Normal'
}

export type Bid = {
	dice: number;
	quantity: number;
};

export type Player = {
	name: string;
	code: string;
	dice: number[];
	isHuman: boolean;
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
