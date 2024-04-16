describe('CreateToken API Test', () => {
  it('should create a new auth token', () => {
    cy.request({
      method: 'POST',
      url: 'https://restful-booker.herokuapp.com/auth',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        username: 'admin',
        password: 'password123',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      expect(response.body.token).to.match(/^[a-z0-9]{15}$/,
       'Token matches the expected alphanumeric 15 characters format');
    });
  });
});
