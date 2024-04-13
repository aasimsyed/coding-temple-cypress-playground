describe('Frames Handling on DEMOQA', () => {
  beforeEach(() => {
    cy.visitWithAdBlocker('https://demoqa.com/frames');
  });

  // Test to check content and dimensions of frame1
  it('verifies content and dimensions within frame1', () => {
    cy.get('#frame1')
      .should('have.attr', 'width', '500px')
      .and('have.attr', 'height', '350px');

    cy.frameLoaded('#frame1');
    cy.iframe('#frame1').within(() => {
      cy.get('h1#sampleHeading').should('exist')
        .and('have.text', 'This is a sample page');
    });
  });

  // Test to check content and dimensions of frame2
  it('verifies content and dimensions within frame2', () => {
    cy.get('#frame2')
      .should('have.attr', 'width', '100px')
      .and('have.attr', 'height', '100px');

    cy.frameLoaded('#frame2');
    cy.iframe('#frame2').within(() => {
      cy.get('h1#sampleHeading').should('exist')
        .and('have.text', 'This is a sample page');
    });
  });
});
