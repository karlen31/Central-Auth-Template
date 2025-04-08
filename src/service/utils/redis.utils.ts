import Redis from 'ioredis';
import config from '../config';

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password
});

// Add connection event listeners
redis.on('connect', () => {
  console.log('Redis connected successfully');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export const addToBlacklist = async (token: string, expiresIn: number) => {
  console.log('🔄 Adding token to Redis blacklist with expiration:', expiresIn, 'seconds');
  await redis.set(`blacklist:${token}`, '1', 'EX', expiresIn);
  console.log('Token added to blacklist');
};

export const isBlacklisted = async (token: string): Promise<boolean> => {
  console.log('🔍 Checking if token is blacklisted in Redis');
  const exists = await redis.exists(`blacklist:${token}`);
  console.log('📝 Token blacklist check result:', exists === 1 ? 'blacklisted' : 'not blacklisted');
  return exists === 1;
}; 