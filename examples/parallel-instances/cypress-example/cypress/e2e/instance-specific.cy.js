describe('Instance-Specific Tests', () => {
  beforeEach(() => {
    cy.logInstance()
  })

  it('should use instance-specific test data', () => {
    const username = cy.getTestData('username')
    const apiKey = cy.getTestData('apiKey')
    
    cy.log('Using test data for this instance')
    cy.wrap(username).should('not.be.null')
  })

  it('should identify the current instance', () => {
    const baseUrl = Cypress.config('baseUrl')
    cy.log(`Current instance: ${baseUrl}`)
    
    // You can run different tests based on the instance
    if (baseUrl.includes('production') || baseUrl.includes('prod')) {
      cy.log('Running production-specific tests')
      // Add production-specific tests here
    } else if (baseUrl.includes('staging')) {
      cy.log('Running staging-specific tests')
      // Add staging-specific tests here
    } else if (baseUrl.includes('scale-computing')) {
      cy.log('Running Scale Computing-specific tests')
      // Add Scale Computing-specific tests here
    }
  })

  it('should handle instance-specific features', () => {
    cy.visit('/')
    
    const baseUrl = Cypress.config('baseUrl')
    
    // Example: Different assertions for different environments
    if (baseUrl.includes('production')) {
      cy.log('Verifying production features')
      // Production-specific assertions
    } else {
      cy.log('Verifying non-production features')
      // Non-production-specific assertions
    }
    
    cy.get('body').should('be.visible')
  })

  it('should verify instance accessibility', () => {
    cy.visitWithRetry('/', { retries: 3, retryDelay: 2000 })
    cy.get('body').should('be.visible')
    cy.screenshotWithInstance('accessibility-check')
  })

  it('should test API endpoints with instance-specific keys', () => {
    const apiKey = cy.getTestData('apiKey')
    
    cy.log(`Testing with API key for this instance`)
    
    // Example API test (adjust URL based on your API)
    // cy.request({
    //   method: 'GET',
    //   url: '/api/health',
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`
    //   }
    // }).then((response) => {
    //   expect(response.status).to.eq(200)
    // })
    
    // For now, just verify we have the test data
    cy.wrap(apiKey).should('not.be.null')
  })
})
