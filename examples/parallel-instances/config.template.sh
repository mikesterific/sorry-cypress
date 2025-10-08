#!/bin/bash

# Configuration Template for Parallel Instance Testing
# Copy this file to config.sh and customize for your environment
# cp config.template.sh config.sh

# Sorry Cypress Configuration
export DIRECTOR_URL="http://localhost:1234"
export API_URL="http://localhost:4000"
export DASHBOARD_URL="http://localhost:8080"

# Cypress Configuration
export CYPRESS_PROJECT_ID="my-parallel-project"
export CYPRESS_RECORD_KEY="any-key"

# Test Execution Mode
# Options: distributed (share tests across instances) or full (all tests per instance)
export MODE="distributed"

# Build ID (leave empty to auto-generate)
export BUILD_ID=""

# Instance Configuration File
export INSTANCES_FILE="instances.json"

# Optional: Override specific instance URLs
# export INSTANCE_PRODUCTION_URL="https://prod.example.com"
# export INSTANCE_STAGING_URL="https://staging.example.com"

# Optional: Cypress version for Docker
export CYPRESS_VERSION="12.17.0"

echo "Configuration loaded!"
echo "Director URL: $DIRECTOR_URL"
echo "Mode: $MODE"
