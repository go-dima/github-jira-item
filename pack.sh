#!/bin/bash

# Default values
CLONE=false
ORG_NAME=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --clone)
            CLONE=true
            shift
            ;;
        *)
            ORG_NAME=$1
            shift
            ;;
    esac
done

# Check if organization parameter is provided
if [ -z "$ORG_NAME" ]; then
    echo "Usage: $0 [--clone] <organization-name>"
    echo "Example: $0 mycompany (creates JIRA_URL=https://mycompany.atlassian.net)"
    exit 1
fi

# Clone the repository if flag is set
if [ "$CLONE" = true ]; then
    git clone https://github.com/go-dima/github-jira-item.git
    cd github-jira-item || exit
fi

# Install the dependencies
npm install

# Create .env file with organization URL
echo "JIRA_URL=https://$ORG_NAME.atlassian.net" > .env

# Build
npm run build

# Chrome -> Extensions
#   - Enable developer mode
#   - Load unpacked -> Choose the dist folder