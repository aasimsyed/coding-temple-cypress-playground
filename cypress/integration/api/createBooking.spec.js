import { getNewToken } from '../../support/utils';
import { compileSchema } from '../../support/ajv-utils';

describe('CreateBooking API Test', () => {
  before(() => {
    // Load and compile schemas
    cy.readFile('cypress/schemas/createBookingRequest.json')
      .then(compileSchema).as('validateRequest');
    cy.readFile('cypress/schemas/createBookingResponse.json')
      .then(compileSchema).as('validateResponse');
    cy.log('Schemas compiled successfully.');

    // Load booking details
    cy.fixture('bookingDetails.json').as('bookingData');

    // Retrieve a new token and store as alias
    getNewToken().then(cy.wrap).as('token');
  });

  after(() => {
    // Clean up: delete the booking created in the before hook
    cy.get('@token').then(token => {
      cy.get('@bookingId').then(bookingId => {
        if (bookingId && token) {
          cy.log('Cleaning up: deleting the booking created in the before hook');
          cy.deleteBooking(bookingId, token).then(response => {
            expect(response.status).to.eq(201);
            cy.log(`Booking with ID: ${bookingId} deleted successfully.`);
          });
        } else {
          cy.log('No booking ID or token available for cleanup.');
        }
      });
    });
  });

  it('should create a new booking and validate the response matches the request', function () {
    // Use aliases to ensure data is loaded before executing the test
    cy.get('@token').then(token => {
      cy.get('@bookingData').then(bookingData => {
        cy.log('Creating a new booking with the provided details');
        cy.createBooking(bookingData, token).then(response => {
          expect(response.status).to.eq(200);
          cy.log('Booking created with status:', response.status);

          // Validate response schema
          cy.get('@validateResponse').then(validateResponse => {
            if (!validateResponse(response.body)) {
              const errors = validateResponse.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
              throw new Error(`Response validation failed: ${errors}`);
            }
            cy.log('Response schema validation passed.');

            // Store the bookingId for cleanup
            cy.wrap(response.body.bookingid).as('bookingId');
          });
        });
      });
    });
  });
});
