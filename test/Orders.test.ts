import Web3 from 'web3';
import { Orders } from '../src/lib/Orders';
import { Market } from '@marketprotocol/marketjs';
import { configRinkeby, constants } from '../src/constants';

// types
import { Provider } from '@0xproject/types';

describe('Orders', () => {
  const provider: Provider = new Web3.providers.HttpProvider(
    constants.PROVIDER_URL_RINKEBY
  );
  const web3 = new Web3(provider);
  const market: Market = new Market(provider, configRinkeby);
  const orders = new Orders();

  it('debug', async () => {
    const result = await orders.getOrders();
    console.log(`result: ${JSON.stringify(result)}`);
  });
});
