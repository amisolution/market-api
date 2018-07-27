export const ContractNewSchema = {
  id: '/ContractNew',
  properties: {
    name: { $ref: '/String' },
    address: { $ref: '/Address' },
    collateral_token_name: { $ref: '/String' },
    collateral_token_symbol: { $ref: '/String' },
    collateral_token_address: { $ref: '/Address' },
    oracle_query: { $ref: '/Oracle' },
    is_settled: { $ref: '/Boolean' },
    collateral_pool_balance: { $ref: '/Number' },
    expiration_timestamp: { $ref: '/Number' },
    price_cap: { $ref: '/Number' },
    price_floor: { $ref: '/Number' },
    price_decimal_places: { $ref: '/Number' },
    last_trade_price: { $ref: '/Number' },
    last_queried_price: { $ref: '/Number' },
    qty_multiplier: { $ref: '/Number' },
    reference_asset: { $ref: '/String' },
    is_whitelisted: { $ref: '/Boolean' }
  },
  required: [
    'name',
    'address',
    'collateral_token_name',
    'collateral_token_symbol',
    'collateral_token_address',
    'oracle_query',
    'is_settled',
    'collateral_pool_balance',
    'expiration_timestamp',
    'price_cap',
    'price_floor',
    'price_decimal_places',
    'last_trade_price',
    'last_queried_price',
    'qty_multiplier',
    'reference_asset',
    'is_whitelisted'
  ],
  type: 'object'
};

export const ContractUpdateSchema = {
  id: '/ContractUpdate',
  properties: {
    name: { $ref: '/String' },
    address: { $ref: '/Address' },
    collateral_token_name: { $ref: '/String' },
    collateral_token_symbol: { $ref: '/String' },
    collateral_token_address: { $ref: '/Address' },
    oracle_query: { $ref: '/Oracle' },
    is_settled: { $ref: '/Boolean' },
    collateral_pool_balance: { $ref: '/Number' },
    expiration_timestamp: { $ref: '/Number' },
    price_cap: { $ref: '/Number' },
    price_floor: { $ref: '/Number' },
    price_decimal_places: { $ref: '/Number' },
    last_trade_price: { $ref: '/Number' },
    last_queried_price: { $ref: '/Number' },
    qty_multiplier: { $ref: '/Number' },
    reference_asset: { $ref: '/String' },
    is_whitelisted: { $ref: '/Boolean' }
  },
  type: 'object'
};
