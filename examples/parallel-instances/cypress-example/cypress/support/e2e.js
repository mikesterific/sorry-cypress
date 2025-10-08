// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// This runs before each test file
before(() => {
  // Log the instance URL
  cy.log(`Testing against: ${Cypress.config('baseUrl')}`)
})

// Custom behavior before each test
beforeEach(() => {
  // You can add common setup here
  // For example, setting up API mocks, clearing cookies, etc.
})

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from failing the test
  // You might want to log these instead
  console.error('Uncaught exception:', err.message)
  return false
})

// Add custom Cypress configuration based on baseUrl
const baseUrl = Cypress.config('baseUrl')

// You can set instance-specific configuration here
if (baseUrl.includes('production') || baseUrl.includes('prod')) {
  Cypress.config('defaultCommandTimeout', 15000)
  cy.log('Using production settings')
} else if (baseUrl.includes('staging')) {
  Cypress.config('defaultCommandTimeout', 12000)
  cy.log('Using staging settings')
}
