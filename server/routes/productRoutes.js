import express from 'express'
import {
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getBestsellers,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} from '../controllers/productController.js'
import { authenticate, adminOnly } from '../middleware/auth.js'
import { validate, validateObjectId, validateRateLimit } from '../middleware/validation.js'

const router = express.Router()

// Apply rate limiting to all product routes
router.use(validateRateLimit(60000, 1000)) // 1000 requests per minute

// Public routes
router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/bestsellers', getBestsellers)
router.get('/search', searchProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/stats', authenticate, adminOnly, getProductStats)

// Protected routes (require ID validation)
router.use('/:id', validateObjectId('id'))

router.get('/:id', getProductById)

// Admin-only routes
router.post('/', 
  authenticate, 
  adminOnly, 
  validate('product'), 
  createProduct
)

router.put('/:id', 
  authenticate, 
  adminOnly, 
  validate('product'), 
  updateProduct
)

router.delete('/:id', 
  authenticate, 
  adminOnly, 
  deleteProduct
)

export default router
