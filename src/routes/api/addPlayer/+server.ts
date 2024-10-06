import { gameService } from '$lib/gameService';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function POST(event: RequestEvent) {
	const body = await event.request.blob();
	const bodyJson = JSON.parse(await body.text());

	try {
		const code = await gameService.addPlayer(bodyJson.name, bodyJson.gameCode);

		return json({ playerToken: code }, { status: 200 });
	} catch (e) {
		const message: string = e instanceof Error ? e.message : 'unknown error';
		return error(500, message);
	}
}
