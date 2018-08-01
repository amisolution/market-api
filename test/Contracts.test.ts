import Contracts from '../src/lib/Contracts';
import { ContractsResponse } from '../src/types/Responses';
import AWS = require('aws-sdk');

// types
import { APIGatewayProxyEvent } from 'aws-lambda';

const event: APIGatewayProxyEvent = {
  pathParameters: {
    quantity: 2,
    id: 2
  },
  httpMethod: 'HEAD',
  body:
    '{"isWhitelisted": true, "collateralTokenName":"Stable USD", "collateralTokenSymbol":"USDT"}'
};

const eventReset: APIGatewayProxyEvent = {
  httpMethod: 'HEAD'
};

// Grab this from aws-cli parameter store
// const secretsmanager = new AWS.SecretsManager();
// secretsmanager.getSecretValue(params, function (err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

const dbConfig = {
  host: 'marketprotocol.chmykjsh2q5d.us-east-1.rds.amazonaws.com',
  database: 'order_book_dev',
  user: 'lambda_user_dev',
  password: 'mJEDn8zRtj?GxW',
  port: '5432'
};

describe('Contracts', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  it('Resets the dev contracts db', async () => {
    const contracts = new Contracts(eventReset, dbConfig);
    await contracts.resetContractData();
    //
  });
});
