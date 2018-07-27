import { Schema } from 'jsonschema';
import { SchemaValidator } from './SchemaValidator';

let map = require('lodash.map');
let isUndefined = require('lodash.isundefined');

export const assert = {
  assert(condition: boolean, message: string): void {
    if (!condition) {
      throw new Error(message);
    }
  },
  isSchemaValid(
    variableName: string,
    value: {},
    schema: Schema,
    subSchemas?: Schema[]
  ): void {
    const schemaValidator = new SchemaValidator();
    if (!isUndefined(subSchemas)) {
      map(subSchemas, schemaValidator.addSchema.bind(schemaValidator));
    }
    const validationResult = schemaValidator.validate(value, schema);
    const hasValidationErrors = validationResult.errors.length > 0;
    const msg = `Expected ${variableName} to confirm to schema ${schema.id}
      Encountered: ${JSON.stringify(value, null, '\t')}
      Validation errors: ${validationResult.errors.join(', ')}`;
    this.assert(!hasValidationErrors, msg);
  },
  typeAssertionMessage(variableName: string, type: string, value: {}): string {
    return `Expected ${variableName} to be of type ${type}, encountered: ${value}`;
  }
};
