import express from 'express'
import Product from '../models/Product.js'
import { authenticate, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/inventory
// @desc    Get inventory summary with low stock alerts
// @access  Admin
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const products = await Product.find().lean()
    
    const totalProducts = products.length
    const lowStockItems = products.filter(p => p.stock <= (p.minStock || 20)).length
    const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    
    res.json({
      success: true,
      data: {
        products,
        totalProducts,
        lowStockItems,
        totalStockValue: Math.round(totalStockValue)
      }
    })
  } catch (error) {
    console.error('Inventory error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch inventory' })
  }
})

export default router
