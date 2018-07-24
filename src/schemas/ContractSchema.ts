export const ContractSchema = {
  id: '/Contract',
  properties: {
    contractAddress: { $ref: '/Address' },
    expirationTimestamp: { $ref: '/Number' },
    feeRecipient: { $ref: '/Address' },
    maker: { $ref: '/Address' },
    makerFee: { $ref: '/Number' },
    orderQty: { $ref: '/Number' },
    price: { $ref: '/Number' },
    remainingQty: { $ref: '/Number' },
    salt: { $ref: '/Number' },
    taker: { $ref: '/Address' },
    takerFee: { $ref: '/Number' }
  },
  required: [
    'contractAddress',
    'expirationTimestamp',
    'feeRecipient',
    'maker',
    'makerFee',
    'orderQty',
    'price',
    'salt',
    'taker',
    'takerFee'
  ],
  type: 'object'
};
