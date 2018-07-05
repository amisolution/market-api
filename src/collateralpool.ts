import Web3 from 'web3';
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { configRinkeby, constants, response } from './constants';
import { isEventEmpty } from './utils';

import { Market } from '@marketprotocol/marketjs';
import { Response } from './types/Response';

// Create a standard response object
const returnResponse: Response = response;

/**
 * Gets the collateral pool contract address
 * @param {APIGatewayProxyEvent} event    Events published by the supported AWS service, 
 *                                        https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
 * @param {Context} context               AWS Lambda uses this parameter to provide details of your Lambda,
 *                                        function's execution, 
 *                                        https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Function} callback             Use it to explicitly return information back to the caller
 * @returns {Function}                    Returns the callback function
 */
const get: Handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  const market: Market = new Market(new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY), configRinkeby);

  // Get the path parameter for the address
  let marketContractAddress: string;
  if (!isEventEmpty(event, 'pathParameters', 'address')) {
    marketContractAddress = event.pathParameters.address;
  }

  // Return the collateral pool address
  try {
    const result = await market.getCollateralPoolContractAddressAsync(marketContractAddress);
    returnResponse.headers['Content-Type'] = 'application/json; charset=utf-8';
    returnResponse.body = JSON.stringify(result);
    
  } catch (error) {
    returnResponse.statusCode = 502;
    returnResponse.body = error.message;
  }

  callback(null, returnResponse);
};

export { get };