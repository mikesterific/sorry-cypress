const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'my-parallel-project',
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      
      // Log the instance being tested
      on('before:run', (details) => {
        console.log('🎯 Testing instance:', config.baseUrl)
        console.log('📝 Project ID:', config.projectId)
      })
      
      return config
    },
    // Video and screenshot settings
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    
    // Retry settings for flaky tests
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    // Default timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
  },
})
