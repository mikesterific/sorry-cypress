# Running Cypress Tests in Parallel Against Different Instances

This example demonstrates how to run Cypress tests in parallel against multiple website instances using Sorry Cypress.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 16+ installed
- Your Cypress tests ready to run

## Quick Start

### Step 1: Start Sorry Cypress

```bash
# From the root of sorry-cypress repository
docker-compose -f docker-compose.full.yml up -d
```

This will start:
- **Director** at `http://localhost:1234` - Orchestrates test distribution
- **API** at `http://localhost:4000` - GraphQL API
- **Dashboard** at `http://localhost:8080` - Web UI for viewing results
- **MongoDB** - Data storage

### Step 2: Configure Your Cypress Project

Navigate to your Cypress project and update `cypress.config.js`:

```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'my-parallel-project', // Unique identifier
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
```

### Step 3: Run Tests Against Different Instances

#### Option A: Using Environment Variables (Simple)

Run these commands in separate terminals:

```bash
# Terminal 1 - Instance 1
CYPRESS_BASE_URL=https://instance1.example.com \
CYPRESS_API_URL=http://localhost:1234 \
npx cypress run --parallel --record --key any-key --ci-build-id build-$(date +%s)

# Terminal 2 - Instance 2
CYPRESS_BASE_URL=https://instance2.example.com \
CYPRESS_API_URL=http://localhost:1234 \
npx cypress run --parallel --record --key any-key --ci-build-id build-$(date +%s)
```

#### Option B: Using Docker Compose (Recommended)

Use the provided `docker-compose.parallel.yml`:

```bash
# From examples/parallel-instances directory
BUILD_ID=$(date +%s) docker-compose -f docker-compose.parallel.yml up
```

## Project Structure

```
examples/parallel-instances/
├── README.md                          # This file
├── docker-compose.parallel.yml        # Docker setup for parallel runs
├── run-parallel.sh                    # Orchestration script
├── cypress-example/                   # Example Cypress project
│   ├── cypress.config.js
│   ├── package.json
│   └── cypress/
│       ├── e2e/
│       │   └── example.cy.js
│       └── support/
│           ├── e2e.js
│           └── commands.js
└── instances.json                     # Configuration for instances
```

## Configuration Files

### instances.json

Define your test instances:

```json
{
  "instances": [
    {
      "name": "production",
      "url": "https://prod.example.com",
      "enabled": true
    },
    {
      "name": "staging",
      "url": "https://staging.example.com",
      "enabled": true
    },
    {
      "name": "development",
      "url": "https://dev.example.com",
      "enabled": false
    }
  ]
}
```

## Advanced Usage

### Test Distribution Modes

#### Mode 1: Distributed Specs (Same Build ID)

All runners share the same `ci-build-id`, so Sorry Cypress distributes **test specs** across all runners:

```bash
BUILD_ID=shared-123 CYPRESS_BASE_URL=https://instance1.example.com cypress run --parallel --record --ci-build-id shared-123
BUILD_ID=shared-123 CYPRESS_BASE_URL=https://instance2.example.com cypress run --parallel --record --ci-build-id shared-123
```

**Result**: Specs are distributed across all instances. Each instance runs different tests.

#### Mode 2: Full Test Suite Per Instance (Different Build IDs)

Each runner uses a different `ci-build-id`:

```bash
CYPRESS_BASE_URL=https://instance1.example.com cypress run --parallel --record --ci-build-id build-instance1
CYPRESS_BASE_URL=https://instance2.example.com cypress run --parallel --record --ci-build-id build-instance2
```

**Result**: Each instance runs the complete test suite.

### Using the Orchestration Script

The `run-parallel.sh` script automates parallel execution:

```bash
# Run all enabled instances
./run-parallel.sh

# Run specific instances
./run-parallel.sh production staging

# Run with custom build ID
BUILD_ID=custom-123 ./run-parallel.sh
```

## Viewing Results

1. Open the Sorry Cypress Dashboard: `http://localhost:8080`
2. Find your project by the `projectId` you configured
3. View test results, screenshots, and videos grouped by build ID

## Troubleshooting

### Tests Not Appearing in Dashboard

- Verify Sorry Cypress is running: `docker-compose -f docker-compose.full.yml ps`
- Check director URL: `CYPRESS_API_URL` should point to `http://localhost:1234`
- Ensure `--record` and `--parallel` flags are used

### Connection Refused Errors

- If running Cypress in Docker, use `http://host.docker.internal:1234` instead of `localhost`
- Update `docker-compose.parallel.yml` network settings

### Different Data Per Instance

Use environment-specific test data:

```javascript
// In your test files
const baseUrl = Cypress.config('baseUrl')
const testData = {
  'https://instance1.example.com': { username: 'user1' },
  'https://instance2.example.com': { username: 'user2' },
}[baseUrl]
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Parallel Cypress Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        instance:
          - https://instance1.example.com
          - https://instance2.example.com
          - https://instance3.example.com
    steps:
      - uses: actions/checkout@v3
      - name: Run Cypress
        env:
          CYPRESS_BASE_URL: ${{ matrix.instance }}
          CYPRESS_API_URL: http://sorry-cypress.internal:1234
        run: |
          npm ci
          npm run cypress:run
```

### GitLab CI Example

```yaml
test:
  parallel:
    matrix:
      - INSTANCE: https://instance1.example.com
      - INSTANCE: https://instance2.example.com
  script:
    - export CYPRESS_BASE_URL=$INSTANCE
    - export CYPRESS_API_URL=http://sorry-cypress:1234
    - npm ci
    - npm run cypress:run
```

## Best Practices

1. **Use Unique Build IDs**: Helps track and group test runs
2. **Resource Management**: Monitor system resources when running multiple containers
3. **Test Isolation**: Ensure tests don't have cross-instance dependencies
4. **Retry Logic**: Configure retry settings for flaky tests
5. **Cleanup**: Remove old test data periodically from MongoDB

## Resources

- [Sorry Cypress Documentation](https://docs.sorry-cypress.dev)
- [Cypress Parallelization](https://docs.cypress.io/guides/guides/parallelization)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
