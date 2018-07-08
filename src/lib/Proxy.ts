import axios from 'axios';
import { isEventEmpty, isUrl } from '../utils';

// types
import { ProxyResponse } from '../types/ProxyResponse';
import { APIGatewayProxyEvent } from 'aws-lambda';

/**
 * Proxy endpoint for Binance
 *
 * Create a proxy endpoint allowing https://api.marketprotocol.io/proxy/binance/*
 * Accepts a variable number of path parameters
 * Proxy the API calls directly from https://api.binance.com/*
 * Example: to fetch the ticker price, call: https://api.marketprotocol.io/proxy/binance/api/v3/ticker/price
 */
export class Proxy {
  // region Members
  // *****************************************************************
  // ****                     Members                             ****
  // *****************************************************************
  private readonly _event: APIGatewayProxyEvent;
  private readonly _binanceUrl: string;
  private _proxyResponse: ProxyResponse;
  // endregion // members

  // region Constructors
  // *****************************************************************
  // ****                     Constructors                        ****
  // *****************************************************************
  constructor(event: APIGatewayProxyEvent) {
    this._event = event;
    this._binanceUrl = 'https://api.binance.com/';
    this._proxyResponse = {
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

  //
  public async getProxyData(): Promise<ProxyResponse> {
    // Use event.pathParameters for /proxy/{entity}/{action} and load the appropriate class
    // based upon the {entity}.

    let entity = 'not defined';

    // Get the path parameter.
    if (!isEventEmpty(this._event, 'pathParameters', 'entity')) {
      entity = this._event.pathParameters.entity;
    }

    // Get data based upon source
    if (entity === 'binance') {
      // Binance
      let proxyResult;

      // Get the action
      const action: string = this._getAction(this._event);
      if (!action) {
        this._proxyResponse.success = false;
        this._proxyResponse.data = `Missing action`;
        return this._proxyResponse;
      }

      // Get the query parameters
      const queryParams = this._getQueryParameters(this._event);

      // Check for valid URL
      const url =
        this._binanceUrl + action + (queryParams ? `?${queryParams}` : '');
      if (!isUrl(url)) {
        this._proxyResponse.success = false;
        this._proxyResponse.data = `Invalid URL: ${url}`;
        return this._proxyResponse;
      }
      proxyResult = await axios(url);
      this._proxyResponse.data = JSON.stringify(
        typeof proxyResult.data !== 'undefined' ? proxyResult.data : {}
      );
    } else {
      this._proxyResponse.success = false;
      this._proxyResponse.data = `Unsupported proxy: ${entity}`;
    }

    return this._proxyResponse;
  }
  // endregion //Public Methods

  // region Private Methods
  // *****************************************************************
  // ****                     Private Methods                     ****
  // *****************************************************************
  /**
   * Handle/get the action parameter
   * @param {APIGatewayProxyEvent} event     AWS API gateway proxy event.
   * @returns {string}                       The path parameters for proxy.
   */
  private _getAction(event: APIGatewayProxyEvent): string {
    // get access to the path parameter action
    let action = '';
    if (!isEventEmpty(event, 'pathParameters', 'action')) {
      action = event.pathParameters.action;
    }
    return action;
  }
  /**
   * Handle url parameters
   * @param {APIGatewayProxyEvent} event      AWS API gateway proxy event.
   * @returns {string}                        String of query string parameters.
   */
  // @TODO Handle url parameters
  private _getQueryParameters(event: APIGatewayProxyEvent): string {
    // { "queryStringParameters":{"a":"1","b":"2","c":"3"} }
    // get access to the query parameters
    let queryParams = '';
    if (!isEventEmpty(event, 'queryStringParameters')) {
      queryParams = Object.keys(event.queryStringParameters)
        .reduce((a: string[], k: string) => {
          a.push(k + '=' + encodeURIComponent(event.queryStringParameters[k]));
          return a;
        }, [])
        .join('&');
    }
    return queryParams;
  }
  // endregion //Private Methods
}
