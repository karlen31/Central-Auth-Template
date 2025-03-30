#!/bin/bash

# Stop and remove existing containers
docker compose down

# Build and start the services
docker compose up --build -d

echo "Auth service is starting in Docker containers..."
echo "UI will be available at: http://localhost:3000"
echo "API will be available at: http://localhost:5001"
echo "MongoDB is available at: mongodb://localhost:27017"
echo ""
echo "To view logs, run: docker compose logs -f"
echo "To stop services, run: docker compose down" 