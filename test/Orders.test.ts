import { Orders } from '../src/lib/Orders';
import { deployedContracts } from '../src/constants';
import { OrdersResponse } from '../src/types/Responses';
import { toBeArray, toBeString } from 'jest-extended';

jest.setTimeout(15000);

describe('Orders', () => {
  const orders = new Orders();

  it('Return signed orders', async () => {
    const result: OrdersResponse = await orders.getOrders(
      deployedContracts[4][0].address,
      2
    );
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

  it('Fails on invalid address', async () => {
    const result: OrdersResponse = await orders.getOrders(
      '0x8a9dac478c64b2c4f62e12045a9f55b4dde473b0',
      2
    );
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
    expect(result.success).toBe(false);
    expect(result).toHaveProperty('data');
    expect(result.data).toBeDefined();
    expect(result.data).toBeString();
  });

  it('Fails on settlement/expiration', async () => {
    const result: OrdersResponse = await orders.getOrders(
      '0x59c6644d455d333dd327c86c8f61faedfb370ace',
      2
    );
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
    expect(result.success).toBe(false);
    expect(result).toHaveProperty('data');
    expect(result.data).toBeDefined();
    expect(result.data).toBeString();
  });
});
