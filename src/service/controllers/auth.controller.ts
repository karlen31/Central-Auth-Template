import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import { generateTokens, verifyRefreshToken, invalidateRefreshToken, verifyAccessToken, invalidateAccessToken, TokenPayload } from '../utils/token.utils';
import { verifyRecaptcha } from '../utils/recaptcha.utils';
import TOGGLE_RECAPTCHA from '../config';
import { Document, Types } from 'mongoose';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, roles, recaptchaToken } = req.body;
    
    // Verify reCAPTCHA if enabled
    if (TOGGLE_RECAPTCHA) {
      const isValid = await verifyRecaptcha(recaptchaToken);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid reCAPTCHA token'
        });
      }
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] }).lean();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      roles: roles || ['user']
    });
    
    const user = await newUser.save() as Document & IUser;
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(
      user._id.toString(),
      user.tokenVersion
    );
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          roles: user.roles
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email }) as Document & IUser;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(
      user._id.toString(),
      user.tokenVersion
    );
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          roles: user.roles
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    
    // Verify refresh token
    const decoded = await verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
    
    // Find user
    const user = await User.findById(decoded.id) as Document & IUser;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Invalidate the old refresh token
    await invalidateRefreshToken(refreshToken);
    
    // Generate new tokens
    const tokens = await generateTokens(
      user._id.toString(),
      user.tokenVersion
    );
    
    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    
    // Invalidate both tokens
    await invalidateRefreshToken(refreshToken);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.split(' ')[1];
      await invalidateAccessToken(accessToken);
    }
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Add a new endpoint to invalidate all user tokens
export const logoutAllDevices = async (req: Request, res: Response) => {
  try {
    const user = req.user as TokenPayload;
    if (!user || !user.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Increment token version to invalidate all existing tokens
    await User.findByIdAndUpdate(user.userId, { $inc: { tokenVersion: 1 } });
    
    return res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all devices error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const checkTokenValidity = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
        isValid: false
      });
    }
    
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
        isValid: false
      });
    }
    
    const token = parts[1];
    const decoded = await verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        isValid: false
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Token is valid',
      isValid: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        roles: decoded.roles
      }
    });
  } catch (error) {
    console.error('Token validity check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      isValid: false
    });
  }
}; 