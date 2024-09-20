import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { GameService } from './gameService';
import { GameRepository } from './gameRepository';
import { GameState, type Bid, type Game, type Player } from '../types/types';

const MOCK_RANDOM = 'aRandomValue';

describe('GameService', () => {
	let repository: GameRepository;
	let service: GameService;
	let savedGame: Game | undefined;
	let saveSpy: MockInstance;
	let getSpy: MockInstance;

	beforeEach(() => {
		repository = new GameRepository();
		service = new GameService(repository);
		savedGame = undefined;
		saveSpy = vi.spyOn(repository, 'saveGame');
		saveSpy.mockImplementation(async (game) => {
			savedGame = game;
		});

		getSpy = vi.spyOn(repository, 'getGame');

		vi.spyOn(service, 'generateCode').mockReturnValue(MOCK_RANDOM);
	});

	describe('createGame()', () => {
		it('creates an empty game lobby', async () => {
			const returnCode = await service.createGame();

			const expectedState = new GameBuilder().setState(GameState.Lobby).build();
			expect(savedGame).toStrictEqual(expectedState);
			expect(returnCode, 'returns game code').toBe(savedGame?.code);
		});
	});

	describe.skip('addPlayer()', async () => {
		it('can add a player to a lobby', async () => {
			const initialState = new GameBuilder().setState(GameState.Lobby).build();
			getSpy.mockResolvedValue(initialState);

			const returnToken = await service.addPlayer('aName', initialState.code);

			const expectedState = new GameBuilder()
				.setState(GameState.Lobby)
				.addPlayer('aName', MOCK_RANDOM, [])
				.build();
			expect(savedGame).toStrictEqual(expectedState);
			expect(returnToken, 'returns player token').toBe(`${MOCK_RANDOM}-${MOCK_RANDOM}`);
		});

		it('throws if the lobby is full', async () => {
			const initialState = new GameBuilder().setState(GameState.Lobby).fillRemainingSeats().build();
			getSpy.mockResolvedValue(initialState);

			const func = async () => await service.addPlayer('aName', initialState.code);

			expect(func).toThrowError();
		});

		it('throws if the game is in progress', async () => {
			const initialState = new GameBuilder()
				.setState(GameState.InProgress)
				.fillRemainingSeats()
				.build();
			getSpy.mockResolvedValue(initialState);

			const func = async () => await service.addPlayer('aName', initialState.code);

			expect(func).toThrowError();
		});

		it('throws if the game does not exist', async () => {
			const initialState = new GameBuilder().setState(GameState.Lobby).build();
			getSpy.mockResolvedValue(initialState);

			const func = async () => await service.addPlayer('aName', 'aBadCode');

			expect(func).toThrowError();
		});
	});

	describe.skip('startGame()', async () => {
		it('can be used by p1 to start a game with a full lobby', async () => {
			const initialState = new GameBuilder().setState(GameState.Lobby).fillRemainingSeats().build();
			getSpy.mockResolvedValue(initialState);

			// player token is <GAME_CODE>-<PLAYER-CODE>
			const playerOneToken = `${initialState.players[0].code}-${initialState.code}`;
			await service.startGame(playerOneToken);

			const expectedState = new GameBuilder()
				.setState(GameState.InProgress)
				.fillRemainingSeats()
				.setCurrentPlayer(0)
				.build();
			expect(savedGame).toStrictEqual(expectedState);
		});

		it('throws if the game does not exist', async () => {
			const initialState = new GameBuilder().setState(GameState.Lobby).fillRemainingSeats().build();
			getSpy.mockResolvedValue(initialState);

			const badToken = `${initialState.players[0].code}-aBadGameCode`;
			const func = async () => await service.startGame(badToken);

			expect(func).toThrowError();
		});

		it('throws if the player is not p1', async () => {
			const initialState = new GameBuilder().setState(GameState.Lobby).fillRemainingSeats().build();
			getSpy.mockResolvedValue(initialState);

			const playerTwoToken = `${initialState.players[1].code}-${initialState.code}`;
			const func = async () => await service.startGame(playerTwoToken);

			expect(func).toThrowError();
		});

		it('throws if the lobby is not full', async () => {
			const initialState = new GameBuilder()
				.setState(GameState.Lobby)
				.addPlayer('aName', 'aCode', [])
				.build();
			getSpy.mockResolvedValue(initialState);

			const playerOneToken = `${initialState.players[0].code}-${initialState.code}`;
			const func = async () => await service.startGame(playerOneToken);

			expect(func).toThrowError();
		});
	});
});

class GameBuilder {
	private game: Game;

	constructor() {
		this.game = {
			state: GameState.Lobby,
			code: MOCK_RANDOM,
			players: [],
			currentBid: undefined,
			currentPlayer: undefined,
			maxPlayers: 8,
			numberOfPlayers: 0,
			initialDiceCount: 6
		};
	}

	setState(state: GameState): GameBuilder {
		this.game.state = state;

		return this;
	}

	addPlayer(name: string, code: string, dice: number[]): GameBuilder {
		const player: Player = {
			code,
			name,
			dice
		};
		this.game.players.push(player);

		return this;
	}

	fillRemainingSeats(): GameBuilder {
		while (this.game.players.length < 3) {
			const num = this.game.players.length;
			const player: Player = {
				name: `Player ${num}`,
				code: `p${num}`,
				dice: []
			};
			this.game.players.push(player);
		}

		return this;
	}

	setCurrentPlayer(playerIndex: number): GameBuilder {
		this.game.currentPlayer = playerIndex;

		return this;
	}

	setCurrentBid(bid: Bid): GameBuilder {
		this.game.currentBid = bid;

		return this;
	}

	build(): Game {
		return this.game;
	}
}
