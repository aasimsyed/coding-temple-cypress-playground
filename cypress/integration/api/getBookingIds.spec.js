describe('Get Booking IDs API Tests', () => {
  before(() => {
    cy.log('Starting tests for the GetBookingIds endpoint');
  });

  it('should retrieve all booking IDs', () => {
    cy.apiRequest('GET', '/booking').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      cy.log('Total bookings found:', response.body.length);
    }).then(response => {
      console.log('Response:', response);
    });
  });

  it('should retrieve bookings by first name', () => {
    cy.apiRequest('GET', '/booking', null, null, { firstname: 'Jim' }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      cy.log(`Bookings with firstname Jim: ${JSON.stringify(response.body)}`);
    });
  });

  it('should retrieve bookings by last name', () => {
    cy.apiRequest('GET', '/booking', null, null, { lastname: 'Brown' }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      cy.log(`Bookings with lastname Brown: ${JSON.stringify(response.body)}`);
    });
  });
  
  it('should retrieve bookings by check-in date', () => {
    cy.apiRequest('GET', '/booking', null, null, { checkin: '2021-01-01' }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      cy.log(`Bookings with check-in on 2021-01-01: ${JSON.stringify(response.body)}`);
    });
  });  

  it('should retrieve bookings by check-out date', () => {
    cy.apiRequest('GET', '/booking', null, null, { checkout: '2021-01-02' }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      cy.log(`Bookings with check-out on 2021-01-02: ${JSON.stringify(response.body)}`);
    });
  });
});