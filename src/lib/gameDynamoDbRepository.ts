import {
	CreateTableCommand,
	DescribeTableCommand,
	DynamoDBClient,
	ResourceNotFoundException
} from '@aws-sdk/client-dynamodb';
import type { IGameRepository } from '../types/interfaces';
import { type Game } from '../types/types';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { LOCALSTACK_CONFIG, type AwsConfig } from '../types/awsConfig';

const TableName = 'LIARSDICE_GAMES';

export class GameDynamoDbRepository implements IGameRepository {
	private ddbClient: DynamoDBClient;

	constructor(config?: AwsConfig) {
		if (!config) {
			config = LOCALSTACK_CONFIG;
		}

		this.ddbClient = new DynamoDBClient(config);

		this.ensureTableExists();
	}

	public async getGame(code: string): Promise<Game | undefined> {
		const req = new GetCommand({
			TableName,
			Key: {
				GameCode: code
			}
		});

		const response = await this.ddbClient.send(req);

		if (!response || !response.Item) {
			return undefined;
		}

		const contentString = response.Item['Content'];

		return contentString ? (JSON.parse(contentString) as Game) : undefined;
	}

	public async saveGame(game: Game): Promise<void> {
		const req = new PutCommand({
			TableName,
			Item: {
				GameCode: game.code,
				Content: JSON.stringify(game)
			}
		});

		await this.ddbClient.send(req);
	}

	private async ensureTableExists(): Promise<void> {
		const req = new DescribeTableCommand({ TableName });

		try {
			await this.ddbClient.send(req);
		} catch (e) {
			if (e instanceof ResourceNotFoundException) {
				await this.createTable();
			}
		}
	}

	private async createTable(): Promise<void> {
		const req = new CreateTableCommand({
			TableName,
			KeySchema: [
				{
					AttributeName: 'GameCode',
					KeyType: 'HASH'
				}
			],
			AttributeDefinitions: [
				{
					AttributeName: 'GameCode',
					AttributeType: 'S'
				}
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 1,
				WriteCapacityUnits: 1
			}
		});

		await this.ddbClient.send(req);
	}
}
