import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config';
import { addToBlacklist, isBlacklisted } from './redis.utils';
import User, { IUser } from '../models/user.model';

export interface TokenPayload {
  userId: string;
  version: number;
  id: string;
  username: string;
  email: string;
  roles: string[];
}

// Helper function to parse time string to seconds
const parseTimeToSeconds = (time: string): number => {
  const unit = time.slice(-1);
  const value = parseInt(time.slice(0, -1));
  
  switch (unit) {
    case 'd': return value * 24 * 60 * 60;
    case 'h': return value * 60 * 60;
    case 'm': return value * 60;
    case 's': return value;
    default: return 24 * 60 * 60; // Default to 1 day
  }
};

export const generateTokens = async (userId: string, version: number): Promise<{ accessToken: string; refreshToken: string }> => {
  // Get user details
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new Error('User not found');
  }
  
  const payload: TokenPayload = {
    userId,
    version,
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    roles: user.roles
  };
  
  const accessTokenOptions: SignOptions = {
    expiresIn: parseTimeToSeconds(config.jwtExpiresIn)
  };
  
  const refreshTokenOptions: SignOptions = {
    expiresIn: parseTimeToSeconds(config.refreshTokenExpiresIn)
  };
  
  const accessToken = jwt.sign(payload, config.jwtSecret, accessTokenOptions);
  const refreshToken = jwt.sign(payload, config.refreshTokenSecret, refreshTokenOptions);
  
  return { accessToken, refreshToken };
};

export const verifyAccessToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    // First check if token is blacklisted
    const isBlacklistedToken = await isBlacklisted(token);
    if (isBlacklistedToken) {
      return null;
    }
    
    // Then verify the token
    return jwt.verify(token, config.jwtSecret) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    // First check if token is blacklisted
    const isBlacklistedToken = await isBlacklisted(token);
    if (isBlacklistedToken) {
      return null;
    }
    
    // Then verify the token
    return jwt.verify(token, config.refreshTokenSecret) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const invalidateRefreshToken = async (token: string): Promise<void> => {
  const decoded = jwt.decode(token) as { exp?: number };
  if (decoded && decoded.exp) {
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn > 0) {
      await addToBlacklist(token, expiresIn);
    }
  }
};

export const invalidateAccessToken = async (token: string): Promise<void> => {
  const decoded = jwt.decode(token) as { exp?: number };
  if (decoded && decoded.exp) {
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn > 0) {
      await addToBlacklist(token, expiresIn);
    }
  }
};

export const generateApiKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateSecret = (): string => {
  return crypto.randomBytes(64).toString('hex');
}; 