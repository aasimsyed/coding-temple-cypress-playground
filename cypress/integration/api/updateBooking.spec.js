import { getNewToken } from '../../support/utils';
import { compileSchema } from '../../support/ajv-utils';

describe('UpdateBooking API Test', () => {
  before(() => {
    // Load and compile the schemas, then store them as aliases
    cy.readFile('cypress/schemas/updateBookingRequest.json')
      .then(compileSchema)
      .as('validateUpdateRequestSchema');
    cy.readFile('cypress/schemas/updateBookingResponse.json')
      .then(compileSchema)
      .as('validateUpdateResponseSchema');
  
    // Load booking details
    cy.fixture('bookingDetails.json').as('bookingDetails');
    cy.fixture('updateBookingDetails.json').as('updateBookingDetails');
  
    // Retrieve a new authentication token and log it
    getNewToken().then(token => {
      cy.wrap(token).as('token');
    });
  });

  after(() => {
    // Clean up by deleting the booking
    cy.get('@token').then(token => {
      cy.get('@bookingId').then(bookingId => {
        cy.deleteBooking(bookingId, token).then(response => {
          expect(response.status).to.eq(201);
        });
      });
    });
  });

  it('should create a booking and then update it', function () {
    // Access token from alias
    cy.get('@token').then(token => {
      cy.get('@bookingDetails').then(bookingDetails => {
        cy.createBooking(bookingDetails, token).then(response => {
          expect(response.status).to.eq(200);
          cy.wrap(response.body.bookingid).as('bookingId');
        });
      });

      cy.get('@updateBookingDetails').then(updateDetails => {
        cy.get('@bookingId').then(bookingId => {
          cy.apiRequest('PUT', `/booking/${bookingId}`, token, updateDetails).then(response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.deep.include(updateDetails);  // Validate the response matches the update details
            cy.get('@validateUpdateResponseSchema').then(validate => {
              const validationResult = validate(response.body);
              if (!validationResult) {
                const errors = validate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
                throw new Error(`Response validation failed: ${errors}`);
              }
            });
          });
        });
      });
    });
  });
});
