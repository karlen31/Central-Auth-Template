import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
  allowedOrigins: string[];
  recaptcha: {
    siteKey: string;
    secretKey: string;
    verifyUrl: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '5001'),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service',
  jwtSecret: process.env.JWT_SECRET || 'fallback_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '5m',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_token_secret',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3001,http://localhost:3000').split(','),
  recaptcha: {
    siteKey: process.env.RECAPTCHA_SITE_KEY || '',
    secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
    verifyUrl: 'https://www.google.com/recaptcha/api/siteverify'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined
  }
};

export default config; 