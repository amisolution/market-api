//import Web3 from 'web3';
import Web3 from 'web3';
import { Handler, Context, Callback } from 'aws-lambda';
import { BigNumber } from 'bignumber.js';

import { Market, Order, SignedOrder } from '@marketprotocol/marketjs';
import { Response } from '../types/Response';

const ownerAddress: string = process.env.OWNER_ADDRESS;
const providerUrlRinkeby: string = process.env.PROVIDER_URL_RINKEBY;
const orderLibAddress: string = process.env.ORDER_LIB_ADDRESS;
const contractAddress: string = process.env.MARKET_CONTRACT_ADDRESS_1;
const nullAddress: string = '0x0000000000000000000000000000000000000000';

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
  const expirationTimeStamp: BigNumber = new BigNumber(Math.floor(Date.now() / 1000) + 60 * 60);

  const order: Order = {
    contractAddress: contractAddress,
    expirationTimestamp: expirationTimeStamp,
    feeRecipient: nullAddress,
    maker: ownerAddress,
    makerFee: new BigNumber(0),
    orderQty: new BigNumber(100),
    price: new BigNumber(100000),
    remainingQty: new BigNumber(100),
    salt: new BigNumber(0),
    taker: nullAddress,
    takerFee: new BigNumber(0)
  };

  try {
    const orderHash = await market.createOrderHashAsync(orderLibAddress, order);
    console.log(`orderHash: ${orderHash}`);

    const signedOrderHash = await market.signOrderHashAsync(String(orderHash), ownerAddress);
    /*
    const signedOrder: SignedOrder = await market.createSignedOrderAsync(
      orderLibAddress,        // orderLibAddress: string
      contractAddress,        // contractAddress: string
      expirationTimeStamp,    // expirationTimestamp: BigNumber
      nullAddress,            // feeRecipient: string
      ownerAddress,           // maker: string
      new BigNumber(0),       // makerFee: BigNumber
      nullAddress,            // taker: string
      new BigNumber(0),       // takerFee: BigNumber
      new BigNumber(100),     // orderQty: BigNumber
      new BigNumber(100000),  // price: BigNumber
      new BigNumber(100),     // remainingQty: BigNumber
      new BigNumber(0)        // salt: BigNumber
    );
    */
    response.headers["Content-Type"] = "application/json; charset=utf-8";
    response.body = JSON.stringify({ orderHash, signedOrderHash });

  } catch (error) {
    response.statusCode = 502;
    response.body = error.message;
  }

  callback(null, response);
};

export { get }