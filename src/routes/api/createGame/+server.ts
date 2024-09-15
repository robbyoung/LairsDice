import { gameService } from '$lib/gameService';
import { json } from '@sveltejs/kit';

export async function POST() {
	const code = gameService.createGame();
	return json({ result: code }, { status: 200 });
}
