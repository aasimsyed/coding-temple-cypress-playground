import 'cypress-iframe'

// visitWithAdBlocker: Visits a page and blocks ads
Cypress.Commands.add('visitWithAdBlocker', (url) => {
  cy.fixture('adBlockerUrls').then((urls) => {
    // Setup intercepts
    Object.keys(urls).forEach((key) => {
      if (key !== 'blockScripts') {
        cy.intercept(urls[key], { statusCode: 200, body: '' }).as(key);
      }
    });

    cy.intercept(urls['blockScripts'], (req) => {
      if (req.url.includes('google') || req.url.includes('adsbygoogle')) {
        req.destroy();
      }
    }).as('blockScripts');

    // Visit the page
    cy.visit(url);
  });
});

// Custom command for logging into Sauce Demo
Cypress.Commands.add('login', (username, password) => {
  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="login-button"]').click();
});

// Custom command to login with a user type
Cypress.Commands.add('loginWithFixture', (userType) => {
  cy.fixture('credentials').then((credentials) => {
    const user = credentials.users[userType];
    cy.login(user.username, user.password);
  });
});

// Custom command to add a single item to the cart by its name
Cypress.Commands.add('addItemToCartByName', (itemName) => {
  cy.contains('.inventory_item_name', itemName)
    .parents('.inventory_item')
    .within(() => {
      cy.get('.btn_inventory').click();
    });
});

// Custom command to add all items to the cart
Cypress.Commands.add('addAllItemsToCart', () => {
  cy.get('.inventory_item').each((element) => {
    // For each .inventory_item, find the button within it and click
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
  // This clicks the final 'Finish' button on the checkout page
  cy.get('.btn_action.cart_button').click(); 
});

// Example of overwriting the 'visit' command to always disable the cache
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  // Example usage of overwriting an existing command
  // This will append cache busting query param to each visit
  let noCacheStr = `_noCache=${Math.random()}`;
  url.includes('?') ? (url += `&${noCacheStr}`) : (url += `?${noCacheStr}`);
  return originalFn(url, options);
});