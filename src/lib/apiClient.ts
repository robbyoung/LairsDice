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
