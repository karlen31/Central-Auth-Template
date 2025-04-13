#!/bin/bash

# Exit on any error
set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Error handler
handle_error() {
    log "Error occurred in build script on line $1"
    exit 1
}

trap 'handle_error $LINENO' ERR

# Set variables
REGISTRY="us-central1-docker.pkg.dev/template-1743820446385/docker-registry"
IMAGE_NAME="auth-ui"
TAG="latest"
FULL_IMAGE_NAME="$REGISTRY/$IMAGE_NAME:$TAG"

# Switch to Node.js 20
if command -v nvm &> /dev/null; then
    log "Switching to Node.js 20"
    nvm use 20
else
    log "Warning: nvm not found. Please ensure Node.js 20 is installed globally"
fi

# Enable Docker BuildKit
export DOCKER_BUILDKIT=1

log "Creating multi-architecture builder..."
# Create and use a new builder instance with multi-architecture support
docker buildx create --use --name multi-arch-builder || true

log "Building and pushing image: $FULL_IMAGE_NAME"
# Build and push multi-architecture image
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag $FULL_IMAGE_NAME \
  --push \
  .

log "Build and push completed successfully" 