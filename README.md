# Centralized Auth Service

A modern authentication service providing centralized authentication for multiple applications. This service includes both a RESTful API backend and a React frontend UI.

## Features

- User authentication (login/signup)
- JWT-based authentication with refresh tokens
- Role-based access control
- API key authentication for services 
- Modern React UI built with Vite
- TypeScript for type safety
- RESTful API with Express
- Google reCAPTCHA integration for enhanced security

## Project Structure

```
auth-service/
├── scripts/               # Scripts for running the application
│   └── start.sh           # Script to start both UI and Service
├── src/                   # Source code
│   ├── ui/                # React frontend UI
│   │   ├── public/        # Static assets
│   │   ├── src/           # React source code
│   │   ├── package.json   # UI dependencies
│   │   └── ...
│   └── service/           # Express backend API
│       ├── config/        # Configuration files
│       ├── controllers/   # API controllers
│       ├── middlewares/   # Express middlewares
│       ├── models/        # Database models
│       ├── routes/        # API routes
│       ├── utils/         # Utility functions
│       ├── index.ts       # Service entry point
│       ├── package.json   # Service dependencies
│       └── ...
├── .env                   # Environment variables (not in version control)
├── .env.example          # Example environment variables template
└── tsconfig.json         # TypeScript configuration
```

## Prerequisites

- Node.js (v16+) 
- MongoDB
- Docker and Docker Compose (for containerized deployment)

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Required environment variables:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time (e.g., "1d" for 1 day)
- `REFRESH_TOKEN_SECRET`: Secret key for refresh token generation
- `REFRESH_TOKEN_EXPIRES_IN`: Refresh token expiration time
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
- `RECAPTCHA_SITE_KEY`: Google reCAPTCHA site key (get from reCAPTCHA admin console)
- `RECAPTCHA_SECRET_KEY`: Google reCAPTCHA secret key (get from reCAPTCHA admin console)

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/auth-service.git
   cd auth-service
   ```

2. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit `.env` with your actual values.

3. Start with Docker:
   ```
   ./scripts/start-docker.sh
   ```

   This will:
   - Build and start all containers
   - Set up the database
   - Start both frontend and backend services

## Development

The services will be available at:
- UI: http://localhost:3000
- API: http://localhost:5001
- MongoDB: mongodb://localhost:27017

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### User Management

- `GET /api/users/me` - Get current user info
- `PUT /api/users/me` - Update current user
- `PUT /api/users/password` - Change password

### API Keys

- `POST /api/services/register` - Register a new service
- `GET /api/services/:id` - Get service details
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## Security Notes

1. Never commit `.env` file to version control
2. Always use strong, unique values for JWT secrets in production
3. Keep your reCAPTCHA keys secure
4. Update MongoDB credentials in production

## License

This project is licensed under the ISC License.

## Deployment
This service is automatically deployed to Google Kubernetes Engine (GKE) when changes are pushed to the main branch.

### Infrastructure Details
- GKE Cluster: autopilot-cluster-1
- Region: us-central1
- Project ID: template-1743820446385

### CI/CD Pipeline
The service uses GitHub Actions for continuous deployment:
1. Builds Docker image
2. Pushes to Google Container Registry
3. Deploys to GKE cluster 