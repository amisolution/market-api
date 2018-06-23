//import Web3 from 'web3';
import Web3 from 'web3';
import { Handler, Context, Callback } from 'aws-lambda';

import { Market } from '@marketprotocol/marketjs';
import { Response } from '../types/Response';
import { ITxParams } from '@marketprotocol/types';

const providerUrlRinkeby: string = process.env.PROVIDER_URL_RINKEBY;
const registryContractAddress: string = process.env.REGISTRY_CONTRACT_ADDRESS;

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
 * Get the all addresses in the whitelist
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
    const result = await market.getAddressWhiteListAsync(registryContractAddress);
    response.headers["Content-Type"] = "application/json; charset=utf-8";
    response.body = JSON.stringify(result);

  } catch (error) {
    response.statusCode = 502;
    response.body = error.message;
  }

  callback(null, response);
};

export { get }

/**
 * Add an addresses to the whitelist
 *
 * @method add
 * @param {Object} event         Events published by the supported AWS service, 
 *                               https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
 * @param {String} context       AWS Lambda uses this parameter to provide details of your Lambda function's
 *                               execution, https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Function} callback    Use it to explicitly return information back to the caller
 * @return {Function}            Returns the callback function
*/
const add: Handler = async (event: Object, context: Context, callback: Callback) => {
  const market: Market = new Market(new Web3.providers.HttpProvider(providerUrlRinkeby));

/*

  // get access to the POST body when running via the API Gateway
  let address;
  if (event.body && typeof event.body === 'string') {
      const body = JSON.parse(event.body);
      if (body.address) {
          address = body.address;
      }
  }

  if (!address) {
      response.statusCode = 400;
      response.body = "Data Validation: Address is missing.";
      callback(null, response);
      return;
  }

  // Check for a vaild address
  if (!utils.isAddress(address)) {
      response.statusCode = 400;
      response.body = `Data Validation: Not a valid address: ${address}`
      callback(null, response);
      return;
  }

  // @TODO is error checking needed here?
  const method = registry.methods.addAddressToWhiteList(address); 
  const tx = {
      from: process.env.OWNER_ADDRESS,
      to: process.env.CONTRACT_ADDRESS,
      gas: process.env.GAS_LIMIT,
      gasPrice: process.env.GAS_PRICE,
      data: method.encodeABI()
  };

  const signTransactionResult = await web3.eth.accounts.signTransaction(tx, process.env.OWNER_PRIVATE_KEY, (error, result) => result);
  const sendSignedTransactionResult = await  web3.eth.sendSignedTransaction(signTransactionResult.rawTransaction, (error, result) => result);
  response.headers["Content-Type"] = "application/json; charset=utf-8";
  response.body = JSON.stringify(sendSignedTransactionResult);


*/
  const txParams: ITxParams = {
  };

  try {
    const result = await market.addAddressToWhiteList('contractAddress', registryContractAddress, txParams);
    response.headers["Content-Type"] = "application/json; charset=utf-8";
    response.body = JSON.stringify(result);

  } catch (error) {
    response.statusCode = 502;
    response.body = error.message;
  }

  callback(null, response);
}