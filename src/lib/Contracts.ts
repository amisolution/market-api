import pg from 'pg';
import { constants } from '../constants';

// types
import { ContractsResponse } from '../types/Responses';
import { APIGatewayProxyEvent } from 'aws-lambda';

/**
 * region template
 */
export default class Contracts {
  // region Members
  // *****************************************************************
  // ****                     Members                             ****
  // *****************************************************************
  private readonly _event: APIGatewayProxyEvent;
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
      let dbConfig = {
        user: constants.AWS_RDS_USERNAME,
        password: constants.AWS_RDS_PASSWORD,
        database: constants.AWS_RDS_DB,
        host: constants.AWS_RDS_ENDPOINT,
        port: 5432
      };

      const client = new pg.Client(dbConfig);
      await client.connect();

      const res = await client.query('SELECT $1::text as message', [
        'Hello world!'
      ]);

      // res.on('row', function (row, result) {
      //  result.addRow(row);
      // });

      // res.on('end', function (result) {
      //  var jsonString = JSON.stringify(result.rows);
      //  var jsonObj = JSON.parse(jsonString);
      //  console.log(jsonString);
      //  client.end();
      //  context.succeed(jsonObj);
      // });

      this._contractsResponse.data = res.rows[0].message;
      await client.end();

      // let client = new pg.Client(dbConfig);
      // client.connect();
      // client.end();
      // this._contractsResponse.data = `good`;
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
