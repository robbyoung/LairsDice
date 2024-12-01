import type { GameDto, PlayerDto } from '../types/dtos';

export interface CreateGameResponse {
	gameCode: string;
}

export async function createGame(): Promise<CreateGameResponse> {
	const response = await fetch('/api/createGame', { method: 'POST' });

	if (!response.ok) {
		throw new Error(`/createGame returned status ${response.status}`);
	}

	const json = await response.json();
	return json as CreateGameResponse;
}

export interface AddPlayerResponse {
	playerToken: string;
}

export async function addPlayer(name: string, gameCode: string): Promise<AddPlayerResponse> {
	const body = JSON.stringify({
		name,
		gameCode
	});
	const response = await fetch('/api/addPlayer', {
		method: 'POST',
		body
	});

	if (!response.ok) {
		throw new Error(`/addPlayer returned status ${response.status}`);
	}

	const json = await response.json();
	return json as AddPlayerResponse;
}

export type GetPlayersResponse = PlayerDto[];

export async function getPlayers(playerToken: string): Promise<GetPlayersResponse> {
	const response = await fetch('/api/getPlayers', {
		method: 'GET',
		headers: {
			'Player-Token': playerToken
		}
	});

	if (!response.ok) {
		throw new Error(`/getPlayers returned status ${response.status}`);
	}

	const json = await response.json();
	return json as GetPlayersResponse;
}

export async function startGame(playerToken: string): Promise<void> {
	const response = await fetch('/api/startGame', {
		method: 'POST',
		headers: {
			'Player-Token': playerToken
		}
	});

	if (!response.ok) {
		throw new Error(`/startGame returned status ${response.status}`);
	}
}

export type GetGameResponse = GameDto;

export async function getGame(playerToken: string): Promise<GetGameResponse> {
	const response = await fetch('/api/getGame', {
		method: 'GET',
		headers: {
			'Player-Token': playerToken
		}
	});

	if (!response.ok) {
		throw new Error(`/getGame returned status ${response.status}`);
	}

	const json = await response.json();
	return json as GetGameResponse;
}
