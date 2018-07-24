export const AddressSchema = {
  id: '/Address',
  type: 'string',
  pattern: '^0x[0-9a-fA-F]{40}$'
};

export const NumberSchema = {
  id: '/Number',
  type: 'number',
  pattern: '^\\d+(\\.\\d+)?$'
};
