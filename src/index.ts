import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { response } from './constants';

/**
 * Get the index message of the API
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
  const message: Object = {
    name: 'MARKET API Gateway',
    description: 'Welcome to the MARKET API Gateway',
    version: '0.0.4',
    docs: 'https://docs.marketprotocol.io'
  };
  response.headers['Content-Type'] = 'application/json; charset=utf-8';
  response.body = JSON.stringify(message);

  callback(null, response);
};

export { get };
