const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    supportFile: 'cypress/support/commands.js',
    specPattern: 'cypress/integration/**/*.spec.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
