import { getNewToken } from '../../support/utils';
import { compileSchema } from '../../support/ajv-utils';

describe('Partial Update Booking API Test', () => {
  before(() => {
    // Load and compile the request and response schemas, then store them as aliases
    cy.readFile('cypress/schemas/partialUpdateBookingRequest.json')
      .then(compileSchema)
      .as('validatePartialUpdateRequestSchema');
    cy.readFile('cypress/schemas/partialUpdateBookingResponse.json')
      .then(compileSchema)
      .as('validatePartialUpdateResponseSchema');

    // Load booking details and prepare for updates
    cy.fixture('bookingDetails.json').as('bookingDetails');
    cy.fixture('updateBookingDetails.json').as('updateBookingDetails');

    // Retrieve a new authentication token and store it
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

  it('should create a booking and then partially update it', function () {
    // Create a new booking
    cy.get('@token').then(token => {
      cy.get('@bookingDetails').then(bookingDetails => {
        cy.createBooking(bookingDetails, token).then(response => {
          expect(response.status).to.eq(200);
          cy.wrap(response.body.bookingid).as('bookingId');
        });
      });
    });

    // Partially update the booking
    cy.get('@token').then(token => {
      cy.get('@updateBookingDetails').then(updateDetails => {
        cy.get('@bookingId').then(bookingId => {
          cy.apiRequest('PATCH', `/booking/${bookingId}`, token, updateDetails).then(response => {
            expect(response.status).to.eq(200);
            cy.get('@validatePartialUpdateResponseSchema').then(validate => {
              if (!validate(response.body)) {
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
