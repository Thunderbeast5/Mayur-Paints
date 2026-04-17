import express from 'express'
import Hardware from '../models/Hardware.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// GET /api/hardware - List all hardware with filters
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query
    
    let query = {}

    // Search filter
    if (search) {
      query.$text = { $search: search }
    }

    // Category filter
    if (category) {
      query.category = category
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const hardware = await Hardware.find(query).sort({ createdAt: -1 })

    res.json({
      success: true,
      count: hardware.length,
      data: hardware
    })
  } catch (error) {
    console.error('Get hardware error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hardware',
      error: error.message
    })
  }
})

// GET /api/hardware/:id - Get single hardware
router.get('/:id', async (req, res) => {
  try {
    const hardware = await Hardware.findById(req.params.id)

    if (!hardware) {
      return res.status(404).json({
        success: false,
        message: 'Hardware not found'
      })
    }

    res.json({
      success: true,
      data: hardware
    })
  } catch (error) {
    console.error('Get hardware error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hardware',
      error: error.message
    })
  }
})

// POST /api/hardware - Create hardware (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const hardware = await Hardware.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Hardware created successfully',
      data: hardware
    })
  } catch (error) {
    console.error('Create hardware error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create hardware',
      error: error.message
    })
  }
})

// PUT /api/hardware/:id - Update hardware (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const hardware = await Hardware.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!hardware) {
      return res.status(404).json({
        success: false,
        message: 'Hardware not found'
      })
    }

    res.json({
      success: true,
      message: 'Hardware updated successfully',
      data: hardware
    })
  } catch (error) {
    console.error('Update hardware error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update hardware',
      error: error.message
    })
  }
})

// DELETE /api/hardware/:id - Delete hardware (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const hardware = await Hardware.findByIdAndDelete(req.params.id)

    if (!hardware) {
      return res.status(404).json({
        success: false,
        message: 'Hardware not found'
      })
    }

    res.json({
      success: true,
      message: 'Hardware deleted successfully'
    })
  } catch (error) {
    console.error('Delete hardware error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete hardware',
      error: error.message
    })
  }
})

export default router
