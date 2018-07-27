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

export const StringSchema = {
  id: '/String',
  type: 'string',
  minLength: 1,
  maxLength: 255
};

export const OracleSchema = {
  id: '/Oracle',
  type: 'string',
  minLength: 1
};

export const BooleanSchema = {
  id: '/Boolean',
  type: 'boolean'
};
