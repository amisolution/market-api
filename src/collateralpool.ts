//import Web3 from 'web3';
import Web3 from 'web3';
import { Handler, Context, Callback } from 'aws-lambda';

import { Market } from '@marketprotocol/marketjs';
import { Response } from '../types/Response';

const providerUrlRinkeby: string = process.env.PROVIDER_URL_RINKEBY;
const contractAddress: string = process.env.MARKET_CONTRACT_ADDRESS_1;

// Create a standard response object
const response: Response = {
  statusCode: 200,
  headers: {
    "Content-Type": "text/plain; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  },
  body: "",
  isBase64Encoded: false
};

/**
 * Gets the collateral pool contract address
 * @param {Object} event         Events published by the supported AWS service, 
 *                               https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
 * @param {Context} context      AWS Lambda uses this parameter to provide details of your Lambda, function's 
 *                               execution, https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Function} callback    Use it to explicitly return information back to the caller
 * @returns {Function}           Returns the callback function
 */
const get: Handler = async (event: Object, context: Context, callback: Callback) => {
  const market: Market = new Market(new Web3.providers.HttpProvider(providerUrlRinkeby));

  try {
    const result = await market.getCollateralPoolContractAddressAsync(contractAddress);
    response.headers["Content-Type"] = "application/json; charset=utf-8";
    response.body = JSON.stringify(result);
    
  } catch (error) {
    response.statusCode = 502;
    response.body = error.message;
  }

  callback(null, response);
};

export { get }