import { Request, Response } from 'express';
import { verifyAccessToken } from '../utils/token.utils';
import User from '../models/user.model';

// Validate a token and return user info
export const validateToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }
    
    // Verify token
    const decoded = await verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        isValid: false
      });
    }
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        isValid: false
      });
    }
    
    // Return user info
    return res.status(200).json({
      success: true,
      isValid: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('Validate token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      isValid: false
    });
  }
};

// Check if user has required roles
export const checkUserRoles = async (req: Request, res: Response) => {
  try {
    const { token, requiredRoles } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
        hasRoles: false
      });
    }
    
    if (!requiredRoles || !Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Required roles must be a non-empty array',
        hasRoles: false
      });
    }
    
    // Verify token
    const decoded = await verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        hasRoles: false
      });
    }
    
    // Check if user has any of the required roles
    const hasRequiredRole = requiredRoles.some(role => decoded.roles.includes(role));
    
    return res.status(200).json({
      success: true,
      hasRoles: hasRequiredRole,
      userRoles: decoded.roles
    });
  } catch (error) {
    console.error('Check user roles error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      hasRoles: false
    });
  }
}; 