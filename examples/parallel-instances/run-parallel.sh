#!/bin/bash

# Orchestration script for running Cypress tests in parallel against multiple instances
# Usage:
#   ./run-parallel.sh                    # Run all enabled instances
#   ./run-parallel.sh instance1 instance2  # Run specific instances
#   BUILD_ID=custom-123 ./run-parallel.sh # Use custom build ID

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INSTANCES_FILE="${INSTANCES_FILE:-instances.json}"
BUILD_ID="${BUILD_ID:-build-$(date +%s)}"
DIRECTOR_URL="${DIRECTOR_URL:-http://localhost:1234}"
PROJECT_ID="${PROJECT_ID:-my-parallel-project}"
CYPRESS_VERSION="${CYPRESS_VERSION:-12.17.0}"
MODE="${MODE:-distributed}" # distributed or full

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Sorry Cypress is running
check_sorry_cypress() {
    print_info "Checking if Sorry Cypress is running..."
    if curl -s "$DIRECTOR_URL" > /dev/null 2>&1; then
        print_success "Sorry Cypress Director is accessible at $DIRECTOR_URL"
    else
        print_error "Cannot connect to Sorry Cypress Director at $DIRECTOR_URL"
        print_info "Start Sorry Cypress with: docker-compose -f ../../docker-compose.full.yml up -d"
        exit 1
    fi
}

# Load instances from JSON file
load_instances() {
    if [ ! -f "$INSTANCES_FILE" ]; then
        print_error "Instances file not found: $INSTANCES_FILE"
        exit 1
    fi
    
    # Parse JSON and get enabled instances
    if [ $# -eq 0 ]; then
        # No arguments provided, use all enabled instances
        INSTANCES=$(jq -r '.instances[] | select(.enabled == true) | .name' "$INSTANCES_FILE")
    else
        # Use specified instances
        INSTANCES="$@"
    fi
    
    if [ -z "$INSTANCES" ]; then
        print_error "No instances to run"
        exit 1
    fi
    
    print_success "Loaded instances: $(echo $INSTANCES | tr '\n' ' ')"
}

# Get instance URL from name
get_instance_url() {
    local name=$1
    jq -r ".instances[] | select(.name == \"$name\") | .url" "$INSTANCES_FILE"
}

# Run Cypress for a single instance
run_instance() {
    local instance_name=$1
    local instance_url=$(get_instance_url "$instance_name")
    
    if [ -z "$instance_url" ]; then
        print_error "Instance not found: $instance_name"
        return 1
    fi
    
    print_info "Starting Cypress for $instance_name at $instance_url"
    
    # Determine build ID based on mode
    local instance_build_id="$BUILD_ID"
    if [ "$MODE" = "full" ]; then
        instance_build_id="${BUILD_ID}-${instance_name}"
    fi
    
    # Run Cypress
    CYPRESS_BASE_URL="$instance_url" \
    CYPRESS_API_URL="$DIRECTOR_URL" \
    npx cypress run \
        --parallel \
        --record \
        --key any-key \
        --ci-build-id "$instance_build_id" \
        --tag "$instance_name" \
        --config projectId="$PROJECT_ID" &
    
    # Store PID
    local pid=$!
    echo "$pid" >> /tmp/cypress-pids-$$
    print_success "Started Cypress for $instance_name (PID: $pid)"
}

# Wait for all processes to complete
wait_for_completion() {
    if [ ! -f /tmp/cypress-pids-$$ ]; then
        print_error "No Cypress processes found"
        return 1
    fi
    
    print_info "Waiting for all Cypress processes to complete..."
    
    local failed=0
    while read pid; do
        if wait $pid; then
            print_success "Process $pid completed successfully"
        else
            print_error "Process $pid failed"
            failed=$((failed + 1))
        fi
    done < /tmp/cypress-pids-$$
    
    rm -f /tmp/cypress-pids-$$
    
    if [ $failed -gt 0 ]; then
        print_error "$failed process(es) failed"
        return 1
    else
        print_success "All processes completed successfully!"
        return 0
    fi
}

# Cleanup function
cleanup() {
    print_info "Cleaning up..."
    if [ -f /tmp/cypress-pids-$$ ]; then
        while read pid; do
            kill $pid 2>/dev/null || true
        done < /tmp/cypress-pids-$$
        rm -f /tmp/cypress-pids-$$
    fi
}

# Trap cleanup on exit
trap cleanup EXIT INT TERM

# Main execution
main() {
    echo ""
    print_info "=== Cypress Parallel Instance Runner ==="
    print_info "Build ID: $BUILD_ID"
    print_info "Mode: $MODE (distributed = share tests, full = all tests per instance)"
    print_info "Director URL: $DIRECTOR_URL"
    echo ""
    
    # Check prerequisites
    check_sorry_cypress
    
    # Check if cypress-example directory exists
    if [ ! -d "cypress-example" ]; then
        print_error "cypress-example directory not found"
        print_info "Please create a Cypress project in the cypress-example directory"
        exit 1
    fi
    
    # Change to cypress-example directory
    cd cypress-example
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_info "Installing dependencies..."
        npm install
    fi
    
    # Load and validate instances
    cd ..
    load_instances "$@"
    cd cypress-example
    
    # Run instances in parallel
    for instance in $INSTANCES; do
        run_instance "$instance"
        sleep 1 # Small delay between starts
    done
    
    # Wait for completion
    cd ..
    if wait_for_completion; then
        echo ""
        print_success "=== All tests completed successfully! ==="
        print_info "View results at: http://localhost:8080"
        exit 0
    else
        echo ""
        print_error "=== Some tests failed ==="
        print_info "View results at: http://localhost:8080"
        exit 1
    fi
}

# Run main function
main "$@"
