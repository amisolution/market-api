import pg, { ConnectionConfig, QueryResult } from 'pg';
import { camelToSnake, isEventEmpty } from '../utils';
import { assert } from '../assert';
import { schemas } from '../schemas/';

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
  private readonly _dbTable: string;
  private _contractsResponse: ContractsResponse;

  // endregion // members

  // region Constructors
  // *****************************************************************
  // ****                     Constructors                        ****
  // *****************************************************************
  constructor(event: APIGatewayProxyEvent, dbConfig: Object) {
    this._event = event;
    this._contractsResponse = {
      success: true,
      data: ''
    };
    this._dbConfig = dbConfig;
    this._dbTable = 'contracts';
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
   * Get contracts from the db.
   * @returns {ContractsResponse}       Success/failure and the result
   */
  public async getContractsData(): Promise<ContractsResponse> {
    const client = new pg.Client(this._dbConfig);

    try {
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
      FROM ${this._dbTable}`;

      // Return all: WHERE isWhitelisted = true
      // Return one by id: WHERE id = $1
      // Return by field (isSettled, isExpired, isWhitelisted): WHERE isSettled=true
      // Filter by timebox: WHERE date <= TIMESTAMP_END AND date > TIMESTAMP_START, where start before end

      // 1. Look for a path parameter of id, if present, default to this.

      // 2. Check for query params isSettled, isExpired, isWhitelisted.

      // 3. Check for query param from, UNIXtimestamp or all.

      // 4. If not the above, return all whitelisted contracts as well as
      //    settled & expired for 30 days back.

      // Look for an id path parameter
      const values: any[] = [];
      const id = this._getContractIdFromEvent();
      if (id > 0) {
        // Always return the contract if an id is specified, even if it's "soft" deleted
        sqlQuery += ` WHERE id = $1`;
        values.push(id);
      } else {
        // Get all contracts, never return "soft" deleted contracts
        sqlQuery += ` WHERE is_whitelisted = true`;
      }
      const res: QueryResult = await client.query(sqlQuery, values);
      this._contractsResponse.data = JSON.stringify(res.rows);
    } catch (error) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = error.message;
    }

    // Client end
    await client.end();

    return this._contractsResponse;
  }

  /**
   * Add a contract to the contracts table
   * @returns {Promise<ContractsResponse>}    Success/failure and the result
   */
  public async postContractData(): Promise<ContractsResponse> {
    // Validate event fields

    const client = new pg.Client(this._dbConfig);
    try {
      await client.connect();

      const sqlQuery = `INSERT INTO ${this._dbTable} (
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

      const res = await client.query(sqlQuery, []);

      this._contractsResponse.data = JSON.stringify(res.rows);
      await client.end();
    } catch (error) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = error.message;
    }

    return this._contractsResponse;
  }

  /**
   * Update existing contracts
   * @returns {Promise<ContractsResponse>}
   */
  public async putContractData(): Promise<ContractsResponse> {
    // Make sure we have an id
    const id = this._getContractIdFromEvent();
    if (id <= 0) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = `Invalid id: ${id}`;
      return this._contractsResponse;
    }

    // Return if no event body
    if (isEventEmpty(this._event, '$.body')) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = 'Missing body data';
      return this._contractsResponse;
    }

    // Get event body
    const body: Object = JSON.parse(this._event.body);

    // Convert to snake case
    for (let key in body) {
      key = camelToSnake(key);
    }

    // Validate event fields
    console.log(
      assert.isSchemaValid('Contract', body, schemas.ContractUpdateSchema)
    );

    const client = new pg.Client(this._dbConfig);

    try {
      await client.connect();

      // Get the fields and values from the post data
      const values: any[] = [id];
      const setStatement: string = this._getSetSQLStatement(values);

      if (isEmpty(setStatement)) {
        this._contractsResponse.success = false;
        this._contractsResponse.data = `Invalid or missing fields/values in SET SQL statement`;
        return this._contractsResponse;
      }

      // Build query
      const sqlQuery = `UPDATE ${this._dbTable} 
      SET ${setStatement}
      WHERE id = $1 
      RETURNING id`;

      console.log(sqlQuery, values);

      const res = await client.query(sqlQuery, values);
      this._contractsResponse.data = JSON.stringify(res.rows);
    } catch (error) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = error.message;
    }

    await client.end();
    return this._contractsResponse;
  }

  /**
   * "Soft" delete contract by setting is_whitelisted to false
   * @returns {ContractsResponse}  The data is an array of ids that have been deleted or an error
   */
  public async deleteContractData(): Promise<ContractsResponse> {
    // Make sure we have an id
    const id = this._getContractIdFromEvent();
    if (id <= 0) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = `Invalid id: ${id}`;
      return this._contractsResponse;
    }

    const client = new pg.Client(this._dbConfig);

    try {
      await client.connect();

      const sqlQuery = `UPDATE ${this._dbTable} 
      SET is_whitelisted = false 
      WHERE id = $1 
      RETURNING id`;

      const res = await client.query(sqlQuery, [id]);
      this._contractsResponse.data = JSON.stringify(res.rows);
    } catch (error) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = error.message;
    }

    await client.end();
    return this._contractsResponse;
  }

  /**
   * Reset the development environment only, for testing and such
   */
  public async resetContractData(): Promise<ContractsResponse> {
    if (this._dbConfig.database != 'order_book_dev') {
      this._contractsResponse.data = `Nothing to do here...`;
      return this._contractsResponse;
    }

    const client = new pg.Client(this._dbConfig);
    try {
      await client.connect();

      /**
        id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
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

      const contract1 = [
        'BIN_KMDETH_ETH_1532455493986',
        '0x7d87a633c9721faf709849a71840c5662021a124',
        'Fake Warped ETH',
        'FWETH',
        '0x2021c394e8fce5e56c166601a0428e4611147802',
        'json(https://api.binance.com/api/v3/ticker/price?symbol=KMDETH).price',
        false,
        1000,
        Math.floor(Date.now() / 1000) + 2592000,
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
        Math.floor(Date.now() / 1000) + 2592000,
        2475000000,
        825000000,
        8,
        1475000000,
        1355000000,
        10000000000,
        'ETC',
        true
      ];

      const contract3 = [
        'BIN_BNBETH_ETH_1532438641667',
        '0x0b13fb6eb8c10f2c9a5681390a4d865231cf3365',
        'Fake Warped ETH',
        'FWETH',
        '0x2021c394e8fce5e56c166601a0428e4611147802',
        'json(https://api.binance.com/api/v3/ticker/price?symbol=BNBETH).price',
        false,
        100,
        Math.floor(Date.now() / 1000) + 2592000,
        3788500,
        1263400,
        8,
        3088500,
        2088500,
        10000000000,
        'BNB',
        false
      ];

      const contract4 = [
        'BIN_OAXETH_ETH_1532436786314',
        '0xa2d8e40c22801c01193aed8a247f6358f0465702',
        'Fake Warped ETH',
        'FWETH',
        '0x2021c394e8fce5e56c166601a0428e4611147802',
        'json(https://api.binance.com/api/v3/ticker/price?symbol=OAXETH).price',
        true,
        100,
        Math.floor(Date.now() / 1000) - 3600,
        101835,
        33945,
        8,
        91835,
        73945,
        10000000000,
        'OAX',
        true
      ];

      const sqlQuery = `INSERT INTO ${this._dbTable} (
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

      await client.query(`TRUNCATE TABLE ${this._dbTable}`);
      await client.query(sqlQuery, contract1);
      await client.query(sqlQuery, contract2);
      await client.query(sqlQuery, contract3);
      await client.query(sqlQuery, contract4);

      this._contractsResponse.data = `Reset and intialization complete.`;
    } catch (error) {
      this._contractsResponse.success = false;
      this._contractsResponse.data = error.message;
    }

    await client.end();
    return this._contractsResponse;
  }

  // endregion //Public Methods

  // region Private Methods
  // *****************************************************************
  // ****                     Private Methods                     ****
  // *****************************************************************
  /**
   * Get the contract id in the event object.
   * @returns {number}      The contract id
   */
  private _getContractIdFromEvent(): number {
    let id: number = 0;
    if (!isEventEmpty(this._event, '$.pathParameters.id')) {
      id = parseInt(this._event.pathParameters.id);
    }
    return id;
  }

  /**
   *  Extracts/validates post input from body, returns SET SQL statement
   * @param {any[]} values     Array of values
   * @returns {string}         The SET SQL
   */
  private _getSetSQLStatement(values: any[]): string {
    // Return if no event body
    if (isEventEmpty(this._event, '$.body')) {
      return '';
    }

    // Process event body
    const body: Object = JSON.parse(this._event.body);

    // TODO Filter on validate fields

    // loop object to create fields and values
    const fields: string[] = [];
    for (const key in body) {
      fields.push(camelToSnake(key));
      values.push(body[key]);
    }

    // Make sure fields and values match
    if (fields.length <= 0 || fields.length + 1 != values.length) {
      return '';
    }

    // Build/return set statements, field = $x
    return fields
      .map((value, index) => {
        return `${value} = $${index + 2}`;
      })
      .join(', ');
  }
  // endregion //Private Methods

  // region Event Handlers
  // *****************************************************************
  // ****                     Event Handlers                     ****
  // *****************************************************************
  // endregion //Event Handlers
}
