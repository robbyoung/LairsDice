import { gameService } from '$lib/gameService';
import { json } from '@sveltejs/kit';

export async function POST() {
	const code = await gameService.createGame();
	return json({ gameCode: code }, { status: 200 });
}
