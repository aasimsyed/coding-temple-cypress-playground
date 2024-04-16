describe('Frames Handling on DEMOQA', () => {
  beforeEach(() => {
    cy.visitWithAdBlocker('https://demoqa.com/frames');
  });

  const verifyFrameContentAndSize = (frameId, expectedWidth, expectedHeight, expectedText) => {
    it(`verifies content and dimensions within ${frameId}`, () => {
      cy.get(frameId)
        .should('have.attr', 'width', expectedWidth)
        .and('have.attr', 'height', expectedHeight);

      cy.frameLoaded(frameId);
      cy.iframe(frameId).within(() => {
        cy.get('h1#sampleHeading').should('have.text', expectedText);
      });
    });
  };

  verifyFrameContentAndSize('#frame1', '500px', '350px', 'This is a sample page');
  verifyFrameContentAndSize('#frame2', '100px', '100px', 'This is a sample page');
});
