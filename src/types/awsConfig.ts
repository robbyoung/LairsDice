export interface AwsConfig {
	endpoint: string;
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	region: string;
}

export const LOCALSTACK_CONFIG = {
	endpoint: 'http://localhost:4566',
	credentials: {
		accessKeyId: 'test',
		secretAccessKey: 'test'
	},
	region: 'us-east-1'
};
