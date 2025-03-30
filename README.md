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
├── .env                   # Environment variables
└── tsconfig.json          # TypeScript configuration
```

## Prerequisites

- Node.js (v16+) 
- MongoDB

## Getting Started

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/auth-service.git
   cd auth-service
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/auth-service
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRES_IN=7d
   ALLOWED_ORIGINS=http://localhost:3000
   ```

3. Run the start script to install dependencies and start the application:
   ```
   ./scripts/start.sh
   ```

   This will:
   - Install UI dependencies
   - Install Service dependencies
   - Start both the UI and Service concurrently

### Manual Installation

If you prefer to install dependencies manually:

1. Install UI dependencies:
   ```
   cd src/ui
   npm install
   ```

2. Install Service dependencies:
   ```
   cd src/service
   npm install
   ```

## Development

To start the development servers:

```
./scripts/start.sh
```

- UI will be available at: http://localhost:3000
- API will be available at: http://localhost:5000

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

## License

This project is licensed under the ISC License. 