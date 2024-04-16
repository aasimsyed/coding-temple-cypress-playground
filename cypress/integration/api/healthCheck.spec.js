describe('Health Check API Test', () => {
  it('Ping the API for a health check', () => {
    const baseUrl = Cypress.env('restfulBookerUrl');
    cy.request({
      method: 'GET',
      url: `${baseUrl}/ping`,
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });
});
