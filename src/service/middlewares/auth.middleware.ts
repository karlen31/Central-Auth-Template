import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token.utils';
import Service from '../models/service.model';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      service?: any;
    }
  }
}

// Middleware to verify JWT token
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. Use Bearer <token>'
      });
    }
    
    const token = parts[1];
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Middleware to verify API key for service-to-service calls
export const verifyApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No API key provided.'
      });
    }
    
    // Find the service with this API key
    const service = await Service.findOne({ apiKey, isActive: true });
    
    if (!service) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }
    
    // Check origin if origins are restricted
    if (service.allowedOrigins.length > 0) {
      const origin = req.headers.origin || req.headers.referer || '';
      
      const isAllowedOrigin = service.allowedOrigins.some(allowedOrigin => 
        origin.startsWith(allowedOrigin)
      );
      
      if (!isAllowedOrigin) {
        return res.status(403).json({
          success: false,
          message: 'Origin not allowed'
        });
      }
    }
    
    // Attach service info to request
    req.service = service;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Role check middleware
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not authenticated.'
      });
    }
    
    const hasRole = roles.some(role => req.user.roles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient privileges.'
      });
    }
    
    next();
  };
}; 