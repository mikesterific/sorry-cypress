// Custom Cypress commands

/**
 * Custom command to log the current instance
 */
Cypress.Commands.add('logInstance', () => {
  const baseUrl = Cypress.config('baseUrl')
  cy.log(`Current instance: ${baseUrl}`)
})

/**
 * Custom command to check if we're testing a specific instance
 */
Cypress.Commands.add('isInstance', (instanceName) => {
  const baseUrl = Cypress.config('baseUrl')
  return baseUrl.includes(instanceName)
})

/**
 * Custom command to visit with instance-specific behavior
 */
Cypress.Commands.add('visitWithRetry', (url, options = {}) => {
  const maxRetries = options.retries || 3
  const retryDelay = options.retryDelay || 1000
  
  const attemptVisit = (retriesLeft) => {
    cy.visit(url, { failOnStatusCode: false, ...options }).then((response) => {
      if (response.status >= 400 && retriesLeft > 0) {
        cy.wait(retryDelay)
        cy.log(`Retrying visit... (${retriesLeft} attempts left)`)
        attemptVisit(retriesLeft - 1)
      }
    })
  }
  
  attemptVisit(maxRetries)
})

/**
 * Custom command to get instance-specific test data
 */
Cypress.Commands.add('getTestData', (key) => {
  const baseUrl = Cypress.config('baseUrl')
  
  // Define instance-specific test data
  const testDataMap = {
    'production': {
      username: 'prod_user',
      apiKey: 'prod_api_key',
      testItem: 'Production Item'
    },
    'staging': {
      username: 'staging_user',
      apiKey: 'staging_api_key',
      testItem: 'Staging Item'
    },
    'development': {
      username: 'dev_user',
      apiKey: 'dev_api_key',
      testItem: 'Dev Item'
    },
    'scale-computing': {
      username: 'scale_user',
      apiKey: 'scale_api_key',
      testItem: 'Scale Item'
    }
  }
  
  // Find matching instance
  for (const [instance, data] of Object.entries(testDataMap)) {
    if (baseUrl.includes(instance)) {
      return data[key] || null
    }
  }
  
  return null
})

/**
 * Custom command to take screenshot with instance name
 */
Cypress.Commands.add('screenshotWithInstance', (name) => {
  const baseUrl = Cypress.config('baseUrl')
  const instanceName = baseUrl.replace(/https?:\/\//, '').replace(/[:.]/g, '-')
  cy.screenshot(`${instanceName}-${name}`)
})
