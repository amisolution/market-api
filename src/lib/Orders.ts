import Web3 from 'web3';
import { BigNumber } from 'bignumber.js';
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

    // Create the order hash
    const orderHash = await this._createOrderHashAsync(
      deployedContracts[4].marketContracts.BIN_EOSETH_ETH_1530639526076,
      currentPrice
    );

    // Create the signed order hash
    // const signedOrderHash = await this._signOrderHashAsync(orderHash);
    const signedOrder = await this._createSignedOrderAsync(
      deployedContracts[4].marketContracts.BIN_EOSETH_ETH_1530639526076,
      currentPrice
    );

    this._ordersResponse.data = JSON.stringify({ signedOrder: signedOrder });

    return this._ordersResponse;

    // create bid and ask

    // sign two orders, buy(+1) and sell(-1) side

    // return signed orders

    /*

    console.log(`order: ${JSON.stringify(order)}, orderHash: ${orderHash}`);
*/
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

    const result = web3.eth.sign(constants.OWNER_ADDRESS, String(orderHash), (err, signature) => {
    // Log errors, if any
    // TODO: Handle error
    if (err) {
      console.error(err);
    }

    const r = signature.slice(0, 66);
    const s = `0x${signature.slice(66, 130)}`;
    let v = web3.toDecimal(`0x${signature.slice(130, 132)}`);

    if (v !== 27 && v !== 28) {
      v += 27;
    }

    return ({ v, r, s });
    
    console.log(`return: ${result}`);
    */
  }

  private async _createSignedOrderAsync(
    contractAddress: string,
    price: BigNumber
  ): Promise<SignedOrder> {
    // Create the expiration time
    const expirationTimeStamp: BigNumber = new BigNumber(
      Math.floor(Date.now() / 1000) + 60 * 60
    );

    const signedOrder: SignedOrder = await this._market.createSignedOrderAsync(
      deployedContracts[4].orderLibAddress, // orderLibAddress: string
      contractAddress, // contractAddress: string
      expirationTimeStamp, // expirationTimestamp: BigNumber
      constants.NULL_ADDRESS, // feeRecipient: string
      constants.OWNER_ADDRESS, // maker: string
      new BigNumber(0), // makerFee: BigNumber
      constants.NULL_ADDRESS, // taker: string
      new BigNumber(0), // takerFee: BigNumber
      new BigNumber(1), // orderQty: BigNumber
      price, // price: BigNumber
      new BigNumber(1), // remainingQty: BigNumber
      new BigNumber(0) // salt: BigNumber
    );

    return signedOrder;
  }

  private async _signOrderHashAsync(orderHash: string): Promise<ECSignature> {
    const signedOrderHash = await this._market.signOrderHashAsync(
      String(orderHash),
      constants.OWNER_ADDRESS
    );

    return signedOrderHash;
  }

  private async _createOrderHashAsync(
    contractAddress: string,
    price: BigNumber
  ): Promise<string> {
    // Create the expiration time
    const expirationTimeStamp: BigNumber = new BigNumber(
      Math.floor(Date.now() / 1000) + 60 * 60
    );

    const order: Order = {
      contractAddress: contractAddress,
      expirationTimestamp: expirationTimeStamp,
      feeRecipient: constants.NULL_ADDRESS,
      maker: constants.OWNER_ADDRESS,
      makerFee: new BigNumber(0),
      orderQty: new BigNumber(1),
      price: price,
      remainingQty: new BigNumber(1),
      salt: new BigNumber(0),
      taker: constants.NULL_ADDRESS,
      takerFee: new BigNumber(0)
    };

    const orderHash = await this._market.createOrderHashAsync(
      deployedContracts[4].orderLibAddress,
      order
    );

    return orderHash;
  }

  /**
   * Get the oracle query for the MarketContract
   * @param {string} marketAddress   The MarketContract address
   * @returns {Promise<string>}      Oracle query URL
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
