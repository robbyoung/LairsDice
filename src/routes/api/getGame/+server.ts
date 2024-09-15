import { json } from '@sveltejs/kit';

export async function GET() {
	return json({ result: 'good' }, { status: 200 });
}
