export const getNewToken = () => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('restfulBookerUrl')}/auth`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      username: 'admin',
      password: 'password123',
    },
  }).then((response) => {
    // Optionally handle non-200 responses more gracefully here
    if (response.status === 200 && response.body.token) {
      return response.body.token;
    } else {
      throw new Error('Failed to retrieve token or invalid response');
    }
  });
};
