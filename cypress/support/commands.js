import 'cypress-iframe';

// Helper function to log and throw errors
function logAndThrow(message) {
  cy.log(message);
  throw new Error(message);
}

// Custom command to visit a URL with ad blockers enabled
Cypress.Commands.add('visitWithAdBlocker', (url) => {
  cy.fixture('adBlockerUrls').then(urls => {
    try {
      Object.entries(urls).forEach(([key, value]) => {
        cy.intercept(value, {
          statusCode: key === 'blockScripts' ? undefined : 200,
          body: key === 'blockScripts' ? undefined : '',
          onResponse: key === 'blockScripts' ? (req) => {
            if (req.url.includes('google') || req.url.includes('adsbygoogle')) {
              req.destroy();
            }
          } : undefined,
          log: false
        }).as(key);
      });
      cy.visit(url).then(() => cy.log('Visited with ad blockers set up successfully.'));
    } catch (error) {
      logAndThrow(`Ad Blocker setup error: ${error.message}`);
    }
  });
});

// Custom command for logging into a site
Cypress.Commands.add('login', (username, password) => {
  cy.get('[data-test="username"]').type(username, { log: false }).should('have.value', username);
  cy.get('[data-test="password"]').type(password, { log: false }).should('have.value', password);
  cy.get('#login-button').click();
});

// Custom command to login with a user type from a fixture
Cypress.Commands.add('loginWithFixture', (userType) => {
  cy.fixture('credentials').then(credentials => {
    const user = credentials.users[userType];
    if (!user) logAndThrow('User type not found in fixture');
    cy.login(user.username, user.password);
  });
});

// Custom command to add an item to the cart by name
Cypress.Commands.add('addItemToCartByName', (itemName) => {
  cy.contains('.inventory_item_name', itemName).parents('.inventory_item').within(() => {
    cy.get('.btn_inventory').click().should('have.class', 'btn_inventory');
  });
});

// Custom command to add all items to the cart
Cypress.Commands.add('addAllItemsToCart', () => {
  cy.get('.inventory_item').each(element => {
    cy.wrap(element).find('.btn_inventory').click();
  });
});

// Custom command to complete the checkout process
Cypress.Commands.add('completeCheckout', (firstName, lastName, zipCode) => {
  cy.get('.shopping_cart_link').click();
  cy.get('.checkout_button').click();
  cy.get('#first-name').type(firstName);
  cy.get('#last-name').type(lastName);
  cy.get('#postal-code').type(zipCode);
  cy.get('.btn_primary.cart_button').click();
  cy.get('.btn_action.cart_button').click(); // This clicks the final 'Finish' button on the checkout page
});

// Overwriting the 'visit' command to always disable the cache
Cypress.Commands.overwrite('visit', (originalFn, url, options = {}) => {
  options.headers = options.headers || {};
  options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';

  return originalFn(url, options);
});

Cypress.Commands.add('apiRequest', (method, endpoint, token = null, body = null, qs = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method: method,
    url: `${Cypress.env('restfulBookerUrl')}${endpoint}`,
    headers: headers,
    qs: qs
  };

  if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    options.body = body;
  }

  return cy.request(options);
});

Cypress.Commands.add('createBooking', (bookingDetails, token) => {
  cy.apiRequest('POST', '/booking', token, bookingDetails);
});