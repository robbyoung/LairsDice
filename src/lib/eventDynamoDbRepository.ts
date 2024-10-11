import {
	CreateTableCommand,
	DescribeTableCommand,
	DynamoDBClient,
	ResourceNotFoundException
} from '@aws-sdk/client-dynamodb';
import { type Event } from '../types/event';
import type { IEventRepository } from '../types/interfaces';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { LOCALSTACK_CONFIG, type AwsConfig } from '../types/awsConfig';

const TableName = 'LiarsDice_Events';

export class EventDynamoDbRepository implements IEventRepository {
	private ddbClient: DynamoDBClient;
	private tableExists: boolean;

	constructor(config?: AwsConfig) {
		if (!config) {
			config = LOCALSTACK_CONFIG;
		}

		this.ddbClient = new DynamoDBClient(config);
		this.tableExists = false;
	}

	public async savePlayerEvent(playerCode: string, event: Event): Promise<void> {
		await this.ensureTableExists();

		const playerEvents = await this.getPlayerEvents(playerCode);

		playerEvents.push(event);

		const req = new PutCommand({
			TableName,
			Item: {
				PlayerCode: playerCode,
				Events: JSON.stringify(playerEvents)
			}
		});

		await this.ddbClient.send(req);
	}

	public async getPlayerEvents(playerCode: string): Promise<Event[]> {
		await this.ensureTableExists();

		const req = new GetCommand({
			TableName,
			Key: {
				PlayerCode: playerCode
			}
		});

		const response = await this.ddbClient.send(req);

		if (!response || !response.Item) {
			return [];
		}

		const eventListString = response.Item['Events'];

		return eventListString ? (JSON.parse(eventListString) as Event[]) : [];
	}

	public async deletePlayerEvents(playerCode: string): Promise<void> {
		await this.ensureTableExists();

		const req = new PutCommand({
			TableName,
			Item: {
				PlayerCode: playerCode,
				Events: JSON.stringify([])
			}
		});

		await this.ddbClient.send(req);
	}

	private async ensureTableExists(): Promise<void> {
		if (this.tableExists) {
			return;
		}

		const req = new DescribeTableCommand({ TableName });

		try {
			await this.ddbClient.send(req);
		} catch (e) {
			if (e instanceof ResourceNotFoundException) {
				await this.createTable();
			}
		}

		this.tableExists = true;
	}

	private async createTable(): Promise<void> {
		const req = new CreateTableCommand({
			TableName,
			KeySchema: [
				{
					AttributeName: 'PlayerCode',
					KeyType: 'HASH'
				}
			],
			AttributeDefinitions: [
				{
					AttributeName: 'PlayerCode',
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
