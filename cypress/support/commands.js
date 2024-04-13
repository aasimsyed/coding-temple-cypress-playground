import 'cypress-iframe'

// visitWithAdBlocker: Visits a page and blocks ads
Cypress.Commands.add('visitWithAdBlocker', (url) => {
  // Setup intercepts
  cy.intercept('https://pagead2.googlesyndication.com/**', {statusCode: 200, body: ''}).as('blockAds');
  cy.intercept('https://www.googletagservices.com/tag/js/gpt.js', {statusCode: 200, body: ''}).as('blockGpt');
  cy.intercept('https://www.googletagmanager.com/gtm.js?id=GTM-MX8DD4S', {statusCode: 200, body: ''}).as('blockGtm');
  cy.intercept('https://cdn.ad.plus/player/adplus.js', {statusCode: 200, body: ''}).as('blockAdPlus');
  cy.intercept('**/*.gif', {statusCode: 200, body: ''}).as('blockGif');
  cy.intercept('**/usermatch.gif**', {statusCode: 200, body: ''}).as('blockUserMatch');
  cy.intercept('**/merge**', {statusCode: 200, body: ''}).as('blockMerge');
  cy.intercept('**/*.js', (req) => {
      if (req.url.includes('google') || req.url.includes('adsbygoogle')) {
          req.destroy();
      }
  }).as('blockScripts');

  // Visit the page
  cy.visit(url);
});