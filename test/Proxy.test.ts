import { Proxy } from '../src/lib/Proxy';
import { toBeNumber, toBeObject } from 'jest-extended';

// types
import { ProxyResponse } from '../src/types/Responses';

describe('Proxy', () => {
  const entityIsMissing: Object = { pathParameters: {} };
  const entityIsNull: Object = { pathParameters: { entity: null } };
  const proxyIsMissing: Object = { pathParameters: { entity: 'binance' } };
  const proxyIsNull: Object = {
    pathParameters: { entity: 'binance', proxy: null }
  };
  const binance: Object = {
    pathParameters: {
      entity: 'binance',
      proxy: 'api/v3/ticker/price'
    },
    queryStringParameters: {
      symbol: 'EOSETH'
    }
  };
  const bitfinex: Object = {
    pathParameters: {
      entity: 'bitfinex',
      proxy: 'v1/pubticker/BTCUSD'
    },
    queryStringParameters: {}
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
    const proxy = new Proxy(proxyIsMissing);
    const result: ProxyResponse = await proxy.getProxyData();
    expect(result.success).toBe(false);
  });
  it('Fails on null action', async () => {
    const proxy = new Proxy(proxyIsNull);
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
  it('Supports Bitfinex', async () => {
    const proxy = new Proxy(bitfinex);
    const result: ProxyResponse = await proxy.getProxyData();
    const data = JSON.parse(result.data);
    expect(result.success).toBe(true);
    expect(data).toBeDefined();
    expect(data).toBeObject();
    expect(data).toHaveProperty('last_price');
    expect(parseFloat(data.last_price)).toBeNumber();
  });
});
