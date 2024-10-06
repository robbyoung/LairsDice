import { gameService } from '$lib/gameService';
import { error, json } from '@sveltejs/kit';

export async function POST() {
	try {
		const code = await gameService.createGame();
		return json({ gameCode: code }, { status: 200 });
	} catch (e) {
		const message: string = e instanceof Error ? e.message : 'unknown error';
		return error(500, message);
	}
}
