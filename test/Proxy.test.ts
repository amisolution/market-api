import { Proxy } from '../src/lib/Proxy';

// types
import { ProxyResponse } from '../src/types/ProxyResponse';

describe('Proxy', () => {
  const entityIsMissing: Object = { pathParameters: {} };
  const entityIsNull: Object = { pathParameters: { entity: null } };
  const actionIsMissing: Object = { pathParameters: { entity: 'binance' } };
  const actionIsNull: Object = {
    pathParameters: { entity: 'binance', action: null }
  };
  const binance: Object = {
    pathParameters: {
      entity: 'binance',
      action: 'api/v3/ticker/price?symbol=EOSETH'
    }
  };
  const overrideUrl: Object = {
    pathParameters: {
      entity: 'overrideUrl',
      action: 'https://api.binance.com/api/v3/ticker/price?symbol=EOSETH'
    }
  };

  it('Fails on missing entity', async () => {
    const proxy = new Proxy(entityIsMissing);
    const result: ProxyResponse = await proxy.getProxyData();
    expect(result.success).toBe(false);
  });
  it('Fails on null entity', async () => {
    const proxy = new Proxy(entityIsNull);
    const result: ProxyResponse = await proxy.getProxyData();
    expect(result.success).toBe(false);
  });
  it('Fails on missing action', async () => {
    const proxy = new Proxy(actionIsMissing);
    const result: ProxyResponse = await proxy.getProxyData();
    expect(result.success).toBe(false);
  });
  it('Fails on null action', async () => {
    const proxy = new Proxy(actionIsNull);
    const result: ProxyResponse = await proxy.getProxyData();
    expect(result.success).toBe(false);
  });
  it('Supports Binance', async () => {
    const proxy = new Proxy(binance);
    const result: ProxyResponse = await proxy.getProxyData();
    const data = JSON.parse(result.data);
    expect(result.success).toBe(true);
    expect(data).toHaveProperty('symbol');
    expect(data).toHaveProperty('price');
  });
  it('Supports the overrideURL', async () => {
    const proxy = new Proxy(overrideUrl);
    const result: ProxyResponse = await proxy.getProxyData();
    const data = JSON.parse(result.data);
    expect(result.success).toBe(true);
    expect(data).toHaveProperty('symbol');
    expect(data).toHaveProperty('price');
  });
});
