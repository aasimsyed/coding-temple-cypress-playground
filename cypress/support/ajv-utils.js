// cypress/support/ajv-utils.js
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export const compileSchema = (schema) => {
  const validate = ajv.compile(schema);
  return (data) => {
    const valid = validate(data);
    if (!valid) {
      console.error(`Validation errors: ${ajv.errorsText(validate.errors)}`);
      return { valid: false, errors: ajv.errorsText(validate.errors) };
    }
    return { valid: true };
  };
};
