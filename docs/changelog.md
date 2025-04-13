# Changelog

## [1.0.1] - 2024-04-13

### Fixed
- CORS Configuration
  - Added UI's external IP (http://34.31.15.71) to allowed origins in auth service
  - Added Google reCAPTCHA domain (https://www.google.com) to allowed origins for reCAPTCHA verification

- API URL Configuration
  - Updated UI deployment to use correct external API URL in production
  - Maintained localhost:5001 as default API URL for local development
  - Added VITE_API_URL build argument to UI Dockerfile and GitHub Actions workflow

- Authentication
  - Added reCAPTCHA verification to login endpoint
  - Fixed 401 unauthorized error by properly handling reCAPTCHA token in login flow
  - Ensured consistent reCAPTCHA verification between registration and login

### Technical Details
1. Updated Files:
   - `src/service/config/index.ts`: Updated CORS allowed origins
   - `src/ui/Dockerfile`: Added VITE_API_URL build argument
   - `.github/workflows/deploy.yml`: Added VITE_API_URL to UI build configuration
   - `src/service/controllers/auth.controller.ts`: Added reCAPTCHA verification to login endpoint
   - `k8s/auth-ui-deployment.yaml`: Updated API URL configuration

2. Environment Variables:
   - Local Development:
     ```
     VITE_API_URL=http://localhost:5001
     ```
   - Production:
     ```
     VITE_API_URL=http://34.56.24.80:5001
     ```

3. CORS Configuration:
   ```typescript
   allowedOrigins: [
     'http://localhost:3001',
     'http://localhost:3000',
     'https://www.google.com',
     'http://34.31.15.71'
   ]
   ```

### Deployment
- Changes are automatically deployed through GitHub Actions workflow
- Both UI and auth service are deployed to Google Kubernetes Engine (GKE)
- UI is accessible at http://34.31.15.71
- Auth service is accessible at http://34.56.24.80:5001 