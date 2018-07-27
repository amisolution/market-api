import { camelToSnake, isAddress, isEventEmpty, isUrl } from '../src/utils';

describe('utils', () => {
  it('Check for a valid URL', () => {
    expect(isUrl()).toBe(false);
    expect(isUrl(undefined)).toBe(false);
    expect(isUrl('')).toBe(false);
    expect(isUrl({})).toBe(false);
    expect(isUrl('http://127.0.0.1')).toBe(false);
    expect(isUrl('http://google.com')).toBe(true);
    expect(isUrl('http://google.com:8080')).toBe(true);
    expect(isUrl('http://google.com/search/results')).toBe(true);
    expect(isUrl('http://google.com/search/results?s=1323&p=yoyo')).toBe(true);
  });

  it('Validates addresses', () => {
    expect(isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d')).toBe(true);
    expect(isAddress('0xC1912FEE45D61C87CC5EA59DAE31190FFFFF232D')).toBe(true);
    expect(isAddress('0xC1912FEE45D61c87CC5eA59DAE31190FFFFF232D')).toBe(true);
    expect(isAddress('0xc1912fee45d61c87cc5ea59dae3119zfffff232d')).toBe(false);
    expect(isAddress('0xc1912fee45d61c87cc5ea59dae31190fffff232d1')).toBe(
      false
    );
    expect(isAddress('c1912fee45d61c87cc5ea59dae31190fffff232d')).toBe(true);
    expect(isAddress('c1912fee45d61c87cc5ea59dae31190fffff232')).toBe(false);
  });

  it('Check for an empty event object', () => {
    const eventEmpty = {};
    const eventObjEmpty = {
      pathParameters: {}
    };
    const eventObjQueryStringEmpty = {
      queryStringParameters: {}
    };
    const eventObjPropEmpty = {
      pathParameters: {
        entity: 1
      },
      queryStringParameters: {}
    };
    const eventObjQueryStringNotEmpty = {
      queryStringParameters: { symbol: 'EOSETH' }
    };

    expect(isEventEmpty(undefined)).toBe(true); // always empty when you don't provide a prop parameter
    expect(isEventEmpty(undefined, '$.pathParameters')).toBe(true);
    expect(isEventEmpty(undefined, '$.pathParameters')).toBe(true);
    expect(isEventEmpty(undefined, '$.queryStringParameters')).toBe(true);

    expect(isEventEmpty(eventEmpty)).toBe(true); // always empty when you don't provide a prop parameter
    expect(isEventEmpty(eventEmpty, '$.pathParameters')).toBe(true);
    expect(isEventEmpty(eventEmpty, '$.queryStringParameters')).toBe(true);
    expect(isEventEmpty(eventEmpty, '$.pathParameters')).toBe(true);

    expect(isEventEmpty(eventObjEmpty)).toBe(true); // always empty when you don't provide a prop parameter
    expect(isEventEmpty(eventObjEmpty, '$.pathParameters')).toBe(true);

    expect(isEventEmpty(eventObjQueryStringEmpty)).toBe(true); // always empty when you don't provide a prop parameter
    expect(
      isEventEmpty(eventObjQueryStringEmpty, '$.queryStringParameters')
    ).toBe(true);

    expect(isEventEmpty(eventObjPropEmpty)).toBe(true); // always empty when you don't provide a prop parameter
    expect(isEventEmpty(eventObjPropEmpty, '$.pathParameters')).toBe(false);
    expect(isEventEmpty(eventObjPropEmpty, '$.pathParameters.entity')).toBe(
      false
    );
    expect(isEventEmpty(eventObjPropEmpty, '$.queryStringParameters')).toBe(
      true
    );

    expect(
      isEventEmpty(eventObjQueryStringNotEmpty, '$.queryStringParameters')
    ).toBe(false);
  });

  it('Converts to snake case', () => {
    expect(camelToSnake('aaaa')).toBe('aaaa');
    expect(camelToSnake('Aaaa')).toBe('aaaa');
    expect(camelToSnake('AAaa')).toBe('a_aaa');
    expect(camelToSnake('aAaA')).toBe('a_aa_a');
    expect(camelToSnake('toLocaleDateString')).toBe('to_locale_date_string');
    expect(camelToSnake('ABCDE')).toBe('a_b_c_d_e');
    expect(camelToSnake('a_b_c_d_e')).toBe('a_b_c_d_e');
  });
});
