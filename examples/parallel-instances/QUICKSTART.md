# Quick Start Guide

Get up and running with parallel Cypress tests in 5 minutes!

## Step 1: Start Sorry Cypress (2 minutes)

From the root of the sorry-cypress repository:

```bash
docker-compose -f docker-compose.full.yml up -d
```

Wait for all services to start. Verify they're running:

```bash
docker-compose -f docker-compose.full.yml ps
```

You should see:
- `director` running on port 1234
- `api` running on port 4000
- `dashboard` running on port 8080
- `mongo` running on port 27017

Open the dashboard in your browser: http://localhost:8080

## Step 2: Configure Your Instances (1 minute)

Navigate to the examples directory:

```bash
cd examples/parallel-instances
```

Edit `instances.json` and update the URLs for your instances:

```json
{
  "instances": [
    {
      "name": "production",
      "url": "https://your-prod-url.com",
      "enabled": true
    },
    {
      "name": "staging",
      "url": "https://your-staging-url.com",
      "enabled": true
    }
  ]
}
```

## Step 3: Install Dependencies (1 minute)

```bash
cd cypress-example
npm install
cd ..
```

## Step 4: Run Your Tests! (1 minute)

Make the script executable:

```bash
chmod +x run-parallel.sh
```

Run tests against all enabled instances:

```bash
./run-parallel.sh
```

Or run against specific instances:

```bash
./run-parallel.sh production staging
```

## Step 5: View Results

Open the Sorry Cypress dashboard: http://localhost:8080

You'll see:
- All your test runs grouped by build ID
- Individual test results per instance (tagged)
- Screenshots and videos (if enabled)
- Test duration and performance metrics

## Advanced Options

### Run in Full Mode (Each Instance Runs All Tests)

```bash
MODE=full ./run-parallel.sh
```

### Use a Custom Build ID

```bash
BUILD_ID=my-test-run-123 ./run-parallel.sh
```

### Use Docker Compose Instead

```bash
BUILD_ID=$(date +%s) docker-compose -f docker-compose.parallel.yml up
```

## Troubleshooting

### "Cannot connect to Sorry Cypress"

Make sure Sorry Cypress is running:

```bash
cd ../../  # Back to repo root
docker-compose -f docker-compose.full.yml up -d
```

### "cypress-example directory not found"

Make sure you're in the `examples/parallel-instances` directory.

### Tests Not Showing in Dashboard

1. Check the director is accessible: `curl http://localhost:1234`
2. Verify your `cypress.config.js` has the correct `projectId`
3. Ensure you're using `--parallel --record` flags

### Connection Timeout Errors

If testing instances behind a firewall or VPN:
1. Make sure you're connected to the network
2. Verify the URLs in `instances.json` are accessible
3. Try increasing timeouts in `cypress.config.js`

## Next Steps

1. Customize the example tests in `cypress-example/cypress/e2e/`
2. Add your own test data in the `commands.js` file
3. Configure CI/CD integration (see README.md)
4. Set up webhooks for Slack/GitHub notifications

## Need Help?

- Full documentation: See `README.md`
- Sorry Cypress docs: https://docs.sorry-cypress.dev
- Cypress docs: https://docs.cypress.io
