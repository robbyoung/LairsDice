import { describe, expect, it, vi } from 'vitest';
import { GameService } from './gameService';
import { GameRepository } from './gameRepository';
import { GameState, type Game } from '../types/types';

describe('GameService', () => {
	it('createGame() creates a new empty game lobby', async () => {
		const repository = new GameRepository();
		const service = new GameService(repository);
		const spy = vi.spyOn(repository, 'saveGame');
		let savedGame: Game | undefined;
		spy.mockImplementationOnce(async (game) => {
			savedGame = game;
			return Promise.resolve();
		});

		const returnCode = await service.createGame();

		expect(spy, 'saveGame() is called once').toBeCalledTimes(1);
		expect(savedGame?.code, 'game code is defined').toBeTruthy();
		expect(savedGame?.players, 'game lobby is empty').toHaveLength(0);
		expect(savedGame?.state, 'game has lobby state').toBe(GameState.Lobby);
		expect(returnCode, 'returns game code').toBe(savedGame?.code);
	});
});
