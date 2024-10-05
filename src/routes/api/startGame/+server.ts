import { gameService } from '$lib/gameService';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
	const playerToken = req.request.headers.
	const code = await gameService.createGame();
	return json({ gameCode: code }, { status: 200 });
}
