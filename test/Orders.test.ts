import { Orders } from '../src/lib/Orders';
import { deployedContracts } from '../src/constants';
import { toBeArray } from 'jest-extended';

jest.setTimeout(15000);

describe('Orders', () => {
  const orders = new Orders();

  it('Return signed orders', async () => {
    const result = await orders.getOrders(
      deployedContracts[4].marketContracts[0].address,
      2
    );
    console.log(`result: ${JSON.stringify(result)}`);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('data');
    expect(result.data).toBeDefined();
    const data = JSON.parse(result.data);
    expect(data).toHaveProperty('contract');
    expect(data.contract).toHaveProperty('name');
    expect(data.contract).toHaveProperty('address');
    expect(data.contract).toHaveProperty('price');
    expect(data.contract).toHaveProperty('priceDecimalPlaces');
    expect(data.contract).toHaveProperty('priceTimestamp');
    expect(data).toHaveProperty('buys');
    expect(data.buys).toBeArray();
    expect(data).toHaveProperty('sells');
    expect(data.sells).toBeArray();
  });
});
