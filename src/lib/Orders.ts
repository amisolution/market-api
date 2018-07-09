import Web3 from 'web3';
import { BigNumber } from 'bignumber.js';
let Account = require('eth-lib/lib/account');
import { Market } from '@marketprotocol/marketjs';
import { Proxy } from './Proxy';
import { configRinkeby, constants, deployedContracts } from '../constants';

// types
import { SignedOrder } from '@marketprotocol/types';

import { OrdersResponse } from '../types/OrdersResponse';
import { ProxyResponse } from '../types/ProxyResponse';
import { Provider } from '@0xproject/types';

/**
 * region template
 */
export class Orders {
  // region Members
  // *****************************************************************
  // ****                     Members                             ****
  // *****************************************************************
  private _ordersResponse: OrdersResponse;
  private readonly _market: Market;
  private readonly _web3: Web3;
  // endregion // members

  // region Constructors
  // *****************************************************************
  // ****                     Constructors                        ****
  // *****************************************************************
  constructor() {
    const provider: Provider = new Web3.providers.HttpProvider(
      constants.PROVIDER_URL_RINKEBY
    );
    this._market = new Market(provider, configRinkeby);
    this._web3 = new Web3(provider);
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
    // Create the signed order hash
    const expirationTimeStamp: BigNumber = new BigNumber(
      Math.floor(Date.now() / 1000) + 60 * 60
    );

    // Create the bot order object
    const botOrderObject: SignedOrder = {
      contractAddress: '',
      expirationTimestamp: expirationTimeStamp,
      feeRecipient: constants.NULL_ADDRESS,
      maker: constants.OWNER_ADDRESS,
      makerFee: new BigNumber(0),
      orderQty: new BigNumber(0),
      price: new BigNumber(0),
      remainingQty: new BigNumber(0),
      salt: new BigNumber(0),
      taker: constants.NULL_ADDRESS,
      takerFee: new BigNumber(0),
      ecSignature: {
        v: 0,
        r: '',
        s: ''
      }
    };

    // Width of the band as a percent
    const bandWidth: Number = 0.005;

    // Quantity size
    const quantity: BigNumber = new BigNumber(1);

    // Loop through contracts
    const signedBotOrders: SignedOrder[] = deployedContracts[4].marketContracts.map(
      async contract => {
        // Get the oracle query for the contract
        const oracleQuery: string = await this._getOracleQueryAsync(
          contract.address
        );
        // console.log(`oracleQuery: ${oracleQuery}`);

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
        // console.log(`currentPrice: ${currentPrice}`);

        // Set the properties on the bot order object
        botOrderObject.contractAddress = contract.address;
        botOrderObject.price = currentPrice;
        // console.log(`signedBotOrder: ${JSON.stringify(botOrderObject)}`);

        // return await this._createSignedOrderAsync(botOrderObject);
        let signedBotOrder: SignedOrder = await this._createSignedOrderAsync(
          botOrderObject
        );

        console.log(`signedBotOrder: ${JSON.stringify(signedBotOrder)}`);
        return signedBotOrder;
      }
    );

    // Set the data for the response
    this._ordersResponse.data = JSON.stringify(signedBotOrders);

    return this._ordersResponse;

    // create bid and ask

    // sign two orders, buy(+1) and sell(-1) side

    // return signed orders
  }

  private async _createSignedOrderAsync(
    orderObject: SignedOrder
  ): Promise<SignedOrder> {
    // Create the order hash
    const orderHash = await this._market.createOrderHashAsync(
      deployedContracts[4].orderLibAddress,
      orderObject
    );

    // ** Options to sign the orders **

    // ** Old add to whitelist
    // const web3 = new Web3(new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY));
    // const tx = {
    //     from: process.env.OWNER_ADDRESS,
    //     to: process.env.CONTRACT_ADDRESS,
    //     gas: process.env.GAS_LIMIT,
    //     gasPrice: process.env.GAS_PRICE,
    //     data: method.encodeABI()
    // };
    // const signTransactionResult = await web3.eth.accounts.signTransaction(tx, process.env.OWNER_PRIVATE_KEY, (error, result) => result);
    // const sendSignedTransactionResult = await  web3.eth.sendSignedTransaction(signTransactionResult.rawTransaction, (error, result) => result);

    // ** secp256k1: https://github.com/cryptocoinjs/secp256k1-node
    // const signatureObject = secp256k1.sign(orderHash, constants.OWNER_PRIVATE_KEY);
    // orderObject.ecSignature = signatureObject;

    // ** elliptic: https://github.com/indutny/elliptic
    // const ec = new EC('secp256k1');
    // const key = ec.genKeyPair();
    // const signature = key.sign(orderHash);
    // const derSign = signature.toDER();
    // //console.log(`key: ${key.verify(orderHash, derSign)}`);
    // const r = derSign.slice(0, 66);
    // const s = `0x${derSign.slice(66, 130)}`;
    // const web3 = new Web3();
    // let v = web3.toDecimal(`0x${derSign.slice(130, 132)}`);
    // if (v !== 27 && v !== 28) {
    //   v += 27;
    // }
    // orderObject.ecSignature = { v, r, s };

    // ** MARKET.js
    // orderObject.ecSignature = this._market.signOrderHashAsync(
    //   orderHash,
    //   orderObject.maker
    // );

    // ** web3 0.20.6
    // this._web3.Personal.unlockAccount(orderObject.maker); // unlockAccount is listed as a method, didn't get it to work
    // orderObject.ecSignature = await this._web3.accounts.sign(orderObject.maker, orderHash);

    // ** web3 1.0.0-beta.34
    // const signedOrderHash = this._web3.eth.accounts.sign(orderHash, constants.OWNER_PRIVATE_KEY);
    // orderObject. ecSignature = {
    //   v: signedOrderHash.v,
    //   r: signedOrderHash.r,
    //   s: signedOrderHash.s
    // };

    // Get the account from the private key
    let account = Account.fromPrivate(constants.OWNER_PRIVATE_KEY);
    orderObject.maker = account.address;

    // Sign the order hash
    let signature = Account.sign(orderHash, constants.OWNER_PRIVATE_KEY);
    let vrs = Account.decodeSignature(signature);

    // Set the ECSignature
    orderObject.ecSignature = { v: vrs[0], r: vrs[1], s: vrs[2] };

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
