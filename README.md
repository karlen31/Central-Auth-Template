# Auth Service

A modern authentication service with UI built using Node.js, React, and Kubernetes.

## Repository Structure

```
.
├── src/
│   ├── service/         # Backend authentication service
│   │   ├── Dockerfile
│   │   └── ...
│   └── ui/             # Frontend React application
│       ├── Dockerfile
│       ├── build-and-push.sh
│       └── ...
├── k8s/                # Kubernetes configuration files
├── docs/               # Documentation and tutorials
├── scripts/            # Utility scripts
└── docker-compose.yml  # Local development setup
```

## Prerequisites

- Node.js 20 or later
- Docker and Docker Compose
- Kubernetes cluster (for production deployment)
- Google Cloud SDK (for GKE deployment)

## Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd auth-service
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Start the development environment:
   ```bash
   docker-compose up
   ```

The services will be available at:
- UI: http://localhost:3001
- API: http://localhost:3000

## Production Deployment

For production deployment instructions, see [docs/tutorials/github-actions-gke-deployment.md](docs/tutorials/github-actions-gke-deployment.md).

## Building and Pushing Images

To build and push the UI image:
```bash
cd src/ui
./build-and-push.sh
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT 