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
    const eventObjPropEmpty = {
      pathParameters: {
        entity: ''
      }
    };
    expect(isEventEmpty(undefined)).toBe(true);
    expect(isEventEmpty(undefined, 'pathParameters')).toBe(true);
    expect(isEventEmpty(undefined, 'pathParameters', 'entity')).toBe(true);
    expect(isEventEmpty(eventEmpty)).toBe(false);
    expect(isEventEmpty(eventEmpty, 'pathParameters')).toBe(true);
    expect(isEventEmpty(eventEmpty, 'pathParameters', 'entity')).toBe(true);
    expect(isEventEmpty(eventObjEmpty)).toBe(false);
    expect(isEventEmpty(eventObjEmpty, 'pathParameters')).toBe(false);
    expect(isEventEmpty(eventObjEmpty, 'pathParameters', 'entity')).toBe(true);
    expect(isEventEmpty(eventObjPropEmpty)).toBe(false);
    expect(isEventEmpty(eventObjPropEmpty, 'pathParameters')).toBe(false);
    expect(isEventEmpty(eventObjPropEmpty, 'pathParameters', 'entity')).toBe(false);
  });
});