export interface AwsConfig {
	endpoint?: string;
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	region: string;
}
