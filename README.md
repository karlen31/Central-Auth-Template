# Auth Service Template

A centralized authentication service with UI, built with React and Node.js, deployed on Google Kubernetes Engine.

## Features
- User authentication with JWT tokens
- reCAPTCHA integration for security
- Automated deployment with GitHub Actions
- Kubernetes deployment on GKE
- CORS configuration for secure cross-origin requests

## Development Setup

### Prerequisites
- Node.js 20.x
- Docker
- kubectl CLI
- gcloud CLI

### Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   # Install UI dependencies
   cd src/ui
   npm install

   # Install service dependencies
   cd ../service
   npm install
   ```

3. Set up environment variables:
   ```bash
   # UI (.env)
   VITE_API_URL=http://localhost:5001
   VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

   # Service (.env)
   PORT=5001
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
   ```

4. Start development servers:
   ```bash
   # Start UI
   cd src/ui
   npm run dev

   # Start service
   cd ../service
   npm run dev
   ```

## Production Deployment

### Environment Configuration
- UI is configured to use the auth service's external IP in production
- CORS is configured to allow requests from the UI's domain and Google reCAPTCHA
- Environment variables are managed through Kubernetes secrets

### Deployment Process
1. Push changes to the main branch
2. GitHub Actions workflow:
   - Builds Docker images
   - Pushes to Google Container Registry
   - Updates Kubernetes deployments
   - Applies configuration changes

### Access URLs
- UI: http://34.31.15.71
- Auth Service: http://34.56.24.80:5001

## Documentation
- [Changelog](docs/changelog.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)

## Contributing
1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License
MIT 