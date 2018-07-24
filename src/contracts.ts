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

  // Get the http method and hand off to the Contracts class
  switch (event.httpMethod) {
    case 'GET':
      contracts = new Contracts(event);
      contractsResult = await contracts.getContractsData();
      break;
    case 'POST':
      contracts = new Contracts(event);
      contractsResult = await contracts.postContractData();
      break;
    case 'PUT':
      contracts = new Contracts(event);
      contractsResult = await contracts.putContractData();
      break;
    case 'DELETE':
      contracts = new Contracts(event);
      contractsResult = await contracts.deleteContractData();
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
