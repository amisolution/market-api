import { Binance } from './proxy/binance';
import { isEventEmpty } from './utils';

import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';


/**
 * Proxy function for oracles
 *
 * @method get
 * @param {APIGatewayProxyEvent} event   Events published by the supported AWS service, 
 *                                       https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
 * @param {Context} context              AWS Lambda uses this parameter to provide details of your Lambda function's 
 *                                       execution,
 *                                       https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Callback} callback            Return information back to the caller
 * @return {Function}
 */
const proxyAll: Handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Use event.pathParameters for /proxy/{entity}/{action} and load the appropriate class
    // based upon the {entity}.

    // Get the path parameter.
    let entity;
    if (!isEventEmpty(event, 'pathParameters', 'entity')) {
        entity = event.pathParameters.entity;
    }

    if (entity === 'binance') {
        let binance = new Binance();
        await binance.get(event, callback);
    }
};

export { proxyAll };