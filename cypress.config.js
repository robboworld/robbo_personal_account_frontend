const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Production build served by server.js (yarn e2e starts it on 3030).
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3030',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: true,
  },
})
