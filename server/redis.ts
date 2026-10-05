import { createClient } from 'redis';

type RedisClientType = ReturnType<typeof createClient>;

let redisClient: RedisClientType | null = null;
let isRedisConnected = false;
let hasLoggedRedisError = false;

// High-availability In-Memory fallback cache
const memoryCache = new Map<string, { val: string; expiresAt: number | null }>();

export async function connectRedis() {
  const host = process.env.REDIS_HOST || '127.0.0.1';
  const port = process.env.REDIS_PORT || '6379';
  const password = process.env.REDIS_PASSWORD || '';
  
  const redisUrl = password 
    ? `redis://:${password}@${host}:${port}`
    : `redis://${host}:${port}`;

  try {
    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 3000,
        reconnectStrategy(retries) {
          if (retries >= 1) {
            return false; // Stop reconnecting after first failure
          }
          return 1000;
        }
      }
    });

    redisClient.on('error', (err) => {
      if (!hasLoggedRedisError) {
        console.log('INFO: Operating with local In-Memory cache fallback (Redis Server offline).');
        hasLoggedRedisError = true;
      }
      isRedisConnected = false;
    });

    await redisClient.connect();
    isRedisConnected = true;
    console.log('Successfully connected to Redis Server.');
    return true;
  } catch (err: any) {
    if (!hasLoggedRedisError) {
      console.log('INFO: Operating with local In-Memory cache fallback (Redis Server connection refused).');
      hasLoggedRedisError = true;
    }
    redisClient = null;
    isRedisConnected = false;
    return false;
  }
}

export const cache = {
  async get(key: string): Promise<string | null> {
    if (isRedisConnected && redisClient) {
      try {
        const val = await redisClient.get(key);
        return typeof val === 'string' ? val : null;
      } catch (e) {
        // Fallback to local memory
      }
    }
    
    const entry = memoryCache.get(key);
    if (!entry) return null;
    
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      memoryCache.delete(key);
      return null;
    }
    
    return entry.val;
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (isRedisConnected && redisClient) {
      try {
        if (ttlSeconds) {
          await redisClient.set(key, value, { EX: ttlSeconds });
        } else {
          await redisClient.set(key, value);
        }
        return;
      } catch (e) {
        // Fallback to local memory
      }
    }
    
    const expiresAt = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null;
    memoryCache.set(key, { val: value, expiresAt });
  },

  async del(key: string): Promise<void> {
    if (isRedisConnected && redisClient) {
      try {
        await redisClient.del(key);
        return;
      } catch (e) {
        // Fallback
      }
    }
    memoryCache.delete(key);
  },

  async flush(): Promise<void> {
    if (isRedisConnected && redisClient) {
      try {
        await redisClient.flushAll();
        return;
      } catch (e) {
        // Fallback
      }
    }
    memoryCache.clear();
  },

  async keys(pattern: string): Promise<string[]> {
    if (isRedisConnected && redisClient) {
      try {
        const k = await redisClient.keys(pattern);
        return k.map(x => String(x));
      } catch (e) {
        // Fallback
      }
    }
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    const matches: string[] = [];
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) matches.push(key);
    }
    return matches;
  }
};
