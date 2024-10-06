import { gameService } from '$lib/gameService';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
	try {
		const playerToken = event.request.headers.get('player-token') ?? '';
		const response = await gameService.getPlayers(playerToken);
		return json(response, { status: 200 });
	} catch (e) {
		const message: string = e instanceof Error ? e.message : 'unknown error';
		return error(500, message);
	}
}
