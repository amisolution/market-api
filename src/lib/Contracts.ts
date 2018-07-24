import pg, { ConnectionConfig, QueryResult } from 'pg';
import { constants } from '../constants';
import { camelToSnake, isEventEmpty } from '../utils';

// types
import { ContractsResponse } from '../types/Responses';
import { APIGatewayProxyEvent } from 'aws-lambda';

let isEmpty = require('lodash.isempty');

/**
 * region template
 */
export default class Contracts {
  // region Members
  // *****************************************************************
  // ****                     Members                             ****
  // *****************************************************************
  private readonly _event: APIGatewayProxyEvent;
  private readonly _dbConfig: ConnectionConfig;
  private _contractsResponse: ContractsResponse;

  // endregion // members

  // region Constructors
  // *****************************************************************
  // ****                     Constructors                        ****
  // *****************************************************************
  constructor(event: APIGatewayProxyEvent) {
    this._event = event;
    this._contractsResponse = {
      success: true,
      data: ''
    };
    this._dbConfig = {
      user: constants.AWS_RDS_USERNAME,
      password: constants.AWS_RDS_PASSWORD,
      database: constants.AWS_RDS_DB,
      host: constants.AWS_RDS_ENDPOINT,
      port: 5432
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
   * Gets all contracts from the db
   * @returns {ContractsResponse}       Success/failure and the result
   */
  public async getContractsData(): Promise<ContractsResponse> {
    try {
      const client = new pg.Client(this._dbConfig);
      await client.connect();

      let sqlQuery = `SELECT
        id,
        name, 
        address, 
        collateral_token_name AS "collateralTokenName", 
        collateral_token_symbol AS "collateralTokenSymbol", 
        collateral_token_address AS "collateralTokenAddress", 
        oracle_query AS "oracleQuery", 
        is_settled AS "isSettled", 
        collateral_pool_balance AS "collateralPoolBalance", 
        expiration_timestamp AS "expirationTimestamp", 
        price_cap AS "priceCap", 
        price_floor AS "priceFloor", 
        price_decimal_places AS "priceDecimalPlaces", 
        last_trade_price AS "lastTradePrice",
        last_queried_price AS "lastQueriedPrice",
        qty_multiplier AS "qtyMultiplier",
        reference_asset AS "referenceAsset",
        is_whitelisted AS "isWhitelisted"
      FROM contracts`;

      // Look for an id path parameter
      const values: any[] = [];
      if (!isEventEmpty(this._event, 'pathParameters')) {
        if (!isEmpty(this._event.pathParameters.id)) {
          sqlQuery += ` WHERE id = $1`;
          values[0] = this._event.pathParameters.id;
        }
      }

      // console.log(sqlQuery);

      const res: QueryResult = await client.query(sqlQuery, values);

      this._contractsResponse.data = JSON.stringify(res.rows);
      await client.end();
    } catch (error) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = error.message;
    }

    return this._contractsResponse;
  }

  public async postContractData(): Promise<ContractsResponse> {
    try {
      const client = new pg.Client(this._dbConfig);
      await client.connect();

      /**
        name character varying(255) COLLATE pg_catalog."default",
        address character varying(255) COLLATE pg_catalog."default",
        collateral_token_name character varying(255) COLLATE pg_catalog."default",
        collateral_token_symbol character varying(255) COLLATE pg_catalog."default",
        collateral_token_address character varying(255) COLLATE pg_catalog."default",
        oracle_query text COLLATE pg_catalog."default",
        is_settled boolean,
        collateral_pool_balance bigint,
        expiration_timestamp bigint,
        price_cap bigint,
        price_floor bigint,
        price_decimal_places integer,
        last_trade_price bigint,
        last_queried_price bigint,
        qty_multiplier bigint,
        reference_asset character varying(255) COLLATE pg_catalog."default",
        is_whitelisted boolean
       */

      const sqlQuery = `INSERT INTO contracts(
        name, 
        address, 
        collateral_token_name, 
        collateral_token_symbol, 
        collateral_token_address, 
        oracle_query, 
        is_settled, 
        collateral_pool_balance, 
        expiration_timestamp, 
        price_cap, 
        price_floor, 
        price_decimal_places, 
        last_trade_price,
        last_queried_price,
        qty_multiplier,
        reference_asset,
        is_whitelisted
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`;

      const contract1 = [
        'BIN_KMDETH_ETH_1532455493986',
        '0x7d87a633c9721faf709849a71840c5662021a124',
        'Fake Warped ETH',
        'FWETH',
        '0x2021c394e8fce5e56c166601a0428e4611147802',
        'json(https://api.binance.com/api/v3/ticker/price?symbol=KMDETH).price',
        false,
        1000,
        1535026097,
        477750,
        159250,
        8,
        345335,
        365424,
        10000000000,
        'KMD',
        true
      ];

      const contract2 = [
        'BIN_ETCUSDT_USDT_1532451967087',
        '0xcdfbbc82dc2ec05a78c25e9301e96ff32a5b34d0',
        'Stable USD',
        'USDT',
        '0xee78ae82ab0bbbae6d99b36a999e7b6de2e8664b',
        'json(https://api.binance.com/api/v3/ticker/price?symbol=ETCUSDT).price',
        false,
        100,
        1535022497,
        2475000000,
        825000000,
        8,
        1475000000,
        1355000000,
        10000000000,
        'ETC',
        true
      ];

      const res = await client.query(sqlQuery, contract1);

      this._contractsResponse.data = JSON.stringify(res.rows);
      await client.end();
    } catch (error) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = error.message;
    }

    return this._contractsResponse;
  }

  public async putContractData(): Promise<ContractsResponse> {
    try {
      const client = new pg.Client(this._dbConfig);
      await client.connect();
      await client.end();
    } catch (error) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = error.message;
    }

    return this._contractsResponse;
  }

  public async deleteContractData(): Promise<ContractsResponse> {
    try {
      const client = new pg.Client(this._dbConfig);
      await client.connect();
      await client.end();
    } catch (error) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = error.message;
    }

    return this._contractsResponse;
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
