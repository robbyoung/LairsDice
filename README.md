# Liar's Dice

A SvelteKit implementation of the liar's dice game.

### Build Commands

`npm install` to install required packages

`npm run dev` for local dev with in-memory storage

`npm run dev:aws` for local dev with a connection to AWS

- Pulls credentials from `env/.env.production`
- If credentials / region aren't found, will use LocalStack

`npm run lint` to run ESLint / Prettier

`npm run prettier` to format codebase

`npm run test` to run tests

- Integration tests are skipped by default, and require LocalStack to be running.

### LocalStack Setup

To run integration tests, get LocalStack to mock out the AWS connections - see LocalStack's getting started documentation [here](https://docs.localstack.cloud/getting-started/installation/).
