# 🚀 Parallel Instance Testing with Sorry Cypress

> **Complete setup for running Cypress tests in parallel against multiple website instances**

## 📖 Documentation Quick Links

| Document | Purpose | Time Required |
|----------|---------|---------------|
| **[QUICKSTART.md](QUICKSTART.md)** | Get running in 5 minutes | ⏱️ 5 min |
| **[README.md](README.md)** | Complete documentation | 📚 15 min |
| **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** | Post-setup guide & next steps | 📋 5 min |

## 🎯 What This Does

This example demonstrates how to run Cypress end-to-end tests **in parallel** across **multiple website instances** (e.g., production, staging, different environments) using **Sorry Cypress** as the orchestration layer.

### Key Features

- ✅ **Parallel Execution** - Run tests simultaneously across multiple instances
- ✅ **Test Distribution** - Distribute test specs across runners for faster completion
- ✅ **Instance-Specific Testing** - Custom test data and assertions per environment
- ✅ **Centralized Dashboard** - View all results in one place
- ✅ **Self-Hosted** - Behind your firewall, no external dependencies
- ✅ **CI/CD Ready** - GitHub Actions and GitLab CI examples included

## 📁 Project Structure

```
parallel-instances/
├── 📄 INDEX.md                          ← You are here
├── 📄 QUICKSTART.md                     ← Start here!
├── 📄 README.md                         ← Full documentation
├── 📄 SETUP_COMPLETE.md                 ← Post-setup guide
│
├── ⚙️  instances.json                    ← Define your test instances
├── 🐳 docker-compose.parallel.yml       ← Docker orchestration
├── 🔧 run-parallel.sh                   ← Automated execution script
├── 📝 config.template.sh                ← Environment variables template
│
├── 💼 CI/CD Examples
│   ├── .github-workflows-example.yml   ← GitHub Actions
│   └── .gitlab-ci-example.yml          ← GitLab CI
│
└── 📦 cypress-example/                  ← Complete Cypress project
    ├── cypress.config.js
    ├── package.json
    ├── .gitignore
    └── cypress/
        ├── e2e/
        │   ├── homepage.cy.js           ← Basic homepage tests
        │   ├── navigation.cy.js         ← Navigation tests
        │   ├── instance-specific.cy.js  ← Environment-specific tests
        │   └── performance.cy.js        ← Performance tests
        └── support/
            ├── e2e.js                   ← Global configuration
            └── commands.js              ← Custom commands
```

## 🚦 Getting Started

### Option 1: Quick Start (Recommended)

Follow the **[QUICKSTART.md](QUICKSTART.md)** guide - 5 minutes to running tests!

```bash
# 1. Start Sorry Cypress
docker-compose -f ../../docker-compose.full.yml up -d

# 2. Install dependencies
cd cypress-example && npm install && cd ..

# 3. Run tests
chmod +x run-parallel.sh
./run-parallel.sh

# 4. View results
open http://localhost:8080
```

### Option 2: Docker Compose

```bash
BUILD_ID=$(date +%s) docker-compose -f docker-compose.parallel.yml up
```

### Option 3: Manual Control

```bash
# Terminal 1
CYPRESS_BASE_URL=https://instance1.com \
CYPRESS_API_URL=http://localhost:1234 \
npx cypress run --parallel --record --ci-build-id build-123

# Terminal 2
CYPRESS_BASE_URL=https://instance2.com \
CYPRESS_API_URL=http://localhost:1234 \
npx cypress run --parallel --record --ci-build-id build-123
```

## 🎓 How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Sorry Cypress                        │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐            │
│  │ Director │  │   API    │  │ Dashboard │            │
│  │  :1234   │  │  :4000   │  │   :8080   │            │
│  └──────────┘  └──────────┘  └───────────┘            │
└────────────┬───────────────────────────────────────────┘
             │ Orchestrates test distribution
             │
     ┌───────┴──────┬──────────┬──────────┐
     │              │          │          │
┌────▼────┐   ┌────▼────┐ ┌──▼─────┐ ┌──▼─────┐
│ Cypress │   │ Cypress │ │Cypress │ │Cypress │
│Instance1│   │Instance2│ │Instance3│ │Instance4│
└─────────┘   └─────────┘ └────────┘ └────────┘
     │              │          │          │
     ▼              ▼          ▼          ▼
  prod.com    staging.com   dev.com   scale.com
```

### Test Distribution Modes

#### Mode 1: Distributed (Default)
```bash
./run-parallel.sh
```
- All runners share the **same** build ID
- Sorry Cypress **distributes test specs** across all runners
- Faster completion time
- Example: If you have 12 test files and 4 instances, each instance runs ~3 tests

#### Mode 2: Full Coverage
```bash
MODE=full ./run-parallel.sh
```
- Each runner uses a **different** build ID
- Each instance runs the **complete** test suite
- Comprehensive coverage per environment
- Example: If you have 12 test files and 4 instances, each instance runs all 12 tests

## 📊 What You Get

### Dashboard Features
- ✅ All test runs in one view
- ✅ Filter by instance (using tags)
- ✅ Test duration and performance metrics
- ✅ Screenshots and video recordings
- ✅ Test history and trends

### Custom Cypress Commands

| Command | Purpose |
|---------|---------|
| `cy.logInstance()` | Log the current instance URL |
| `cy.isInstance(name)` | Check if testing a specific instance |
| `cy.visitWithRetry(url, opts)` | Visit with automatic retry logic |
| `cy.getTestData(key)` | Get instance-specific test data |
| `cy.screenshotWithInstance(name)` | Screenshot with instance name prefix |

### Example Test Structure

```javascript
describe('Homepage Tests', () => {
  it('should load successfully', () => {
    cy.logInstance()  // Logs: "Current instance: https://prod.example.com"
    cy.visit('/')
    cy.get('body').should('be.visible')
  })
  
  it('should use instance-specific data', () => {
    const username = cy.getTestData('username')
    // Returns different username per instance
  })
})
```

## 🔧 Configuration

### instances.json
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
      "name": "scale-computing",
      "url": "https://10.100.24.31:443",
      "enabled": true,
      "description": "Scale Computing node"
    }
  ]
}
```

## 📈 Use Cases

### 1. Multi-Environment Testing
Test the same functionality across production, staging, and development environments simultaneously.

### 2. Multi-Tenant Applications
Test different customer instances or tenant environments in parallel.

### 3. Regional Testing
Test different regional deployments (US, EU, APAC) at the same time.

### 4. A/B Testing Validation
Verify both variants of an A/B test simultaneously.

### 5. Performance Comparison
Compare load times and performance across different infrastructure setups.

### 6. Compliance Testing
Run compliance tests across multiple regulated environments.

## 🎯 Next Steps

1. **Read** → [QUICKSTART.md](QUICKSTART.md) (5 min)
2. **Run** → `./run-parallel.sh`
3. **View** → http://localhost:8080
4. **Customize** → Edit tests in `cypress-example/cypress/e2e/`
5. **Deploy** → Set up CI/CD using examples provided

## 💡 Pro Tips

- Start with 2-3 instances to understand the workflow
- Use the `--tag` flag to easily filter results per instance
- Monitor system resources when running many parallel instances
- Set up webhooks for Slack/GitHub notifications
- Clean up old test videos/screenshots periodically

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests not appearing in dashboard | Verify Sorry Cypress is running: `docker-compose ps` |
| Connection refused | Check Director URL is accessible: `curl http://localhost:1234` |
| Tests failing on specific instance | Check instance URL is correct in `instances.json` |
| Out of memory | Reduce number of parallel instances or increase Docker memory |

## 📚 Additional Resources

- **Sorry Cypress Documentation**: https://docs.sorry-cypress.dev
- **Cypress Documentation**: https://docs.cypress.io
- **Cypress Parallelization**: https://docs.cypress.io/guides/guides/parallelization
- **Docker Compose**: https://docs.docker.com/compose/

## 🤝 Support

- Check the [README.md](README.md) for detailed documentation
- Review example tests for implementation patterns
- Visit Sorry Cypress Slack: https://sorry-cypress.slack.com

---

## 🚀 Ready to Start?

**Follow the [QUICKSTART.md](QUICKSTART.md) guide now!**

```bash
cd examples/parallel-instances
cat QUICKSTART.md
```
