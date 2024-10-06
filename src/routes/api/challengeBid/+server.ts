import { gameService } from '$lib/gameService';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
	try {
		const playerToken = event.request.headers.get('player-token') ?? '';
		const response = await gameService.challengeBid(playerToken);

		return json({ playerToken: response }, { status: 200 });
	} catch (e) {
		const message: string = e instanceof Error ? e.message : 'unknown error';
		return error(500, message);
	}
}
