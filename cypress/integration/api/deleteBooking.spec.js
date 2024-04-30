import { getNewToken } from '../../support/utils';
import { compileSchema } from '../../support/ajv-utils';

describe('Delete Booking by ID API Tests', () => {
  let validateResponse, bookingId, token;

  before(() => {
    // Compile the response schema
    cy.readFile('cypress/schemas/deleteBookingResponse.json')
      .then(compileSchema)
      .then((compiledSchema) => {
        validateResponse = compiledSchema;
        cy.log('Response schema compiled successfully.');
      });

    // Retrieve authentication token
    getNewToken().then((receivedToken) => {
      cy.wrap(receivedToken).as('token');
      cy.log('Authentication token retrieved:', token);

      // Load booking details from a fixture and create a booking
      cy.fixture('bookingDetails.json').then((bookingDetails) => {
        cy.createBooking(bookingDetails, token).then((response) => {
          expect(response.status).to.eq(200);
          bookingId = response.body.bookingid;
          cy.wrap(bookingId).as('bookingId');
          cy.log(`New booking created with ID: ${bookingId}`);
        });
      });
    });
  });

  it('should delete a booking by ID', () => {
    cy.get('@token').then((token) => {
      cy.get('@bookingId').then((bookingId) => {
        if (bookingId && token) {
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
});
