import Web3 from 'web3';
import { BigNumber } from 'bignumber.js';
let Account = require('eth-lib/lib/account');
// import { ec as EC } from 'elliptic';
// const secp256k1 = require('secp256k1/elliptic');
// import { secp256k1 }  from 'secp256k1';
let ethUtil = require('ethereumjs-util');
import { Market } from '@marketprotocol/marketjs';
import { Proxy } from './Proxy';
import { configRinkeby, constants, deployedContracts } from '../constants';

// types
import { ECSignature, Order, SignedOrder } from '@marketprotocol/types';

import { OrdersResponse } from '../types/OrdersResponse';
import { ProxyResponse } from '../types/ProxyResponse';

/**
 * region template
 */
export class Orders {
  // region Members
  // *****************************************************************
  // ****                     Members                             ****
  // *****************************************************************
  private readonly _market: Market;
  private _ordersResponse: OrdersResponse;
  // endregion // members

  // region Constructors
  // *****************************************************************
  // ****                     Constructors                        ****
  // *****************************************************************
  constructor() {
    this._market = new Market(
      new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY),
      configRinkeby
    );
    this._ordersResponse = {
      success: true,
      data: ''
    };
  }
  // endregion//Constructors

  // region Properties
  // *****************************************************************
  // ****                     Properties                          ****
  // *****************************************************************
  // endregion //Properties

  // region Public Methods
  // *****************************************************************
  // ****                     Public Methods                      ****
  // *****************************************************************
  public async getOrders(): Promise<OrdersResponse> {
    // Get the oracle query for the contract
    const oracleQuery: string = await this._getOracleQueryAsync(
      deployedContracts[4].marketContracts.BIN_EOSETH_ETH_1530639526076
    );
    console.log(`oracleQuery: ${oracleQuery}`);

    // Get price for trading pair
    const eventObject: Object = {
      pathParameters: {
        entity: 'overrideUrl',
        action: oracleQuery
      }
    };
    const proxy = new Proxy(eventObject);
    const proxyResult: ProxyResponse = await proxy.getProxyData();
    if (!proxyResult.success) {
      this._ordersResponse.success = false;
      this._ordersResponse.data = JSON.stringify(proxyResult.data);
      return this._ordersResponse;
    }
    const currentPrice = new BigNumber(JSON.parse(proxyResult.data).price);

    // Create the signed order hash
    const expirationTimeStamp: BigNumber = new BigNumber(
      Math.floor(Date.now() / 1000) + 60 * 60
    );

    const botOrderObject: SignedOrder = {
      contractAddress:
        deployedContracts[4].marketContracts.BIN_EOSETH_ETH_1530639526076,
      expirationTimestamp: expirationTimeStamp,
      feeRecipient: constants.NULL_ADDRESS,
      maker: constants.OWNER_ADDRESS,
      makerFee: new BigNumber(0),
      orderQty: new BigNumber(1),
      price: currentPrice,
      remainingQty: new BigNumber(1),
      salt: new BigNumber(0),
      taker: constants.NULL_ADDRESS,
      takerFee: new BigNumber(0),
      ecSignature: {
        v: 0,
        r: '',
        s: ''
      }
    };
    const signedBotOrder: SignedOrder = await this._createSignedOrderAsync(
      botOrderObject
    );

    // const signedOrderHash = await this._signOrderHashAsync(orderHash);
    // const signedOrder = await this._createSignedOrderAsync(
    //   deployedContracts[4].marketContracts.BIN_EOSETH_ETH_1530639526076,
    //   currentPrice
    // );

    this._ordersResponse.data = JSON.stringify(signedBotOrder);

    return this._ordersResponse;

    // create bid and ask

    // sign two orders, buy(+1) and sell(-1) side

    // return signed orders

    /*
    const web3 = new Web3(new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY));
    const tx = {
        from: process.env.OWNER_ADDRESS,
        to: process.env.CONTRACT_ADDRESS,
        gas: process.env.GAS_LIMIT,
        gasPrice: process.env.GAS_PRICE,
        data: method.encodeABI()
    };  
    const signTransactionResult = await web3.eth.accounts.signTransaction(tx, process.env.OWNER_PRIVATE_KEY, (error, result) => result);
    const sendSignedTransactionResult = await  web3.eth.sendSignedTransaction(signTransactionResult.rawTransaction, (error, result) => result);
    */
  }

  private async _createSignedOrderAsync(
    orderObject: SignedOrder
  ): Promise<SignedOrder> {
    // Create the order hash
    const orderHash = await this._market.createOrderHashAsync(
      deployedContracts[4].orderLibAddress,
      orderObject
    );

    // NOTE - we will have to clean this up somewhere eventually, but we have to prefix our orderHashes with
    // "\x19Ethereum Signed Message:\n32" in order for them to be valid.
    let signature = Account.sign(ethUtil.bufferToHex(ethUtil.hashPersonalMessage(ethUtil.toBuffer(orderHash))),
        constants.OWNER_PRIVATE_KEY);
    let vrs = Account.decodeSignature(signature);
    orderObject.ecSignature = { v: vrs[0], r: vrs[1], s: vrs[2] };

    // let isValid = await this._market.isValidSignatureAsync(
    //   deployedContracts[4].orderLibAddress,
    //   orderObject,
    //   orderHash
    // );
    // console.log(isValid);

    // Return the signed order
    return orderObject;
  }

  /**
   * Get the oracle query for the MarketContract
   * @param {string} marketAddress   The MarketContract address
   * @returns {Promise<string>}      Oracle query URL, specific to Binance at the moment
   */
  private async _getOracleQueryAsync(marketAddress: string): Promise<string> {
    const oracleQuery = await this._market.getOracleQuery(marketAddress);
    return oracleQuery.replace(/^.*\((.*)\).*/, '$1');
  }
  // endregion //Public Methods

  // region Private Methods
  // *****************************************************************
  // ****                     Private Methods                     ****
  // *****************************************************************
  // endregion //Private Methods

  // region Event Handlers
  // *****************************************************************
  // ****                     Event Handlers                     ****
  // *****************************************************************
  // endregion //Event Handlers
}
