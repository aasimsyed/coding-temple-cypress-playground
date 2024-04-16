// cypress/support/utils.js
export const getNewToken = () => {
  return cy.request({
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
    return response.body.token;
  });
};
