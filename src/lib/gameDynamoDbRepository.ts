import { type CreateTableOutput } from 'aws-sdk/clients/dynamodb';
import type { IGameRepository } from '../types/interfaces';
import { type Game } from '../types/types';
import { DynamoDB } from 'aws-sdk';

const TableName = 'LIARSDICE_GAMES';

export class GameDynamoDbRepository implements IGameRepository {
	private ddbClient: DynamoDB;
	private tableExists: boolean;

	constructor() {
		this.ddbClient = new DynamoDB();
		this.tableExists = false;
	}

	public async getGame(code: string): Promise<Game | undefined> {
		this.ensureTableExists();

		const req: DynamoDB.Types.GetItemInput = {
			TableName,
			Key: {
				GAME_CODE: {
					S: code
				}
			},
			ProjectionExpression: 'CONTENT'
		};

		const response = await new Promise<DynamoDB.Types.GetItemOutput | undefined>((resolve) => {
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
		throw new Error('Method not implemented.');
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

	private async createTable(): Promise<CreateTableOutput> {
		const params: DynamoDB.Types.CreateTableInput = {
			TableName,
			KeySchema: [
				{
					AttributeName: 'GAME_CODE',
					KeyType: 'String'
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

		return new Promise<CreateTableOutput>((resolve, reject) => {
			this.ddbClient.createTable(params, (err, data) => {
				if (err) {
					reject(err);
				}

				resolve(data);
			});
		});
	}
}
