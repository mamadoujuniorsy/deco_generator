/* eslint-disable @typescript-eslint/no-explicit-any */
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Initialize Redis client
export const redis = new Redis({
  url: process.env.REDIS_URL as string,
  token: process.env.REDIS_TOKEN as string,
})

// Rate limiter configuration
export const ratelimit = {
  free: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '60 s'), // 5 requests per minute
    prefix: 'ratelimit:free',
  }),
  pro: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per minute
    prefix: 'ratelimit:pro',
  }),
}

// Cache helpers
export const cache = {
  set: async (key: string, value: any, ttl?: number) => {
    const serialized = JSON.stringify(value)
    if (ttl) {
      await redis.setex(key, ttl, serialized)
    } else {
      await redis.set(key, serialized)
    }
  },
  get: async <T>(key: string): Promise<T | null> => {
    const cached = await redis.get<string>(key)
    return cached ? JSON.parse(cached) : null
  },
  delete: async (key: string) => {
    await redis.del(key)
  },
  wrap: async <T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 60
  ): Promise<T> => {
    const cached = await cache.get<T>(key)
    if (cached) return cached

    const fresh = await fn()
    await cache.set(key, fresh, ttl)
    return fresh
  },
}

// Job status helpers
export const jobStatus = {
  set: async (sessionId: string, status: any) => {
    await cache.set(`job:${sessionId}:status`, status, 60 * 5) // 5 minute TTL
  },
  get: async (sessionId: string) => {
    return await cache.get(`job:${sessionId}:status`)
  },
  clear: async (sessionId: string) => {
    await cache.delete(`job:${sessionId}:status`)
  },
}

// Rate limiting middleware helper
export async function checkRateLimit(
  identifier: string,
  tier: 'free' | 'pro' = 'free'
) {
  const { success } = await ratelimit[tier].limit(identifier)
  return success
}

// Utility types
declare global {
  var redis: Redis
}

// For development (avoid creating new connections in HMR)
if (process.env.NODE_ENV === 'development') {
  if (!global.redis) {
    global.redis = redis
  }
}