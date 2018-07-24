import { Oracle } from '../src/lib/Oracle';
import { deployedContracts } from '../src/constants';

// types
import { OracleResponse } from '../src/types/Responses';

describe('Oracle', () => {
  const oracle = new Oracle();

  it('Query is valid using address', async () => {
    const result: OracleResponse = await oracle.getOracleDataAddress(
      deployedContracts[4][0].address
    );
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('data');
    expect(result.data).toBeDefined();
  });

  it('Query is valid using parameter query', async () => {
    const result: OracleResponse = await oracle.getOracleDataQuery(
      'json(https://api.bitfinex.com/v2/ticker/tBTCUSD).7'
    );
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('data');
    expect(result.data).toBeDefined();
  });
});
