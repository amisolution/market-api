import axios from 'axios';
import { isEventEmpty, isUrl } from '../utils';
import { response } from '../constants';

import { Response } from '../types/Response';
import { APIGatewayProxyEvent, Callback } from 'aws-lambda';


/**
 * Proxy endpoint for Binance
 * 
 * Create a proxy endpoint allowing https://api.marketprotocol.io/proxy/binance/*
 * Accepts a variable number of path parameters
 * Proxy the API calls directly from https://api.binance.com/*
 * Example: to fetch the ticker price, call: https://api.marketprotocol.io/proxy/binance/api/v3/ticker/price
 */
export class Binance {
  // region Members
  // *****************************************************************
  // ****                     Members                             ****
  // *****************************************************************
  private readonly _binanceUrl: string;
  private _response: Response;
  // endregion // members

  // region Constructors
  // *****************************************************************
  // ****                     Constructors                        ****
  // *****************************************************************
  constructor() {
    this._binanceUrl = 'https://api.binance.com/';
    /**
     * With the Lambda proxy integration for API Gateway, Lambda is required to return an 
     * output of the following format. This applies to all statusCodes.
     */
    this._response = response;
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
  public async get(event: APIGatewayProxyEvent, callback: Callback) {
    // Get the API action
    const action = this._getAction(event);
    const queryParams = this._getQueryParameters(event);
    const url = this._binanceUrl + action + (queryParams ? `?${queryParams}` : '');

    // Check for valid URL
    if (! isUrl(url)) {
      this._response.statusCode = 400;
      this._response.body = `Data Validation: Invalid URL: ${url}`;
      callback(null, this._response);
      return;
    }

    try {
      const binanceResponse = await axios(url);
      this._response.headers['Content-Type'] = 'application/json; charset=utf-8';
      this._response.body = JSON.stringify(binanceResponse.data);

    } catch (error) {
      this._response.statusCode = 502;
      this._response.body = error.message;
    }
    callback(null, this._response);
  }
  // endregion //Public Methods

  // region Private Methods
  // *****************************************************************
  // ****                     Private Methods                     ****
  // *****************************************************************
  /**
   * Handle/get the action parameter
   * @param {APIGatewayProxyEvent} event     AWS API gateway proxy event.
   * @returns {string | undefined}           The path parameters for proxy.
   */
  private _getAction(event: APIGatewayProxyEvent): (string | undefined) {
    // get access to the path parameter action
    let action;
    if (!isEventEmpty(event, 'pathParameters', 'action')) {
      action = event.pathParameters.action;
    }
    return action;
  }
  /**
   * Handle url parameters
   * @param {APIGatewayProxyEvent} event      AWS API gateway proxy event.
   * @returns {string | undefined}            String of query string parameters.
   */
  // @TODO Handle url parameters
  private _getQueryParameters(event: APIGatewayProxyEvent): (string | undefined) {
    // { "queryStringParameters":{"a":"1","b":"2","c":"3"} }
    // get access to the query parameters
    let queryParams;
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
