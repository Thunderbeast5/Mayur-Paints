import express from 'express'
import Review from '../models/Review.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// GET /api/reviews/:productId - Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const { type } = req.query // 'paint' or 'hardware'
    
    const reviews = await Review.find({
      product: req.params.productId,
      productType: type === 'paint' ? 'Paint' : 'Hardware'
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    })
  }
})

// POST /api/reviews - Create a review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, productType, rating, comment } = req.body

    // Validation
    if (!productId || !productType || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, product type, and rating are required'
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
      productType
    })

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      })
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      productType,
      rating,
      comment: comment || ''
    })

    const populatedReview = await Review.findById(review._id).populate('user', 'name')

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: populatedReview
    })
  } catch (error) {
    console.error('Create review error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    })
  }
})

// DELETE /api/reviews/:id - Delete a review (own review only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      })
    }

    await review.deleteOne()

    res.json({
      success: true,
      message: 'Review deleted successfully'
    })
  } catch (error) {
    console.error('Delete review error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    })
  }
})

export default router
