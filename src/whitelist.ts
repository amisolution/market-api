import Web3 from 'web3';
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';

import { Market } from '@marketprotocol/marketjs';
// import { ITxParams } from '@marketprotocol/types';
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
const get: Handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  const market: Market = new Market(new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY), configRinkeby);

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
/*
const add: Handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  const market: Market = new Market(new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY), configRinkeby);

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
  
};
*/

export { get };