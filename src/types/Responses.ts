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

/**
 * Interface for the oracle response
 */
export interface OracleResponse {
  success: boolean;
  data: string;
}

/**
 * Interface for the proxy response
 */
export interface OrdersResponse {
  success: boolean;
  data: string;
}

/**
 * Interface for the proxy response
 */
export interface ProxyResponse {
  success: boolean;
  data: string;
}
