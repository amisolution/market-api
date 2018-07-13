import { isEventEmpty, isUrl } from '../src/utils';

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
        entity: ''
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
    expect(isEventEmpty(eventObjPropEmpty, '$.queryStringParameters')).toBe(
      true
    );

    expect(
      isEventEmpty(eventObjQueryStringNotEmpty, '$.queryStringParameters')
    ).toBe(false);
  });
});
