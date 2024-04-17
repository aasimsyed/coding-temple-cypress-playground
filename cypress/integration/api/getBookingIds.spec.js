import { compileSchema } from '../../support/ajv-utils';

describe('Get Booking IDs API Tests', () => {
  let validateResponse;

  before(() => {
    // Load and compile the schema for response validation
    cy.readFile('cypress/schemas/getBookingIdsResponse.json')
      .then(compileSchema)
      .then((compiledSchema) => {
        validateResponse = compiledSchema;
        cy.log('Response schema compiled successfully.');
      });

    cy.log('Starting tests for the GetBookingIds endpoint');
  });

  // Helper function to perform API request and validate the response
  const testBookingRetrieval = (description, queryParams = {}) => {
    it(`should retrieve bookings ${description}`, () => {
      cy.apiRequest('GET', '/booking', null, null, queryParams).then((response) => {
        expect(response.status).to.eq(200);
        if (!validateResponse(response.body)) {
          const errors = validateResponse.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
          throw new Error(`Response validation failed: ${errors}`);
        }
        cy.log(`Bookings ${description}:`, JSON.stringify(response.body));
      });
    });
  };

  // Test cases using the helper function
  testBookingRetrieval('for all booking IDs');
  testBookingRetrieval('by first name', { firstname: 'Jim' });
  testBookingRetrieval('by last name', { lastname: 'Brown' });
  testBookingRetrieval('by check-in date', { checkin: '2021-01-01' });
  testBookingRetrieval('by check-out date', { checkout: '2021-01-02' });
});
