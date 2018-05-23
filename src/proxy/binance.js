const axios = require('axios');
const utils = require('../utils/url');

/**
 * Proxy endpoint for Binance
 * 
 * Create a proxy endpoint allowing https://api.marketprotocol.io/proxy/binance/*
 * Accepts a variable number of path parameters
 * Proxy the API calls directly from https://api.binance.com/*
 * Example: to fetch the ticker price, call: https://api.marketprotocol.io/proxy/binance/api/v3/ticker/price
 */
class Binance {
    constructor(httpClient) {
      this.httpClient = httpClient;
      this.binanceUrl = 'https://api.binance.com/';
      /**
       * With the Lambda proxy integration for API Gateway, Lambda is required to return an 
       * output of the following format. This applies to all statusCodes.
       */
      this.response = {
        "statusCode": 200,
        "headers": {
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        },
        "body": "",
        "isBase64Encoded": false
      };
    }

    // Handle proxy
    getProxy(event) {
      // get access to the path parameters proxy
      let proxy;
      if (event && event.pathParameters && event.pathParameters.proxy)  {
          proxy = event.pathParameters.proxy;
      }

      return proxy;
    }

    // @TODO Handle url parameters
    getQueryParameters(event) {
      // { "queryStringParameters":{"a":"1","b":"2","c":"3"} }
      // get access to the query parameters
      let queryParams;
      if (event && event.queryStringParameters && typeof event.queryStringParameters === 'object')  {
          queryParams = Object.keys(event.queryStringParameters)
            .reduce((a, k) => {
                a.push(k + '=' + encodeURIComponent(event.queryStringParameters[k]));
                return a; 
              }, [])
            .join('&')
      }

      return queryParams;
    }

    //
    async get(event, callback) {
      // Get the API action
      const proxy = this.getProxy(event);
      const queryParams = this.getQueryParameters(event);
      const url = this.binanceUrl + proxy + (queryParams ? `?${queryParams}` : '');

      // Check for valid URL
      if (! utils.isUrl(url)) {
        this.response.statusCode = 400;
        this.response.body = "Data Validation: Invalid URL: " + url;
        callback(null, this.response);
        return;
      }

      try {
        const binanceResponse = await this.httpClient(url);
        this.response.headers["Content-Type"] = "application/json; charset=utf-8";
        this.response.body = JSON.stringify(binanceResponse.data);

      } catch (error) {
        this.response.statusCode = 502;
        this.response.body = error.message;
      }
      callback(null, this.response)
    }
  }
  
  module.exports = Binance;
