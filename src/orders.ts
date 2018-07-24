import { Orders } from './lib/Orders';
import { response } from './constants';
import { isEventEmpty } from './utils';

// types
import { OrdersResponse } from './types/Responses';
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';

/**
 * Get the all addresses in the whitelist
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
  // Get the path parameter for the address
  let marketContractAddress: string = '';
  if (!isEventEmpty(event, '$.pathParameters.address')) {
    marketContractAddress = event.pathParameters.address;
  }

  // Get the path parameter for the address
  let quantity: number = 0;
  if (!isEventEmpty(event, '$.pathParameters.quantity')) {
    quantity = parseInt(event.pathParameters.quantity, 10);
  }

  // Hand off to the Orders class
  const orders = new Orders();
  const signedOrders: OrdersResponse = await orders.getOrders(
    marketContractAddress,
    quantity
  );

  // Set response body
  response.body = signedOrders.data;

  // Determine if success or error
  if (signedOrders.success) {
    response.headers['Content-Type'] = 'application/json; charset=utf-8';
  } else {
    response.statusCode = 502;
  }
  callback(null, response);
};

export { get };
