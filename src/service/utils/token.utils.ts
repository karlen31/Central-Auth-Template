import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { IUser } from '../models/user.model';
import AuthorizationToken from '../models/authorization-token.model';
import crypto from 'crypto';

interface TokenPayload {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export const generateTokens = async (user: IUser) => {
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

  // Hash the tokens
  const refreshTokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  const accessTokenHash = crypto
    .createHash('sha256')
    .update(accessToken)
    .digest('hex');

  // Calculate expiration dates
  const refreshExpiresAt = new Date();
  refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7); // 7 days from now

  const accessExpiresAt = new Date();
  accessExpiresAt.setHours(accessExpiresAt.getHours() + 1); // 1 hour from now

  // Create authorization token document
  const authTokenDoc = new AuthorizationToken({
    userId: user._id,
    refreshTokenHash,
    accessTokenHash,
    refreshExpiresAt,
    accessExpiresAt,
    isValid: true
  });

  await authTokenDoc.save();

  return { accessToken, refreshToken };
};

export const verifyAccessToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret as string) as TokenPayload;
    
    // Hash the provided token
    const accessTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find the token in the database
    const tokenDoc = await AuthorizationToken.findOne({
      accessTokenHash,
      isValid: true,
      accessExpiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, config.refreshTokenSecret as string) as { id: string };
    
    // Hash the provided token
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find the refresh token in the database
    const authTokenDoc = await AuthorizationToken.findOne({
      refreshTokenHash,
      isValid: true,
      refreshExpiresAt: { $gt: new Date() }
    });

    if (!authTokenDoc) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

export const invalidateRefreshToken = async (token: string) => {
  try {
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find the token document
    const tokenDoc = await AuthorizationToken.findOne({ refreshTokenHash });
    
    if (tokenDoc) {
      // Invalidate all tokens for this user
      await AuthorizationToken.updateMany(
        { userId: tokenDoc.userId, isValid: true },
        { isValid: false }
      );
    }
  } catch (error) {
    console.error('Error invalidating refresh token:', error);
  }
};

export const invalidateAccessToken = async (token: string) => {
  try {
    const accessTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find the token document
    const tokenDoc = await AuthorizationToken.findOne({ accessTokenHash });
    
    if (tokenDoc) {
      // Invalidate all tokens for this user
      await AuthorizationToken.updateMany(
        { userId: tokenDoc.userId, isValid: true },
        { isValid: false }
      );
    }
  } catch (error) {
    console.error('Error invalidating access token:', error);
  }
};

export const generateApiKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateSecret = (): string => {
  return crypto.randomBytes(48).toString('hex');
}; 