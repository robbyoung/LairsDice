import { gameService } from '$lib/gameService';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
	try {
		const playerToken = event.request.headers.get('player-token') ?? '';
		await gameService.startGame(playerToken);
		return json('ok', { status: 200 });
	} catch (e) {
		const message: string = e instanceof Error ? e.message : 'unknown error';
		return error(500, message);
	}
}
