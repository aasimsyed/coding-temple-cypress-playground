describe('Health Check API Test', () => {
  it('Ping the API for a health check', () => {
    cy.apiRequest('GET', '/ping').then((response) => {
      expect(response.status).to.eq(201);  // Expecting a 201 status as per your API docs
      cy.log('API health check response status:', response.status);
    });
  });
});
