import Web3 from 'web3';
import { Orders } from '../src/lib/Orders';
import { Proxy } from '../src/lib/Proxy';
import { Market } from '@marketprotocol/marketjs';
import { configRinkeby, constants, deployedContracts } from '../src/constants';
import { isUrl } from '../src/utils';

describe('Orders', () => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(constants.PROVIDER_URL_RINKEBY)
  );
  const market: Market = new Market(web3.currentProvider, configRinkeby);
  const orders = new Orders();
  const marketContract: string =
    deployedContracts[4].marketContracts.BIN_EOSETH_ETH_1530639526076;

  it('debug', async () => {
    const result = await orders.getOrders();
    console.log(`result: ${JSON.stringify(result)}`);
  });
});
