import express from 'express'
import Paint from '../models/Paint.js'
import Hardware from '../models/Hardware.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// GET /api/inventory - Get all inventory with stock levels
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const paints = await Paint.find().select('name brand category stock price').lean()
    const hardware = await Hardware.find().select('name brand category stock price').lean()

    // Add type and low stock flag
    const paintsWithType = paints.map(p => ({
      ...p,
      type: 'paint',
      lowStock: p.stock < 10
    }))

    const hardwareWithType = hardware.map(h => ({
      ...h,
      type: 'hardware',
      lowStock: h.stock < 10
    }))

    const allInventory = [...paintsWithType, ...hardwareWithType]

    // Calculate stats
    const stats = {
      totalItems: allInventory.length,
      totalPaints: paints.length,
      totalHardware: hardware.length,
      lowStockItems: allInventory.filter(item => item.lowStock).length,
      outOfStockItems: allInventory.filter(item => item.stock === 0).length
    }

    res.json({
      success: true,
      stats,
      data: allInventory
    })
  } catch (error) {
    console.error('Get inventory error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: error.message
    })
  }
})

// PUT /api/inventory/:type/:id/stock - Update stock (Admin only)
router.put('/:type/:id/stock', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { type, id } = req.params
    const { stock } = req.body

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock quantity is required'
      })
    }

    let product

    if (type === 'paint') {
      product = await Paint.findByIdAndUpdate(
        id,
        { stock: Number(stock) },
        { new: true }
      )
    } else if (type === 'hardware') {
      product = await Hardware.findByIdAndUpdate(
        id,
        { stock: Number(stock) },
        { new: true }
      )
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be "paint" or "hardware"'
      })
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: product
    })
  } catch (error) {
    console.error('Update stock error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    })
  }
})

export default router
