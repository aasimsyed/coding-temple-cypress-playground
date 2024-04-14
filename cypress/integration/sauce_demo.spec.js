// saucedemo_tests.cy.js
describe('Sauce Demo Tests', () => {
  beforeEach(() => {
     // Visits the Sauce Demo website before each test
    cy.visitWithAdBlocker('http://www.saucedemo.com');
  });

  it('TC_1: Successfully logs in as a standard user', () => {
    cy.loginWithFixture('standardUser');
    cy.get('.inventory_list').should('be.visible');
  });

  it('TC_2: Fails to log in with invalid credentials', () => {
    cy.loginWithFixture('invalidPassword');
    cy.log('Attempted login with in with invalid password');
    cy.get('.error-message-container').then((elem) => {
      console.log('Error message element:', elem);
    }).should('be.visible');
  });

  it('TC_3: Navigates through product pages', () => {
    cy.loginWithFixture('standardUser');
    cy.get('.inventory_item_name').first().click();
    cy.get('.inventory_details').should('be.visible');
    cy.go('back');
    cy.get('.inventory_list').should('be.visible');
  });

  it('TC_4: Adds an item to the cart', () => {
    cy.loginWithFixture('standardUser');
    cy.get('.btn_inventory').first().click();
    cy.get('.shopping_cart_link').click();
    cy.get('.cart_list').should('be.visible');
  });

  it('TC_5: Adds all items and completes checkout', () => {
    cy.loginWithFixture('standardUser');
    cy.addAllItemsToCart();
    cy.completeCheckout('John', 'Dow', '12345');
    cy.get('.complete-header').should('be.visible');
  });
});