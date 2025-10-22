#!/bin/bash

# Script to update all API endpoint references to use the apiEndpoint utility
# Run from the frontend directory

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Updating API endpoint references in all files...${NC}"

# First, ensure all files that need the import have it
grep -l "http://localhost:3000" $(find src -type f -name "*.tsx" -o -name "*.ts") | xargs -I{} sed -i '' '1s/^/import { apiEndpoint } from "@\/lib\/api-config";\n/' {}

echo -e "${GREEN}Added import statements to relevant files${NC}"

# Now replace all endpoint URLs with apiEndpoint function calls
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|"http://localhost:3000/\([^"]*\)"|apiEndpoint("/\1")|g' {} \;
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' "s|'http://localhost:3000/\([^']*\)'|apiEndpoint('/\1')|g" {} \;

echo -e "${GREEN}Replaced hardcoded URLs with apiEndpoint() function calls${NC}"

# Handle Socket.io connections
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|io("http://localhost:3000"|io(getSocketUrl()|g' {} \;

echo -e "${GREEN}Updated Socket.io connections to use getSocketUrl()${NC}"

echo -e "${YELLOW}Script completed. Please review the changes manually to ensure correctness.${NC}"