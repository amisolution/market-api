import { Proxy } from './lib/Proxy';
import { response } from './constants';

// types
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { ProxyResponse } from './types/ProxyResponse';

/**
 * Proxy function for oracles
 *
 * @method proxyAll
 * @param {APIGatewayProxyEvent} event   Events published by the supported AWS service,
 *                                       https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
 * @param {Context} context              AWS Lambda uses this parameter to provide details of your Lambda
 *                                       function's execution,
 *                                       https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Callback} callback            Return information back to the caller
 * @return {Handler}                     Returns the Handler
 */
const proxyAll: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  // Hand off to the proxy class
  const proxy = new Proxy(event);
  const proxyResult: ProxyResponse = await proxy.getProxyData();

  // Set the response body
  response.body = proxyResult.data;

  // Determine if success or error
  if (proxyResult.success) {
    response.headers['Content-Type'] = 'application/json; charset=utf-8';
  } else {
    response.statusCode = 502;
  }
  callback(null, response);
};

export { proxyAll };
