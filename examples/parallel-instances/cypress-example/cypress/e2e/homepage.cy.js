describe('Homepage Tests', () => {
  beforeEach(() => {
    cy.logInstance()
  })

  it('should load the homepage successfully', () => {
    cy.visit('/')
    cy.url().should('include', Cypress.config('baseUrl'))
  })

  it('should display the page title', () => {
    cy.visit('/')
    cy.title().should('not.be.empty')
  })

  it('should have a visible body element', () => {
    cy.visit('/')
    cy.get('body').should('be.visible')
  })

  it('should load within acceptable time', () => {
    const startTime = Date.now()
    cy.visit('/')
    cy.window().then(() => {
      const loadTime = Date.now() - startTime
      cy.log(`Page load time: ${loadTime}ms`)
      // Assert load time is under 5 seconds
      expect(loadTime).to.be.lessThan(5000)
    })
  })

  it('should take a screenshot of the homepage', () => {
    cy.visit('/')
    cy.screenshotWithInstance('homepage')
  })
})
