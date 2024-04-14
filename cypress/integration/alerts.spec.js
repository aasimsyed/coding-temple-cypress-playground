describe('Alerts Handling on DEMOQA', () => {
  beforeEach(() => {
    cy.visitWithAdBlocker('https://demoqa.com/alerts');
    cy.clock();
  });

  it('tests the [Alert] button which shows an alert box', () => {
    cy.on('window:alert', (text) => expect(text).to.contain('You clicked a button'));
    cy.get('#alertButton').click();
  });

  it('ensures the [Timer Alert] button triggers after exactly 5 seconds', () => {
    cy.on('window:alert', (text) => expect(text).to.equal('This alert appeared after 5 seconds'));
    cy.get('#timerAlertButton').click();
    cy.tick(5000); // Simulate passing of 5 seconds
  });

  it('accepts a confirm alert and verifies actions taken on confirmation', () => {
    cy.on('window:confirm', (str) => {
      expect(str).to.eq('Do you confirm action?');
      return true;
    });
    cy.get('#confirmButton').click();
    cy.get('#confirmResult').should('contain', 'You selected Ok');
  });

  it('cancels a confirm alert and verifies actions taken on cancellation', () => {
    cy.on('window:confirm', (str) => {
      expect(str).to.eq('Do you confirm action?');
      return false;
    });
    cy.get('#confirmButton').click();
    cy.get('#confirmResult').should('contain', 'You selected Cancel');
  });

  it('accepts a prompt alert and verifies actions taken on confirmation', () => {
    cy.window().then((win) => cy.stub(win, 'prompt').returns('Cypress Tester'));
    cy.get('#promtButton').click();
    cy.get('#promptResult').should('contain', 'You entered Cypress Tester');
  });
});
