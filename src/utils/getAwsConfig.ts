import type { AwsConfig } from '../types/awsConfig';

declare const process: {
	env: {
		LD_AWS_ACCESS_KEY_ID: string | undefined;
		LD_AWS_SECRET_ACCESS_KEY: string | undefined;
		LD_AWS_REGION: string | undefined;
	};
};

export function getAwsConfig(): AwsConfig {
	const accessKeyId = process.env['LD_AWS_ACCESS_KEY_ID'];
	const secretAccessKey = process.env['LD_AWS_SECRET_ACCESS_KEY'];
	const region = process.env['LD_AWS_REGION'];

	if (accessKeyId && secretAccessKey && region) {
		return {
			credentials: {
				accessKeyId,
				secretAccessKey
			},
			region
		};
	}

	return LOCALSTACK_CONFIG;
}

export const LOCALSTACK_CONFIG = {
	endpoint: 'http://localhost:4566',
	credentials: {
		accessKeyId: 'test',
		secretAccessKey: 'test'
	},
	region: 'us-east-1'
};
