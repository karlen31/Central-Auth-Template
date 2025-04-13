# Directory Structure Guide

## Main Directories
- `src/` - Main application code
  - `ui/` - Frontend React application
    - `src/` - React source code
    - `public/` - Static assets
    - `node_modules/` - Frontend dependencies
    - `package.json` - Frontend package configuration
    - `package-lock.json` - Frontend dependency lock file
    - `vite.config.ts` - Vite configuration
    - `tsconfig.json` - TypeScript base configuration
    - `tsconfig.app.json` - TypeScript application configuration
    - `tsconfig.node.json` - TypeScript node configuration
    - `eslint.config.js` - ESLint configuration
    - `index.html` - Entry HTML file
    - `.env` - Frontend environment variables
    - `nginx.conf` - Nginx server configuration
    - `Dockerfile` - Frontend container configuration
    - `build-and-push.sh` - Build and push script
    - `.gitignore` - Git ignore rules
    - `README.md` - Frontend documentation

  - `service/` - Backend service code
    - `controllers/` - Request handlers
    - `models/` - Data models
    - `routes/` - API route definitions
    - `middlewares/` - Express middlewares
    - `utils/` - Utility functions
    - `config/` - Configuration files
    - `dist/` - Compiled TypeScript output
    - `node_modules/` - Backend dependencies
    - `.vercel/` - Vercel deployment config
    - `index.ts` - Main application entry
    - `package.json` - Backend package configuration
    - `package-lock.json` - Backend dependency lock file
    - `tsconfig.json` - TypeScript configuration
    - `Dockerfile` - Backend container configuration
    - `.env` - Backend environment variables
    - `vercel.json` - Vercel configuration
    - `.gitignore` - Git ignore rules

- `k8s/` - Kubernetes configuration files
  - Deployment manifests
  - Service configurations
  - Secrets and ConfigMaps

- `docs/` - Documentation
  - Tutorials
  - API documentation
  - Setup guides

- `.github/` - GitHub related files
  - `workflows/` - GitHub Actions workflows

- `scripts/` - Utility scripts
  - Build scripts
  - Deployment scripts

- `db/` - Database related files
  - Migrations
  - Schemas

- `docker/` - Docker related files
  - Dockerfiles
  - Docker compose configurations

## Root Files
- `docker-compose.yml` - Local development setup
- `.env` - Root environment variables
- `.env.example` - Example environment configuration
- `package.json` - Root package configuration
- `package-lock.json` - Root dependency lock file
- `.gitignore` - Root git ignore rules
- `README.md` - Project documentation

## Kubernetes Services
- Frontend (auth-ui):
  - Internal port: 80
  - Service type: LoadBalancer
  - External IP: 34.31.15.71
  - Access URL: http://34.31.15.71

- Backend (auth-service):
  - Internal port: 5001
  - Service type: LoadBalancer
  - External IP: 34.56.24.80
  - Access URL: http://34.56.24.80:5001

- Redis:
  - Internal port: 6379
  - Service type: ClusterIP (internal only)
  - No external IP (accessed within cluster)

## Local Development
- Frontend dev server: http://localhost:5173
- Backend dev server: http://localhost:5001
- Redis: localhost:6379 