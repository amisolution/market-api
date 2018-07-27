import Contracts from './lib/Contracts';
import { response } from './constants';

// types
import { ContractsResponse } from './types/Responses';
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';

/**
 * Handles the contracts in the contracts table.
 *
 * @method get
 * @param {APIGatewayProxyEvent} event   Events published by the supported AWS service,
 *                                       https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
 * @param {Context} context              AWS Lambda uses this parameter to provide details of your Lambda,
 *                                       function's execution,
 *                                       https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Callback} callback            Use it to explicitly return information back to the caller
 * @returns {Handler}                    Returns the Handler
 */
const allMethods: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  let contracts;
  let contractsResult: ContractsResponse = {
    success: true,
    data: ''
  };

  // Generate the DB config object
  const dbConfig: Object = {
    host: process.env.RDS_HOST,
    database: process.env.RDS_DATABASE,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
  };

  // Get the http method and hand off to the Contracts class
  switch (event.httpMethod.toLowerCase()) {
    case 'get':
      contracts = new Contracts(event, dbConfig);
      contractsResult = await contracts.getContractsData();
      break;
    case 'post':
      contracts = new Contracts(event, dbConfig);
      contractsResult = await contracts.postContractData();
      break;
    case 'put':
      contracts = new Contracts(event, dbConfig);
      contractsResult = await contracts.putContractData();
      break;
    case 'delete':
      contracts = new Contracts(event, dbConfig);
      contractsResult = await contracts.deleteContractData();
      break;
    case 'head':
      contracts = new Contracts(event, dbConfig);
      contractsResult = await contracts.resetContractData();
      break;
    default:
      contractsResult.success = false;
      contractsResult.data = `Unsupported HTTP method: ${event.httpMethod}`;
  }

  // Assign the response body
  response.body = contractsResult.data;

  // Determine if success or error
  if (contractsResult.success) {
    response.headers['Content-Type'] = 'application/json; charset=utf-8';
  } else {
    response.statusCode = 502;
  }
  callback(null, response);
};

export { allMethods };
