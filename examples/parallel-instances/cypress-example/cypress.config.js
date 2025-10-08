const { defineConfig } = require('cypress')
const { cloudPlugin } = require("cypress-cloud/plugin");

module.exports = defineConfig({
  projectId: 'scaleUI',
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('before:run', (details) => {
        console.log('🎯 Testing instance:', config.baseUrl)
        console.log('📝 Project ID:', config.projectId)
      })
      
      // Add cypress-cloud plugin
      return cloudPlugin(on, config);
    },
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    retries: {
      runMode: 2,
      openMode: 0
    },
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
  },
})
