/**
 * With the Lambda proxy integration for API Gateway, Lambda is required to return an 
 * output of the following format. This applies to all statusCodes.
 */
export interface Response {
   statusCode: number;
   headers: Object;
   body: string;
   isBase64Encoded: boolean;
}