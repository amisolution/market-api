import { MARKETProtocolConfig } from '@marketprotocol/marketjs';
import { Response } from './types/Responses';

export const constants = {
  NETWORK_ID_MAINNET: 1,
  NETWORK_ID_RINKEBY: 4,
  NETWORK_ID_TRUFFLE: 4447,
  PROVIDER_URL_TRUFFLE: 'http://localhost:9545',
  PROVIDER_URL_RINKEBY: 'https://rinkeby.infura.io/cbHh1p8RT4Q6E97F4gVi',
  PROVIDER_URL_MAINNET: '',
  GAS_LIMIT: '100000',
  GAS_PRICE: '20000000000',
  NULL_ADDRESS: '0x0000000000000000000000000000000000000000',
  MAX_DIGITS_IN_UNSIGNED_256_INT: 78,
  OWNER_ADDRESS: '0x361ffaa1c30267ffb4c74c87fd50751b038d20b4',
  OWNER_PRIVATE_KEY:
    '0x442e5aac4e4694bec96aa29d5c103dd843e872d6cb4e6a9e0fd05c1d46eb215f'
};

export const configTruffle: MARKETProtocolConfig = {
  networkId: constants.NETWORK_ID_TRUFFLE
};

export const configRinkeby: MARKETProtocolConfig = {
  networkId: constants.NETWORK_ID_RINKEBY
};

/**
 * Deployed contracts for bot
 */
export const deployedContracts: Object = {
  4: [
    {
      name: 'BIN_QTUMETH_ETH_1532110878032',
      address: '0x8b229978fd8c2740ecb9adce3110953019ff1a06'
    }
  ]
};

/**
 * Create a standard response object
 */
export const response: Response = {
  statusCode: 200,
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  },
  body: '',
  isBase64Encoded: false
};
