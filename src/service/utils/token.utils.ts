import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { IUser } from '../models/user.model';
import crypto from 'crypto';

interface TokenPayload {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export const generateTokens = (user: IUser) => {
  // Create payload
  const payload: TokenPayload = {
    id: (user._id as any).toString(),
    username: user.username,
    email: user.email,
    roles: user.roles
  };

  // Generate access token
  const accessToken = jwt.sign(
    payload,
    config.jwtSecret as string,
    { expiresIn: config.jwtExpiresIn } as SignOptions
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: (user._id as any).toString() },
    config.refreshTokenSecret as string,
    { expiresIn: config.refreshTokenExpiresIn } as SignOptions
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.jwtSecret as string) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, config.refreshTokenSecret as string) as { id: string };
  } catch (error) {
    return null;
  }
};

export const generateApiKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateSecret = (): string => {
  return crypto.randomBytes(48).toString('hex');
}; 