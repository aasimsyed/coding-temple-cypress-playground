import 'cypress-iframe';

// Custom command to visit a URL with ad blockers enabled
Cypress.Commands.add('visitWithAdBlocker', (url) => {
  cy.fixture('adBlockerUrls').then((urls) => {
    try {
      Object.keys(urls).forEach((key) => {
        const routeMatcher = { statusCode: 200, body: '' };
        if (key === 'blockScripts') {
          cy.intercept(urls[key], (req) => {
            if (req.url.includes('google') || req.url.includes('adsbygoogle')) {
              req.destroy();
            }
          }).as(key);
        } else {
          cy.intercept(urls[key], routeMatcher).as(key);
        }
      });
      cy.visit(url).then(() => {
        cy.log('Visited with ad blockers set up successfully.');
      });
    } catch (error) {
      cy.log('Ad Blocker setup failed.');
      throw new Error(`Ad Blocker setup error: ${error.message}`);
    }
  });
});

// Custom command for logging into a site
Cypress.Commands.add('login', (username, password) => {
  cy.get('[data-test="username"]').type(username).then(($username) => {
    if (!$username.val()) throw new Error('Failed to type the username');
  });
  cy.get('[data-test="password"]').type(password).then(($password) => {
    if (!$password.val()) throw new Error('Failed to type the password');
  });
  cy.get('[data-test="login-button"]').click().then(($button) => {
    if ($button.is(':disabled')) throw new Error('Login button is disabled');
  });
});

// Custom command to login with a user type from a fixture
Cypress.Commands.add('loginWithFixture', (userType) => {
  cy.fixture('credentials').then((credentials) => {
    const user = credentials.users[userType];
    if (!user) throw new Error('User type not found in fixture');
    cy.login(user.username, user.password);
  });
});

// Custom command to add an item to the cart by name
Cypress.Commands.add('addItemToCartByName', (itemName) => {
  cy.contains('.inventory_item_name', itemName).parents('.inventory_item').within(() => {
    cy.get('.btn_inventory').click().then(($btn) => {
      if (!$btn.hasClass('btn_inventory')) throw new Error('Add to cart button not found');
    });
  });
});

// Custom command to add all items to the cart
Cypress.Commands.add('addAllItemsToCart', () => {
  cy.get('.inventory_item').each((element) => {
    cy.wrap(element).find('.btn_inventory').click().then(($btn) => {
      if (!$btn.hasClass('btn_inventory')) throw new Error('Add to cart button not found');
    });
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
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  // This will append a cache busting query param to each visit
  const noCacheStr = `_noCache=${Math.random()}`;
  url = url.includes('?') ? `${url}&${noCacheStr}` : `${url}?${noCacheStr}`;
  return originalFn(url, options);
});
