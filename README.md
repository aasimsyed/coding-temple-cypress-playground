# API Test Suite Documentation for Restful Booker

## Overview

This repository contains a comprehensive API test suite for the Restful Booker platform, designed to ensure the reliability and correctness of its API endpoints through automated testing using Cypress.

## Prerequisites

- Node.js (version 12 or higher)
- npm (comes with Node.js)
- Cypress
- AJV and AJV-formats for schema validation (for validating API responses against JSON schemas)

Ensure all dependencies are installed by running:

```bash
npm install cypress ajv ajv-formats --save-dev
```

## Installation

Clone the repository and install dependencies to set up the project on your local machine:

```bash
git clone https://github.com/aasimsyed/coding-temple-cypress-playground
cd coding-temple-cypress-playground
npm install
```

## Running Tests

To open the Cypress Test Runner for interactive testing:

```bash
npx cypress open
```

To run tests headlessly suitable for CI environments:

```bash
npx cypress run
```

## Configuration

The cypress.config.js file is configured to handle environment variables and setup preferences:

```javascript
Copy code
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    env: {
      restfulBookerUrl: 'https://restful-booker.herokuapp.com'
    },
    chromeWebSecurity: false,
    supportFile: 'cypress/support/commands.js',
    specPattern: [
      'cypress/integration/e2e/**/*.spec.js',
      'cypress/integration/api/**/*.spec.js'
    ],
    setupNodeEvents(on, config) {
      // Event listeners can be defined here
    }
  }
});
```

## Custom Commands

Custom Cypress commands enhance test readability and reusability:

- *apiRequest*: Abstracts making API requests with dynamic inputs.
- *createBooking*: Wraps the apiRequest to create bookings.
- *deleteBooking*: Utilizes apiRequest to delete bookings based on ID.

These are defined in *cypress/support/commands.js*.

## Schema Validation

API response validation is performed using AJV combined with schemas defined in cypress/schemas. This ensures responses adhere to expected formats, crucial for API integrity.

## Using Fixtures

Fixtures are used to manage and maintain test data separate from test logic, located under cypress/fixtures. This allows easy management of test data without altering the test scripts.

## Best Practices Employed

- *Modular Test Structure*: Each API endpoint has dedicated test files under cypress/integration, making tests easier to manage and debug.
- *Environment Abstraction*: Configuration details are abstracted into cypress.config.js, allowing easy changes without code adjustments.
- *Schema Validation*: Ensures the API's output remains consistent, catching potential breaking changes.
- *Custom Commands*: Reduces code duplication and increases the maintainability of tests.
- *Efficient Use of Fixtures*: Separates test data from test logic, improving test clarity and ease of updates.

## Potential Future Improvements

- *Parallel Testing*: Implement Cypress's parallel execution capabilities to reduce test run times.
- *Increased Coverage*: Expand tests to cover more scenarios and edge cases.
- *Continuous Integration*: Integrate with CI/CD pipelines for automated running of tests upon code commits or at scheduled intervals.
- *Security Testing*: Integrate security-focused tests to identify and mitigate potential vulnerabilities.

## Project URL

- https://github.com/aasimsyed/coding-temple-cypress-playground
- PR for these change: https://github.com/aasimsyed/coding-temple-cypress-playground/pull/4

## Conclusion

The implemented test suite serves as a robust foundation for ongoing development, ensuring high standards of quality and reliability for the Restful Booker API. By adhering to best practices, this suite facilitates efficient testing and future expansion.
