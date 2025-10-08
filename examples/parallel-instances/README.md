# 🚀 Parallel Cypress Testing with Sorry Cypress

> **Complete solution for running Cypress tests in parallel across multiple website instances using a self-hosted Sorry Cypress dashboard**

[![Cypress](https://img.shields.io/badge/Cypress-13.17.0-brightgreen)](https://cypress.io)
[![Sorry Cypress](https://img.shields.io/badge/Sorry%20Cypress-Self%20Hosted-blue)](https://sorry-cypress.dev)
[![cypress-cloud](https://img.shields.io/badge/cypress--cloud-1.9.0-orange)](https://github.com/currents-dev/cypress-cloud)

## 🎉 Major Breakthrough: Modern Cypress Integration

**We've solved the long-standing challenge of integrating modern Cypress versions (13.x+) with Sorry Cypress!** 

✅ **No more record key validation issues**  
✅ **No Gateway Connector complexity**  
✅ **Modern Cypress features available**  
✅ **Verified working with real dashboard results**

---

## 📖 Table of Contents

- [🎯 What This Does](#-what-this-does)
- [🎉 Key Features](#-key-features)
- [⚡ Quick Start](#-quick-start)
- [🔧 Detailed Setup](#-detailed-setup)
- [🚀 Running Parallel Tests](#-running-parallel-tests)
- [📊 Dashboard & Results](#-dashboard--results)
- [⚙️ Configuration](#️-configuration)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [📈 Use Cases](#-use-cases)
- [🤝 Contributing](#-contributing)

---

## 🎯 What This Does

This project enables you to run **Cypress end-to-end tests in parallel across multiple website instances** using a **self-hosted Sorry Cypress dashboard**. Perfect for:

- Testing the same functionality across **multiple environments** (prod, staging, dev)
- **Multi-tenant applications** with different customer instances
- **Regional deployments** (US, EU, APAC) 
- **Performance comparison** across different infrastructure
- **A/B testing validation**

## 🎉 Key Features

### 🔥 **Modern Integration (2025)**
- **Cypress 13.17.0** - Latest features and performance
- **cypress-cloud integration** - Seamless Sorry Cypress connection
- **No record key issues** - Completely bypassed validation problems
- **No Gateway Connector** - Simple, direct integration

### 🚀 **Parallel Testing**
- Run tests against **multiple instances simultaneously**
- **Automatic test distribution** across parallel runners
- **Centralized dashboard** for all results
- **Instance-specific screenshots** and videos

### 🛠️ **Complete Infrastructure**
- **Docker Compose** setup for Sorry Cypress
- **Automated orchestration scripts**
- **Custom Cypress commands** for parallel testing
- **CI/CD integration examples**

---

## ⚡ Quick Start

Get running in **5 minutes**:

### 1. Start Sorry Cypress Backend
```bash
# From repository root
docker-compose -f docker-compose.full.yml up -d
```

### 2. Install Dependencies
```bash
cd examples/parallel-instances/cypress-example
npm install
```

### 3. Run Your First Parallel Test
```bash
# Test against example.org
CYPRESS_BASE_URL=https://example.org npx cypress-cloud \
  --spec "cypress/e2e/homepage.cy.js" \
  --parallel --record \
  --ci-build-id "my-first-test-$(date +%s)" \
  --tag "quick-start"
```

### 4. View Results
Open http://localhost:8080 and check your **scaleUI** project!

---

## 🔧 Detailed Setup

### Prerequisites
- **Docker & Docker Compose**
- **Node.js 16+** (tested with Node 18)
- **Git**

### Step 1: Clone and Start Sorry Cypress

```bash
git clone https://github.com/sorry-cypress/sorry-cypress
cd sorry-cypress

# Start all services (Director, API, Dashboard, MongoDB)
docker-compose -f docker-compose.full.yml up -d

# Verify services are running
docker-compose -f docker-compose.full.yml ps
```

**Services available:**
- 📊 **Dashboard**: http://localhost:8080
- 🎯 **Director**: http://localhost:1234  
- 🔌 **API**: http://localhost:4000

### Step 2: Set Up the Parallel Testing Project

```bash
cd examples/parallel-instances/cypress-example
npm install
```

### Step 3: Configure Your Instances

Edit `../instances.json`:
```json
{
  "instances": [
    {
      "name": "production",
      "url": "https://your-prod-site.com",
      "enabled": true,
      "description": "Production environment"
    },
    {
      "name": "staging", 
      "url": "https://your-staging-site.com",
      "enabled": true,
      "description": "Staging environment"
    }
  ]
}
```

### Step 4: Create Your Sorry Cypress Project

1. Open http://localhost:8080
2. Create a new project (e.g., "myProject")
3. Note the project ID for configuration

---

## 🚀 Running Parallel Tests

### Method 1: Individual Test Runs

```bash
# Single instance test
CYPRESS_BASE_URL=https://example.org npx cypress-cloud \
  --spec "cypress/e2e/homepage.cy.js" \
  --parallel --record \
  --ci-build-id "test-$(date +%s)" \
  --tag "single-instance"
```

### Method 2: Multiple Parallel Instances

```bash
# Terminal 1 - Production
CYPRESS_BASE_URL=https://prod.example.com npx cypress-cloud \
  --spec "cypress/e2e/homepage.cy.js" \
  --parallel --record \
  --ci-build-id "parallel-demo-123" \
  --tag "production" &

# Terminal 2 - Staging  
CYPRESS_BASE_URL=https://staging.example.com npx cypress-cloud \
  --spec "cypress/e2e/homepage.cy.js" \
  --parallel --record \
  --ci-build-id "parallel-demo-123" \
  --tag "staging" &

# Wait for both to complete
wait
```

### Method 3: Automated Script (Recommended)

```bash
cd examples/parallel-instances
chmod +x run-parallel.sh

# Run all enabled instances
./run-parallel.sh

# Run specific instances
./run-parallel.sh production staging

# Full test suite per instance
MODE=full ./run-parallel.sh
```

### Method 4: Docker Compose

```bash
BUILD_ID=$(date +%s) docker-compose -f docker-compose.parallel.yml up
```

---

## 📊 Dashboard & Results

### Viewing Results

1. **Open Dashboard**: http://localhost:8080
2. **Find Your Project**: Look for your project (e.g., "scaleUI")
3. **Browse Test Runs**: Click on build IDs to see detailed results
4. **Filter by Tags**: Use instance tags to filter results

### What You'll See

- ✅ **Test Results**: Pass/fail status for each spec
- 📸 **Screenshots**: Organized by instance name
- 🎥 **Videos**: Test execution recordings  
- 📊 **Performance Metrics**: Load times and durations
- 🏷️ **Tags**: Instance identification
- 📈 **Trends**: Historical test performance

### Result Organization

**Same Build ID (Distributed Mode)**:
```
Build: parallel-demo-123
├── Spec 1 → Instance A
├── Spec 2 → Instance B  
├── Spec 3 → Instance A
└── Spec 4 → Instance B
```

**Different Build IDs (Full Mode)**:
```
Build: demo-123-production (5 specs)
Build: demo-123-staging (5 specs)
```

---

## ⚙️ Configuration

### Project Configuration Files

#### `currents.config.js` (Required)
```javascript
module.exports = {
  projectId: "your-project-id",
  recordKey: "any-key", 
  cloudServiceUrl: "http://localhost:1234"
};
```

#### `cypress.config.js` (Updated for cypress-cloud)
```javascript
const { defineConfig } = require('cypress');
const { cloudPlugin } = require("cypress-cloud/plugin");

module.exports = defineConfig({
  projectId: 'your-project-id',
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // Add cypress-cloud plugin
      return cloudPlugin(on, config);
    },
    // Your other configuration...
  },
});
```

#### `package.json` Dependencies
```json
{
  "devDependencies": {
    "cypress": "^13.17.0",
    "cypress-cloud": "^1.9.0"
  },
  "scripts": {
    "cypress:run:cloud": "npx cypress-cloud run --parallel --record"
  }
}
```

### Instance Configuration

#### `instances.json`
```json
{
  "instances": [
    {
      "name": "production",
      "url": "https://prod.example.com", 
      "enabled": true,
      "description": "Production environment"
    },
    {
      "name": "staging",
      "url": "https://staging.example.com",
      "enabled": true, 
      "description": "Staging environment"
    },
    {
      "name": "development",
      "url": "https://dev.example.com",
      "enabled": false,
      "description": "Development environment"
    }
  ]
}
```

### Environment Variables

```bash
# Core configuration
CYPRESS_BASE_URL=https://your-site.com
CYPRESS_API_URL=http://localhost:1234

# Test execution options  
CI_BUILD_ID=your-build-id
MODE=distributed  # or 'full'

# Optional overrides
INSTANCES_FILE=instances.json
DIRECTOR_URL=http://localhost:1234
```

### Custom Cypress Commands

The project includes these custom commands for parallel testing:

```javascript
// Log current instance
cy.logInstance();

// Check if testing specific instance  
if (cy.isInstance('production')) {
  // Production-specific test logic
}

// Visit with retry logic
cy.visitWithRetry('/', { retries: 3, retryDelay: 2000 });

// Get instance-specific test data
const username = cy.getTestData('username');

// Screenshot with instance name prefix
cy.screenshotWithInstance('login-error');
```

---

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### ❌ Tests not appearing in dashboard

**Symptoms**: No test runs visible in Sorry Cypress dashboard

**Solutions**:
```bash
# 1. Verify all services are running
docker-compose -f docker-compose.full.yml ps

# 2. Check Director accessibility
curl http://localhost:1234

# 3. Verify currents.config.js exists with correct URL
cat currents.config.js

# 4. Ensure cypress-cloud plugin is loaded
grep "cloudPlugin" cypress.config.js
```

#### ❌ "Cannot find module 'cypress-cloud/plugin'"

**Symptoms**: Plugin import error

**Solutions**:
```bash
# 1. Install cypress-cloud
npm install cypress-cloud --save-dev

# 2. Verify installation
npm list cypress-cloud

# 3. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Tests run but don't connect to Sorry Cypress

**Symptoms**: Tests execute locally but no dashboard data

**Solutions**:
```bash
# 1. Use debug mode
npx cypress-cloud --cloud-debug true

# 2. Check currents.config.js cloudServiceUrl
# Should be: "http://localhost:1234"

# 3. Verify projectId matches dashboard project
```

#### ❌ Performance issues with many parallel instances

**Symptoms**: Slow execution, system lag

**Solutions**:
```bash
# 1. Monitor resources
docker stats

# 2. Reduce parallel instances
# Edit instances.json to disable some instances

# 3. Adjust Docker memory limits
# In docker-compose.yml:
services:
  director:
    mem_limit: 512m
```

### Debug Commands

```bash
# Enable detailed logging
DEBUG=cypress:server:* npx cypress-cloud --cloud-debug all

# Check Sorry Cypress logs
docker-compose -f docker-compose.full.yml logs director

# Test Director API directly
curl -X POST http://localhost:1234/runs \
  -H "Content-Type: application/json" \
  -d '{"projectId":"test","spec":"test.js"}'

# Verify network connectivity
curl -v http://localhost:1234
curl -v http://localhost:8080
```

### Getting Help

If you're still having issues:

1. **Check the logs** with debug mode enabled
2. **Verify configuration files** match the examples
3. **Test with a single instance** first
4. **Review the Memory Bank** for detailed troubleshooting: `MEMORY_BANK.md`

---

## 📈 Use Cases

### 1. Multi-Environment Testing
Test the same functionality across production, staging, and development simultaneously:

```bash
# All environments with same build ID (distributed tests)
BUILD_ID=env-test-$(date +%s)
CYPRESS_BASE_URL=https://prod.com npx cypress-cloud --ci-build-id $BUILD_ID --tag prod &
CYPRESS_BASE_URL=https://staging.com npx cypress-cloud --ci-build-id $BUILD_ID --tag staging &
CYPRESS_BASE_URL=https://dev.com npx cypress-cloud --ci-build-id $BUILD_ID --tag dev &
wait
```

### 2. Multi-Tenant Applications
Test different customer instances or tenant environments:

```bash
# Customer-specific testing
CYPRESS_BASE_URL=https://customer1.app.com npx cypress-cloud --tag customer1 &
CYPRESS_BASE_URL=https://customer2.app.com npx cypress-cloud --tag customer2 &
```

### 3. Regional Testing  
Test different geographic deployments:

```bash
# Regional deployment testing
CYPRESS_BASE_URL=https://us.app.com npx cypress-cloud --tag us-east &
CYPRESS_BASE_URL=https://eu.app.com npx cypress-cloud --tag europe &
CYPRESS_BASE_URL=https://asia.app.com npx cypress-cloud --tag asia-pacific &
```

### 4. Performance Comparison
Compare load times and performance across infrastructure:

```javascript
// In your tests - performance.cy.js
describe('Performance Comparison', () => {
  it('should measure and compare load times', () => {
    const startTime = Date.now();
    cy.visit('/');
    cy.window().then(() => {
      const loadTime = Date.now() - startTime;
      cy.log(`${Cypress.config('baseUrl')} load time: ${loadTime}ms`);
    });
  });
});
```

### 5. CI/CD Integration

#### GitHub Actions
```yaml
name: Parallel Cypress Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        instance:
          - { name: prod, url: "https://prod.com" }
          - { name: staging, url: "https://staging.com" }
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: |
          CYPRESS_BASE_URL=${{ matrix.instance.url }} \
          npx cypress-cloud --parallel --record \
          --ci-build-id ${{ github.run_id }} \
          --tag ${{ matrix.instance.name }}
```

#### GitLab CI
```yaml  
.cypress_base:
  image: cypress/included:13.17.0
  script:
    - cd examples/parallel-instances/cypress-example
    - npm ci
    - npx cypress-cloud --parallel --record --ci-build-id $CI_PIPELINE_ID

test:production:
  extends: .cypress_base
  variables:
    CYPRESS_BASE_URL: "https://prod.com"
  parallel: 3

test:staging:
  extends: .cypress_base  
  variables:
    CYPRESS_BASE_URL: "https://staging.com"
  parallel: 3
```

---

## 🤝 Contributing

### Project Structure
```
examples/parallel-instances/
├── README.md                     # This file
├── MEMORY_BANK.md                # Comprehensive technical documentation
├── QUICKSTART.md                 # 5-minute quick start guide
├── instances.json                # Instance configuration
├── run-parallel.sh              # Orchestration script
├── docker-compose.parallel.yml  # Docker orchestration
└── cypress-example/             # Complete Cypress project
    ├── cypress.config.js
    ├── currents.config.js
    ├── package.json
    └── cypress/
        ├── e2e/                 # Test suites
        └── support/             # Custom commands
```

### Adding New Features

1. **Fork the repository**
2. **Create a feature branch**
3. **Add your enhancements**
4. **Update documentation**
5. **Test with multiple instances**
6. **Submit a pull request**

### Example Contributions

- **New test suites** for different scenarios
- **Additional CI/CD integrations** (Jenkins, CircleCI)
- **Cloud deployment** configurations
- **Performance optimizations**
- **Custom reporting** integrations

---

## 📚 Additional Resources

- **[Sorry Cypress Documentation](https://docs.sorry-cypress.dev)** - Official Sorry Cypress docs
- **[cypress-cloud Repository](https://github.com/currents-dev/cypress-cloud)** - Modern integration package
- **[Cypress Documentation](https://docs.cypress.io)** - Official Cypress docs  
- **[MEMORY_BANK.md](MEMORY_BANK.md)** - Comprehensive technical details
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide

---

## 🎯 Key Achievements

✅ **Modern Cypress Integration** - Successfully integrated Cypress 13.17.0 with Sorry Cypress  
✅ **No Record Key Issues** - Completely bypassed validation problems using cypress-cloud  
✅ **Parallel Test Distribution** - Tests automatically distributed across multiple instances  
✅ **Centralized Dashboard** - All results visible in self-hosted Sorry Cypress dashboard  
✅ **Instance-Specific Testing** - Custom test data and assertions per environment  
✅ **Production Ready** - Complete CI/CD integration examples included  

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Sorry Cypress Team** - For the excellent self-hosted dashboard solution
- **cypress-cloud Contributors** - For solving the modern Cypress integration challenge  
- **Cypress Team** - For the outstanding testing framework
- **Community Contributors** - For sharing solutions and best practices

---

**🚀 Happy Testing!** 

*Transform your testing workflow with parallel execution across multiple instances.*
