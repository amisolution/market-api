import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import pg from 'pg';
import { constants, response } from './constants';

/**
 * Get the all the contracts in the contracts table.
 *
 * @method get
 * @param {APIGatewayProxyEvent} event   Events published by the supported AWS service,
 *                                       https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
 * @param {Context} context              AWS Lambda uses this parameter to provide details of your Lambda,
 *                                       function's execution,
 *                                       https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Callback} callback            Use it to explicitly return information back to the caller
 * @returns {Handler}                    Returns the Handler
 */
const get: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  try {
    let dbConfig = {
      user: constants.AWS_RDS_USERNAME,
      password: constants.AWS_RDS_PASSWORD,
      database: constants.AWS_RDS_DB,
      host: constants.AWS_RDS_ENDPOINT,
      port: 5432
    };
    let client = new pg.Client(dbConfig);
    client.connect();
    client.end();
    response.headers['Content-Type'] = 'application/json; charset=utf-8';
    response.body = JSON.stringify(client);
  } catch (error) {
    response.statusCode = 502;
    response.body = error.message;
  }

  callback(null, response);
};

export { get };
