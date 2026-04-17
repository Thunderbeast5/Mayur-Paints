import express from 'express'
import Paint from '../models/Paint.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// GET /api/paints - List all paints with filters
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, finish } = req.query
    
    let query = {}

    // Search filter
    if (search) {
      query.$text = { $search: search }
    }

    // Category filter
    if (category) {
      query.category = category
    }

    // Finish filter
    if (finish) {
      query.finish = finish
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const paints = await Paint.find(query).sort({ createdAt: -1 })

    res.json({
      success: true,
      count: paints.length,
      data: paints
    })
  } catch (error) {
    console.error('Get paints error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch paints',
      error: error.message
    })
  }
})

// GET /api/paints/:id - Get single paint
router.get('/:id', async (req, res) => {
  try {
    const paint = await Paint.findById(req.params.id)

    if (!paint) {
      return res.status(404).json({
        success: false,
        message: 'Paint not found'
      })
    }

    res.json({
      success: true,
      data: paint
    })
  } catch (error) {
    console.error('Get paint error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch paint',
      error: error.message
    })
  }
})

// POST /api/paints - Create paint (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const paint = await Paint.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Paint created successfully',
      data: paint
    })
  } catch (error) {
    console.error('Create paint error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create paint',
      error: error.message
    })
  }
})

// PUT /api/paints/:id - Update paint (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const paint = await Paint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!paint) {
      return res.status(404).json({
        success: false,
        message: 'Paint not found'
      })
    }

    res.json({
      success: true,
      message: 'Paint updated successfully',
      data: paint
    })
  } catch (error) {
    console.error('Update paint error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update paint',
      error: error.message
    })
  }
})

// DELETE /api/paints/:id - Delete paint (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const paint = await Paint.findByIdAndDelete(req.params.id)

    if (!paint) {
      return res.status(404).json({
        success: false,
        message: 'Paint not found'
      })
    }

    res.json({
      success: true,
      message: 'Paint deleted successfully'
    })
  } catch (error) {
    console.error('Delete paint error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete paint',
      error: error.message
    })
  }
})

export default router
