import Web3 from 'web3';
import axios from 'axios';
import { Market } from '@marketprotocol/marketjs';
import { OracleResponse } from '../types/Responses';
import { configRinkeby, constants } from '../constants';
import { isUrl } from '../utils';

let JSONPath = require('jsonpath');

// types
import { Provider } from '@0xproject/types';

/**
 * region template
 */
export class Oracle {
  // region Members
  // *****************************************************************
  // ****                     Members                             ****
  // *****************************************************************
  private readonly _market: Market;
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
   * Gets the oracle data using an contract address.
   * Use the oracle query for the contract to retrieve the value(s)
   * TODO: Add support for xml, html, and binary types
   * @param {string} marketAddress   Market contract address
   * @returns {OracleResponse}       Success/failure and the result
   */
  public async getOracleDataAddress(
    marketAddress: string
  ): Promise<OracleResponse> {
    // Get the contract oracle query
    const oracleQuery = await this._market.getOracleQueryAsync(marketAddress);
    return this._getOracleData(oracleQuery);
  }

  /**
   * Gets the oracle data using an query.
   * Use the oracle query to retrieve the value(s)
   * @param {string} query        Oracle query
   * @returns {OracleResponse}    Success/failure and the result
   */
  public async getOracleDataQuery(query: string): Promise<OracleResponse> {
    // Get the contract oracle query
    const oracleQuery = query;
    return this._getOracleData(oracleQuery);
  }
  // endregion //Public Methods

  // region Private Methods
  // *****************************************************************
  // ****                     Private Methods                     ****
  // *****************************************************************
  private async _getOracleData(oracleQuery: string): Promise<OracleResponse> {
    // Get the params:
    // [0] oracle query
    // [1] oracle query type
    // [2] url
    // [3] JSONPATH expression
    const params = oracleQuery.match(/^(json|xml|html|binary)\((.*)\)(.*)/);

    // Get the raw oracle data
    if (!params || !isUrl(params[2])) {
      return {
        success: false,
        data: `Missing url for oracle data: ${JSON.stringify(params)}`
      };
    }
    const rawOracleData = await axios(params[2]);

    // Process the oracle query type
    // Types: json, xml, html, binary: http://docs.oraclize.it/#general-concepts-query
    switch (params[1]) {
      case 'json':
        // Process the json oracle query type
        const oracleData = JSONPath.value(rawOracleData.data, `$${params[3]}`);
        return {
          success: true,
          data: oracleData
        };
      case 'xml':
      case 'html':
      case 'binary':
      default:
        return {
          success: false,
          data: `Oracle query type not supported: ${params[1]}`
        };
    }
  }
  // endregion //Private Methods

  // region Event Handlers
  // *****************************************************************
  // ****                     Event Handlers                     ****
  // *****************************************************************
  // endregion //Event Handlers
}
