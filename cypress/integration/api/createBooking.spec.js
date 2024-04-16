// Import utilities as needed
import { getNewToken } from '../../support/utils';

describe('CreateBooking API Test', () => {
  let token;
  let bookingData;

  before(() => {
    // Load booking details from a fixture file and log the data
    cy.fixture('bookingDetails.json').then((data) => {
      bookingData = data;
      cy.log('Booking details loaded', JSON.stringify(bookingData));
    });

    // Retrieve a new token, log it, and store it for use in tests
    getNewToken().then((tokenResponse) => {
      token = tokenResponse;
      cy.log('Auth token retrieved', token);
    });
  });

  it('should create a new booking and validate the response matches the request', function () {
    // Ensure token and bookingData are loaded before executing the test
    expect(token).to.not.be.undefined;
    expect(bookingData).to.not.be.undefined;

    cy.log('Creating a new booking with the provided details');
    // Use the refactored createBooking command
    cy.createBooking(bookingData, token).then((response) => {
      cy.log('Booking created successfully');

      expect(response.status).to.eq(200);
      cy.log('Response Status:', response.status);

      // Verify that the response body includes the booking details submitted
      expect(response.body.booking).to.deep.include(bookingData);
      cy.log('Response booking details matched the request');

      // Check that the bookingid is a number
      expect(response.body.bookingid).to.be.a('number');
      cy.log('Booking ID is a number:', response.body.bookingid);
    });
  });
});
