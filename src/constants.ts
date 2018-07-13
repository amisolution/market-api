import { MARKETProtocolConfig } from '@marketprotocol/marketjs';
import { Response } from './types/Response';

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

/**
 * networkId: The id of the underlying ethereum network your provider is connected to.
 * (1-mainnet, 3-ropsten, 4-rinkeby, 42-kovan, 50-testrpc)
 * gasPrice: Gas price to use with every transaction
 * marketContractRegistryAddress: The address of the MARKET Protocol registry to use
 * marketContractFactoryAddress: The address of the MARKET Protocol factory to use
 * marketCollateralPoolFactoryAddress: The address of a
 * MARKET Protocol collateral pool factory to use.
 * mktTokenAddress: The address of the MARKET Protocol token (MKT) to use
 * orderWatcherConfig: All the configs related to the orderWatcher
 */
export const configRinkeby: MARKETProtocolConfig = {
  networkId: 4,
  marketContractRegistryAddress: '0x4bc60737323fd065d99c726ca2c0fad0d1077a60',
  marketContractFactoryAddress: '0x9d904712cf622d3bfeacb5282a51a0ad1418f9a3',
  marketCollateralPoolFactoryAddress:
    '0x011176b12c962b3d65049b0b8358d8e9132223f1',
  marketTokenAddress: '0xffa7d6c01f8b40eb26a5ffbde9d6b5daeebb980e'
};

export const configMainnet: MARKETProtocolConfig = {
  networkId: 1,
  marketContractRegistryAddress: '',
  marketContractFactoryAddress: '',
  marketCollateralPoolFactoryAddress: '',
  marketTokenAddress: ''
};

/**
 * Deployed contracts for bot
 */
export const deployedContracts: Object = {
  4: {
    orderLibAddress: '0xd43d3d88e62bd8bbadb779f63da96c0119c49bbd',
    marketContracts: [
      {
        name: 'BIN_EOSETH_ETH_1530639526076',
        address: '0xb97b05f8f65733bfffca1ab210d94197dbd3d1ef'
      }
    ]
  }
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
