import {
	DynamoDB,
	type CreateTableInput,
	type GetItemInput,
	type GetItemOutput,
	type PutItemInput
} from '@aws-sdk/client-dynamodb';
import type { IGameRepository } from '../types/interfaces';
import { type Game } from '../types/types';

const TableName = 'LIARSDICE_GAMES';

export class GameDynamoDbRepository implements IGameRepository {
	private ddbClient: DynamoDB;
	private tableExists: boolean;

	constructor() {
		this.ddbClient = new DynamoDB();
		this.tableExists = false;
	}

	public async getGame(code: string): Promise<Game | undefined> {
		await this.ensureTableExists();

		const req: GetItemInput = {
			TableName,
			Key: {
				GAME_CODE: {
					S: code
				}
			},
			ProjectionExpression: 'CONTENT'
		};

		const response = await new Promise<GetItemOutput | undefined>((resolve) => {
			this.ddbClient.getItem(req, (err, data) => {
				if (err) {
					resolve(undefined);
				}

				resolve(data);
			});
		});

		if (!response || !response.Item) {
			return undefined;
		}

		const contentString = response.Item['CONTENT'].S;

		return contentString ? (JSON.parse(contentString) as Game) : undefined;
	}

	public async saveGame(game: Game): Promise<void> {
		await this.ensureTableExists();

		const stringContent = JSON.stringify(game);
		const req: PutItemInput = {
			TableName,
			Item: {
				GAME_CODE: { S: game.code },
				CONTENT: { S: stringContent }
			}
		};

		await new Promise<void>((resolve, reject) => {
			this.ddbClient.putItem(req, (err) => {
				if (err) {
					reject(err);
				}

				resolve();
			});
		});
	}

	private async ensureTableExists(): Promise<void> {
		if (this.tableExists) return;

		const tableFound = await new Promise<boolean>((resolve) => {
			this.ddbClient.describeTable({ TableName }, (err) => {
				if (err) {
					resolve(false);
				}

				resolve(true);
			});
		});

		if (!tableFound) {
			await this.createTable();
		}

		this.tableExists = true;
	}

	private async createTable(): Promise<void> {
		const params: CreateTableInput = {
			TableName,
			KeySchema: [
				{
					AttributeName: 'GAME_CODE',
					KeyType: 'HASH'
				}
			],
			AttributeDefinitions: [
				{
					AttributeName: 'GAME_CODE',
					AttributeType: 'S'
				},
				{
					AttributeName: 'CONTENT',
					AttributeType: 'S'
				}
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 1,
				WriteCapacityUnits: 1
			}
		};

		return new Promise<void>((resolve, reject) => {
			this.ddbClient.createTable(params, (err) => {
				if (err) {
					reject(err);
				}

				resolve();
			});
		});
	}
}
