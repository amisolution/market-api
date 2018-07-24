import Contracts from './lib/Contracts';
import { response } from './constants';

// types
import { ContractsResponse } from './types/Responses';
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';

/**
 * Get the all the contracts in the contracts table.
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
const get: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  // Hand off to the Contracts class
  const contracts = new Contracts(event);
  const contractsResult: ContractsResponse = await contracts.getContractsData();

  // Set the response body
  response.body = contractsResult.data;

  // Determine if success or error
  if (contractsResult.success) {
    response.headers['Content-Type'] = 'application/json; charset=utf-8';
  } else {
    response.statusCode = 502;
  }
  callback(null, response);
};

export { get };
