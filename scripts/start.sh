#!/bin/bash

# Use Node.js version 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use 20

# Install dependencies if node_modules doesn't exist
if [ ! -d "./src/ui/node_modules" ]; then
  echo "Installing UI dependencies..."
  cd ./src/ui && npm install
  cd ../..
fi

if [ ! -d "./src/service/node_modules" ]; then
  echo "Installing Service dependencies..."
  cd ./src/service && npm install
  cd ../..
fi

# Install concurrently if it's not installed
if ! npm list -g concurrently > /dev/null 2>&1; then
  echo "Installing concurrently..."
  npm install -g concurrently
fi

# Start the application
echo "Starting Auth Service..."
concurrently "cd ./src/ui && npm run dev" "cd ./src/service && npm run dev" 