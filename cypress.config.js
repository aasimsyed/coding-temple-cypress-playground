const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    supportFile: 'cypress/support/commands.js',
    specPattern: [
      'cypress/integration/e2e/**/*.spec.js',
      'cypress/integration/api/**/*.spec.js'
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
