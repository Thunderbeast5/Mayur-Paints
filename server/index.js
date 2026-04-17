import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'

// Import routes
import authRoutes from './routes/auth.js'
import paintsRoutes from './routes/paints.js'
import hardwareRoutes from './routes/hardware.js'
import ordersRoutes from './routes/orders.js'
import inventoryRoutes from './routes/inventory.js'
import analyticsRoutes from './routes/analytics.js'
import usersRoutes from './routes/users.js'
import addressRoutes from './routes/addresses.js'
import reviewsRoutes from './routes/reviews.js'
import wishlistRoutes from './routes/wishlist.js'
import serviceProvidersRoutes from './routes/serviceProviders.js'
import serviceBookingsRoutes from './routes/serviceBookings.js'
import paintCalculatorRoutes from './routes/paintCalculator.js'
import colorMatcherRoutes from './routes/colorMatcher.js'
import paymentsRoutes from './routes/payments.js'

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3001

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...')
    console.log('📍 MongoDB URI:', process.env.MONGO_URI ? 'Set (hidden for security)' : 'NOT SET!')
    
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set')
    }
    
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB Connected:', mongoose.connection.host)
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://localhost:3000',
  'https://mayur-paints.onrender.com',
  'https://www.mayurpaints.shop',
  'https://mayur-paints-1.onrender.com/'  // Production frontend
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'))

// Request logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Health check route
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  res.json({
    status: 'ok',
    db: dbStatus,
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/paints', paintsRoutes)
app.use('/api/hardware', hardwareRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/users', addressRoutes) // Address routes MUST come before users routes
app.use('/api/users', usersRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/service-providers', serviceProvidersRoutes)
app.use('/api/service-bookings', serviceBookingsRoutes)
app.use('/api/paint-calculator', paintCalculatorRoutes)
app.use('/api/color-matcher', colorMatcherRoutes)
app.use('/api/payments', paymentsRoutes)

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Mayur Paints API Server',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      paints: '/api/paints',
      hardware: '/api/hardware',
      orders: '/api/orders',
      inventory: '/api/inventory',
      analytics: '/api/analytics',
      users: '/api/users',
      reviews: '/api/reviews',
      wishlist: '/api/wishlist',
      serviceProviders: '/api/service-providers',
      serviceBookings: '/api/service-bookings',
      paintCalculator: '/api/paint-calculator',
      colorMatcher: '/api/color-matcher',
      payments: '/api/payments'
    }
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error)
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  })
})

// Start server
const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`🚀 Mayur Paints API Server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  process.exit(0)
})

// Start the server
startServer()

export default app
