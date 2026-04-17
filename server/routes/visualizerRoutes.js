import express from 'express'
import {
  getRoomTypes,
  getPaintColors,
  getPaintFinishes,
  saveConfiguration,
  loadConfiguration,
  generateImage,
  getVisualizerAnalytics
} from '../controllers/visualizerController.js'
import { authenticate, adminOnly } from '../middleware/auth.js'
import { validateRateLimit } from '../middleware/validation.js'
import multer from 'multer'

const router = express.Router()

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// Apply rate limiting to all visualizer routes
router.use(validateRateLimit(60000, 500)) // 500 requests per minute

// Public routes
router.get('/rooms', getRoomTypes)
router.get('/colors', getPaintColors)
router.get('/finishes', getPaintFinishes)
router.get('/load/:id', loadConfiguration)

// Protected routes (require authentication)
router.post('/save', 
  authenticate, 
  saveConfiguration
)

router.post('/generate-image', 
  authenticate, 
  generateImage
)

// Admin-only routes
router.get('/analytics', 
  authenticate, 
  adminOnly, 
  getVisualizerAnalytics
)

// Serve uploaded images
router.use('/uploads', express.static('uploads'))

export default router
