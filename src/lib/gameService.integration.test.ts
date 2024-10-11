import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GameService } from './gameService';
import { GameState } from '../types/types';
import { Roller } from './roller';
import { EventService } from './eventService';
import { EventInMemoryRepository as InMemoryEventRepository } from './eventInMemoryRepository';
import { GameDynamoDbRepository } from './gameDynamoDbRepository';
import { LOCALSTACK_CONFIG } from '../types/awsConfig';
import { GameBuilder } from './gameService.test';

const MOCK_RANDOM = 'aRandomValue';
const MOCK_START_PLAYER = 1;

describe.skip('[Integration] GameService with DynamoDB', () => {
	let repository: GameDynamoDbRepository;
	let service: GameService;

	let events: EventService;

	let roller: Roller;

	beforeEach(() => {
		repository = new GameDynamoDbRepository(LOCALSTACK_CONFIG);
		roller = new Roller();
		events = new EventService(new InMemoryEventRepository());
		service = new GameService(repository, events, roller);

		vi.spyOn(roller, 'randomNumber').mockReturnValue(MOCK_START_PLAYER);
		vi.spyOn(service, 'generateCode').mockReturnValue(MOCK_RANDOM);

		// all dice roll 1's
		vi.spyOn(roller, 'rollDice').mockImplementation((quantity) =>
			Array.from(Array(quantity), () => 1)
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('can run a full game', async () => {
		const gameCode = await service.createGame();
		const p1Code = await service.addPlayer('playerOne', gameCode);
		const p2Code = await service.addPlayer('playerTwo', gameCode);
		const p3Code = await service.addPlayer('playerThree', gameCode);
		await service.startGame(p1Code);

		// round 1: p2 starts and loses die
		await service.placeBid(2, 2, p2Code);
		await service.placeBid(3, 2, p3Code);
		await service.placeBid(4, 3, p1Code);
		await service.placeBid(6, 3, p2Code);
		await service.challengeBid(p3Code);

		// round 2: p2 makes an ill-advised challenge and loses a die
		await service.placeBid(1, 1, p1Code);
		await service.challengeBid(p2Code);

		// round 3: p2 survives p3's challenge
		await service.placeBid(2, 1, p3Code);
		await service.placeBid(3, 1, p1Code);
		await service.placeBid(7, 1, p2Code);
		await service.challengeBid(p3Code);

		// round 4 - 7: p2 keeps losing and is out of dice
		await service.placeBid(3, 1, p1Code);
		await service.challengeBid(p2Code);
		await service.placeBid(2, 1, p1Code);
		await service.placeBid(3, 1, p1Code);
		await service.challengeBid(p2Code);
		await service.placeBid(2, 1, p1Code);
		await service.placeBid(3, 1, p1Code);
		await service.challengeBid(p2Code);
		await service.placeBid(2, 1, p1Code);
		await service.placeBid(3, 1, p1Code);
		await service.challengeBid(p2Code);

		// round 8 - 13: p1 loses six rounds in a row and is out of dice
		await service.placeBid(2, 1, p3Code);
		await service.placeBid(20, 1, p1Code);
		await service.challengeBid(p3Code);
		await service.placeBid(20, 1, p1Code);
		await service.challengeBid(p3Code);
		await service.placeBid(20, 1, p1Code);
		await service.challengeBid(p3Code);
		await service.placeBid(20, 1, p1Code);
		await service.challengeBid(p3Code);
		await service.placeBid(20, 1, p1Code);
		await service.challengeBid(p3Code);
		await service.placeBid(20, 1, p1Code);
		await service.challengeBid(p3Code);

		const expectedState = new GameBuilder()
			.setState(GameState.Finished)
			.addPlayer('playerOne', MOCK_RANDOM, [])
			.addPlayer('playerTwo', MOCK_RANDOM, [])
			.addPlayer('playerThree', MOCK_RANDOM, [1, 1, 1, 1, 1])
			.setCurrentPlayer(2)
			.build();
		const savedGame = await repository.getGame(gameCode);
		expect(savedGame).toEqual(expectedState);
	});
});
