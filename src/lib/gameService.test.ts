import { describe, expect, it, vi } from 'vitest';
import { GameService } from './gameService';
import { GameRepository } from './gameRepository';

describe('GameService', () => {
	it('can create a new game', () => {
		const repository = new GameRepository();
		const spy = vi.spyOn(repository, 'saveGame');
		const service = new GameService(repository);

		service.createGame();

		expect(spy).toBeCalledTimes(1);
	});
});
