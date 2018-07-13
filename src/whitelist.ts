import Web3 from 'web3';
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';

import { Market } from '@marketprotocol/marketjs';
import { configRinkeby, constants, response } from './constants';

/**
 * Get the all addresses in the whitelist
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
  const market: Market = new Market(
    new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY),
    configRinkeby
  );

  try {
    const result = await market.getAddressWhiteListAsync();
    response.headers['Content-Type'] = 'application/json; charset=utf-8';
    response.body = JSON.stringify(result);
  } catch (error) {
    response.statusCode = 502;
    response.body = error.message;
  }

  callback(null, response);
};

export { get };
