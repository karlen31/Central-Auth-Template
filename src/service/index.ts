import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import config from './config';

// Import routes
import authRoutes from './routes/auth.routes';
import serviceRoutes from './routes/service.routes';
import validateRoutes from './routes/validate.routes';

// Setup function to initialize the auth service
export const setupAuthService = async (app: Application): Promise<void> => {
  // Connect to MongoDB
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }

  // Middleware
  app.use(helmet());
  app.use(cors({
    origin: config.allowedOrigins,
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', limiter);

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/validate', validateRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString()
    });
  });

  // API info endpoint
  app.get('/api', (req, res) => {
    res.status(200).json({
      message: 'Auth Service API',
      version: '1.0.0',
    });
  });

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  });

  console.log('Auth service API initialized');
};

// Create and start the server
const app = express();
const PORT = process.env.PORT || 5000;

setupAuthService(app)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Auth service listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start auth service:', error);
    process.exit(1);
  }); 