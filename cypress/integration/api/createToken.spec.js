import { compileSchema } from '../../support/ajv-utils';

describe('CreateToken API Test', () => {
  before(() => {
    // Load and compile the schema, then store it as an alias for use in the tests
    cy.readFile('cypress/schemas/createTokenResponse.json')
      .then(compileSchema)
      .as('validateTokenSchema'); // Storing the compiled schema as an alias
    cy.log('Token schema compiled and stored as an alias.');
  });

  it('should create a new auth token', () => {
    cy.apiRequest('POST', '/auth', null, {
      username: 'admin',
      password: 'password123',
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log('Auth token created, validating response...');

      // Use the alias for the schema to validate the response
      cy.get('@validateTokenSchema').then((validate) => {
        const validationResult = validate(response.body);
        if (!validationResult) {
          const errors = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
          throw new Error(`Validation error: ${errors}`);
        }
        cy.log('Response validated successfully against the schema.');
      });
    });
  });
});