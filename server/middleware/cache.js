// In-memory cache for development (replace with Redis in production)
const cache = new Map()

// Cache configuration
const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  productCacheTTL: 10 * 60 * 1000, // 10 minutes
  analyticsCacheTTL: 60 * 60 * 1000, // 1 hour
  userCacheTTL: 30 * 60 * 1000, // 30 minutes
}

// Cache middleware factory
export const cacheMiddleware = (ttl = CACHE_CONFIG.defaultTTL) => {
  return (req, res, next) => {
    const key = generateCacheKey(req)
    const cached = cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      // Set cache headers
      res.set('X-Cache', 'HIT')
      res.set('X-Cache-Age', Math.floor((ttl - (Date.now() - cached.timestamp)) / 1000))
      
      return res.json(cached.data)
    }
    
    // Override res.json to cache response
    const originalJson = res.json
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, {
          data,
          timestamp: Date.now()
        })
        
        // Set cache headers
        res.set('X-Cache', 'MISS')
        res.set('X-Cache-TTL', Math.floor(ttl / 1000))
      }
      
      return originalJson.call(this, data)
    }
    
    next()
  }
}

// Generate cache key from request
const generateCacheKey = (req) => {
  const { method, originalUrl, query } = req
  const queryString = new URLSearchParams(query).toString()
  return `${method}:${originalUrl}${queryString ? '?' + queryString : ''}`
}

// Cache helper functions
export const getCache = (key) => {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

export const setCache = (key, data, ttl = CACHE_CONFIG.defaultTTL) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

export const deleteCache = (key) => {
  cache.delete(key)
}

export const clearCache = (pattern) => {
  if (!pattern) {
    cache.clear()
    return
  }
  
  for (const [key] of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
}

// Cache invalidation middleware
export const invalidateCache = (patterns = []) => {
  return (req, res, next) => {
    const originalJson = res.json
    
    res.json = function(data) {
      // Invalidate cache patterns after successful mutations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        patterns.forEach(pattern => {
          clearCache(pattern)
        })
      }
      
      return originalJson.call(this, data)
    }
    
    next()
  }
}

// Product-specific cache middleware
export const productCache = cacheMiddleware(CACHE_CONFIG.productCacheTTL)

// Analytics-specific cache middleware
export const analyticsCache = cacheMiddleware(CACHE_CONFIG.analyticsCacheTTL)

// User-specific cache middleware
export const userCache = cacheMiddleware(CACHE_CONFIG.userCacheTTL)

// Cache warming function
export const warmCache = async (endpoints = []) => {
  console.log('🔥 Warming up cache...')
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`)
      if (response.ok) {
        const key = `GET:${endpoint}`
        setCache(key, await response.json(), CACHE_CONFIG.productCacheTTL)
        console.log(`✅ Cached ${endpoint}`)
      }
    } catch (error) {
      console.error(`❌ Failed to cache ${endpoint}:`, error.message)
    }
  }
  
  console.log('🚀 Cache warming completed')
}

// Cache statistics
export const getCacheStats = () => {
  const stats = {
    size: cache.size,
    hitRate: 0,
    memoryUsage: 0
  }
  
  // Calculate memory usage (approximate)
  for (const [key, value] of cache.entries()) {
    stats.memoryUsage += key.length * 2 + JSON.stringify(value).length * 2
  }
  
  return stats
}

// Cleanup expired cache entries
export const cleanupExpiredCache = () => {
  const now = Date.now()
  let cleaned = 0
  
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > value.ttl) {
      cache.delete(key)
      cleaned++
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired cache entries`)
  }
}

// Schedule cleanup every 5 minutes
setInterval(cleanupExpiredCache, 5 * 60 * 1000)

export default {
  cacheMiddleware,
  productCache,
  analyticsCache,
  userCache,
  getCache,
  setCache,
  deleteCache,
  clearCache,
  invalidateCache,
  warmCache,
  getCacheStats,
  cleanupExpiredCache
}
