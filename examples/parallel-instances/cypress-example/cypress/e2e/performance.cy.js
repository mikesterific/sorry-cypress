describe('Performance Tests', () => {
  beforeEach(() => {
    cy.logInstance()
  })

  it('should measure page load performance', () => {
    const startTime = performance.now()
    
    cy.visit('/')
    
    cy.window().then((win) => {
      const endTime = performance.now()
      const loadTime = endTime - startTime
      
      cy.log(`Total load time: ${loadTime.toFixed(2)}ms`)
      
      // Log performance metrics
      if (win.performance && win.performance.timing) {
        const timing = win.performance.timing
        const dns = timing.domainLookupEnd - timing.domainLookupStart
        const tcp = timing.connectEnd - timing.connectStart
        const ttfb = timing.responseStart - timing.requestStart
        
        cy.log(`DNS lookup: ${dns}ms`)
        cy.log(`TCP connection: ${tcp}ms`)
        cy.log(`Time to first byte: ${ttfb}ms`)
      }
      
      // Assert reasonable load time (adjust threshold as needed)
      expect(loadTime).to.be.lessThan(10000)
    })
  })

  it('should compare performance across instances', () => {
    const baseUrl = Cypress.config('baseUrl')
    const metrics = {}
    
    const startTime = Date.now()
    cy.visit('/')
    
    cy.window().then(() => {
      const endTime = Date.now()
      metrics.loadTime = endTime - startTime
      
      cy.log(`Instance: ${baseUrl}`)
      cy.log(`Load time: ${metrics.loadTime}ms`)
      
      // You could store these metrics for comparison
      cy.writeFile(
        `cypress/performance-metrics/${baseUrl.replace(/[^a-zA-Z0-9]/g, '_')}.json`,
        {
          instance: baseUrl,
          timestamp: new Date().toISOString(),
          metrics: metrics
        }
      )
    })
  })

  it('should verify resource loading', () => {
    cy.visit('/')
    
    cy.window().then((win) => {
      if (win.performance && win.performance.getEntriesByType) {
        const resources = win.performance.getEntriesByType('resource')
        
        cy.log(`Total resources loaded: ${resources.length}`)
        
        // Find slow resources
        const slowResources = resources.filter(r => r.duration > 1000)
        
        if (slowResources.length > 0) {
          cy.log(`Slow resources found: ${slowResources.length}`)
          slowResources.forEach(r => {
            cy.log(`Slow resource: ${r.name} (${r.duration.toFixed(2)}ms)`)
          })
        }
        
        // Assert not too many resources
        expect(resources.length).to.be.lessThan(200)
      }
    })
  })

  it('should verify response times are acceptable', () => {
    const maxResponseTime = 5000 // 5 seconds
    
    cy.visit('/', { timeout: maxResponseTime })
    cy.get('body').should('be.visible')
    
    cy.log('Page responded within acceptable time')
  })
})
