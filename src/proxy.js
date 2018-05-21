
const axios = require('axios');
const Binance = require('./proxy/binance');

/**
 * all proxy functions for binance
 *
 * @method get
 * @param {Object} event events published by the supported AWS service, 
 *   https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
 * @param {String} context AWS Lambda uses this parameter to provide details of your Lambda 
 *   function's execution, https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Function} callback use it to explicitly return information back to the caller
 * @return {Function}
*/
exports.proxyAll = async (event, context, callback) => {

    // @TODO Expand code to handle other entities like /proxy/bifinex/getExchangeInfo, etc.
    // Use event.pathParameters for /proxy/{entity}/{action} and load the appropriate class
    // based upon the {entity}.

    // Get the path parameter.
    let entity;
    if (event && event.pathParameters && event.pathParameters.entity)  {
        entity = event.pathParameters.entity;
    }

    if (entity === 'binance') {
        let binance = new Binance(axios);
        await binance.get(event, callback);
    }
};