import Web3 from 'web3';
import { BigNumber } from 'bignumber.js';
import { Market, Utils } from '@marketprotocol/marketjs';
import { Oracle } from './Oracle';
import { configRinkeby, constants, deployedContracts } from '../constants';

let cloneDeep = require('lodash.clonedeep');
let Account = require('eth-lib/lib/account');
let ethUtil = require('ethereumjs-util');

// types
import { OrdersResponse } from '../types/OrdersResponse';
import { OracleResponse } from '../types/OracleResponse';
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
  /**
   * Produces and returns orders for a market contract address
   * @param {string} marketContractAddress   Produce orders for this market contract
   * @param {number} quantity                Number of orders to produce
   * @returns {Promise<OrdersResponse>}      Returns orders
   */
  public async getOrders(
    marketContractAddress: string,
    quantity?: number
  ): Promise<OrdersResponse> {
    // Get the name of the contract
    if (!marketContractAddress) {
      this._ordersResponse.success = false;
      this._ordersResponse.data = 'Missing market contract address';
      return this._ordersResponse;
    }
    const marketContractName: string = await this._market.getMarketContractNameAsync(
      marketContractAddress
    );

    const priceDecimalPlaces: BigNumber = await this._market.getMarketContractPriceDecimalPlacesAsync(
      marketContractAddress
    );

    // Create the signed order hash
    const expirationTimeStamp: BigNumber = new BigNumber(
      Math.floor(Date.now() / 1000) + 60 * 60
    );

    // Order size
    let orderSize: number = 5;
    if (quantity && quantity > 0) {
      orderSize = quantity;
    }

    // Quantity size
    const quantityBuy: BigNumber = new BigNumber(1);
    const quantitySell: BigNumber = new BigNumber(-1);
    const quantityRemaining: BigNumber = new BigNumber(1);

    // Get the oracle query data for the contract
    const oracle = new Oracle();
    const oracleResult: OracleResponse = await oracle.getOracleDataAddress(
      marketContractAddress
    );
    if (!oracleResult.success) {
      this._ordersResponse.success = false;
      this._ordersResponse.data = oracleResult.data;
      return this._ordersResponse;
    }
    const currentPriceTimestamp = Date.now();
    const currentPrice: BigNumber = new BigNumber(oracleResult.data);

    // Create buy/sell orders, up to orderSize
    const signedBotOrdersBuy = [];
    const signedBotOrdersSell = [];
    for (let i = 0; i < orderSize; i++) {
      let bandWidthBuy = new BigNumber(Math.random() / 100);
      let buyPrice: BigNumber = currentPrice.plus(
        bandWidthBuy.times(currentPrice)
      );
      let bandWidthSell = new BigNumber(Math.random() / 100);
      let sellPrice: BigNumber = currentPrice.minus(
        bandWidthSell.times(currentPrice)
      );

      // Generate the buy orders
      signedBotOrdersBuy.push(
        await this._createSignedOrderAsync(
          marketContractAddress,
          expirationTimeStamp,
          quantityBuy,
          quantityRemaining,
          buyPrice.shiftedBy(priceDecimalPlaces.toNumber()).decimalPlaces(0)
        )
      );

      // Generate the buy orders
      signedBotOrdersSell.push(
        await this._createSignedOrderAsync(
          marketContractAddress,
          expirationTimeStamp,
          quantitySell,
          quantityRemaining,
          sellPrice.shiftedBy(priceDecimalPlaces.toNumber()).decimalPlaces(0)
        )
      );
    }

    // Set the data for the response
    const newOrderResponse: Object = {
      contract: {
        name: marketContractName,
        address: marketContractAddress,
        price: currentPrice
          .shiftedBy(priceDecimalPlaces.toNumber())
          .decimalPlaces(0),
        priceDecimalPlaces: priceDecimalPlaces,
        priceTimestamp: currentPriceTimestamp
      },
      buys: signedBotOrdersBuy,
      sells: signedBotOrdersSell
    };

    this._ordersResponse.data = JSON.stringify(newOrderResponse);

    // return signed orders
    return this._ordersResponse;
  }

  /**
   * Creates a new signed order
   * @param {string} marketContractAddress    The market contract address
   * @param {BigNumber} expirationTimeStamp   Expiration timestamp for the order
   * @param {BigNumber} orderQuantity         Order quantity, +1 buy / -1 sell
   * @param {BigNumber} quantityRemaining     Quantity remaining
   * @param {BigNumber} offerPrice            What price is this order offered at?
   * @returns {Object}                        Signed order
   */
  private async _createSignedOrderAsync(
    marketContractAddress: string,
    expirationTimeStamp: BigNumber,
    orderQuantity: BigNumber,
    quantityRemaining: BigNumber,
    offerPrice: BigNumber
  ): Promise<Object> {
    let orderObject = cloneDeep({
      contractAddress: marketContractAddress,
      expirationTimestamp: expirationTimeStamp,
      feeRecipient: constants.NULL_ADDRESS,
      maker: constants.OWNER_ADDRESS,
      makerFee: new BigNumber(0),
      orderQty: orderQuantity,
      price: offerPrice,
      remainingQty: quantityRemaining,
      salt: Utils.generatePseudoRandomSalt(),
      taker: constants.NULL_ADDRESS,
      takerFee: new BigNumber(0)
    });
    // Create the order hash
    let orderHash = await this._market.createOrderHashAsync(
      deployedContracts[4].orderLibAddress,
      orderObject
    );

    // NOTE - we will have to clean this up somewhere eventually, but we have to prefix our orderHashes with
    // "\x19Ethereum Signed Message:\n32" in order for them to be valid.
    let signature = Account.sign(
      ethUtil.bufferToHex(
        ethUtil.hashPersonalMessage(ethUtil.toBuffer(orderHash))
      ),
      constants.OWNER_PRIVATE_KEY
    );
    let vrs = Account.decodeSignature(signature);
    orderObject.ecSignature = { v: vrs[0], r: vrs[1], s: vrs[2] };

    return orderObject;
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
