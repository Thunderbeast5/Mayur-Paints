import compression from 'compression'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import os from 'os'

// Compression middleware
export const compressionMiddleware = compression({
  level: 6,
  threshold: 1024,
})

// Security headers middleware — relaxed for development
export const securityMiddleware = helmet({
  contentSecurityPolicy: false, // disabled for dev flexibility
  crossOriginEmbedderPolicy: false,
})

// Rate limiting
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  message: { success: false, message: 'Too many requests', error: 'RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Request logger
export const requestLogger = (req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    const icon = res.statusCode >= 400 ? '❌' : '✅'
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${icon} ${req.method} ${req.url} — ${res.statusCode} (${duration}ms)`)
    }
  })
  next()
}

// Health check handler
export const healthCheck = (req, res) => {
  const used = process.memoryUsage()
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    memory: {
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
    },
    platform: os.platform(),
    nodeVersion: process.version,
  })
}

// Cache stats middleware — simple pass-through
export const cacheStats = (req, res, next) => next()

// Combined performance middleware array (used in server/index.js as app.use(performanceMiddleware))
export const performanceMiddleware = [
  compressionMiddleware,
  securityMiddleware,
  rateLimitMiddleware,
  requestLogger,
]

export default {
  compressionMiddleware,
  securityMiddleware,
  rateLimitMiddleware,
  requestLogger,
  healthCheck,
  cacheStats,
  performanceMiddleware,
}
