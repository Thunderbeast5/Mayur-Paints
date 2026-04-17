import express from 'express'
import Wishlist from '../models/Wishlist.js'
import Paint from '../models/Paint.js'
import Hardware from '../models/Hardware.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// GET /api/wishlist - Get user's wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name brand price image stock category'
      })
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] })
    }
    
    res.json({
      success: true,
      data: wishlist
    })
  } catch (error) {
    console.error('Get wishlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message
    })
  }
})

// POST /api/wishlist - Add item to wishlist
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, productType, variantId } = req.body
    
    if (!productId || !productType) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and type are required'
      })
    }
    
    // Verify product exists
    const Model = productType === 'Paint' ? Paint : Hardware
    const product = await Model.findById(productId)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }
    
    let wishlist = await Wishlist.findOne({ user: req.user._id })
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] })
    }
    
    await wishlist.addItem(productId, productType, variantId)
    
    await wishlist.populate({
      path: 'items.product',
      select: 'name brand price image stock category'
    })
    
    res.json({
      success: true,
      message: 'Item added to wishlist',
      data: wishlist
    })
  } catch (error) {
    console.error('Add to wishlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist',
      error: error.message
    })
  }
})

// DELETE /api/wishlist/:productId - Remove item from wishlist
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const { variantId } = req.query
    
    const wishlist = await Wishlist.findOne({ user: req.user._id })
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      })
    }
    
    await wishlist.removeItem(req.params.productId, variantId)
    
    await wishlist.populate({
      path: 'items.product',
      select: 'name brand price image stock category'
    })
    
    res.json({
      success: true,
      message: 'Item removed from wishlist',
      data: wishlist
    })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from wishlist',
      error: error.message
    })
  }
})

// GET /api/wishlist/check/:productId - Check if item is in wishlist
router.get('/check/:productId', authenticateToken, async (req, res) => {
  try {
    const { variantId } = req.query
    
    const wishlist = await Wishlist.findOne({ user: req.user._id })
    
    if (!wishlist) {
      return res.json({
        success: true,
        inWishlist: false
      })
    }
    
    const inWishlist = wishlist.hasItem(req.params.productId, variantId)
    
    res.json({
      success: true,
      inWishlist
    })
  } catch (error) {
    console.error('Check wishlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist',
      error: error.message
    })
  }
})

// DELETE /api/wishlist - Clear entire wishlist
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      })
    }
    
    wishlist.items = []
    await wishlist.save()
    
    res.json({
      success: true,
      message: 'Wishlist cleared',
      data: wishlist
    })
  } catch (error) {
    console.error('Clear wishlist error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
      error: error.message
    })
  }
})

export default router
