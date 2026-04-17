import express from 'express'
import User from '../models/User.js'
import Order from '../models/Order.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// GET /api/users - List all users with order stats (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean()

    // Get order stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id, status: { $ne: 'cancelled' } })
        
        const orderCount = orders.length
        const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)

        return {
          ...user,
          orderCount,
          totalSpent
        }
      })
    )

    res.json({
      success: true,
      count: usersWithStats.length,
      data: usersWithStats
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    })
  }
})

// GET /api/users/:id - Get single user (Admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Get user's orders
    const orders = await Order.find({ user: user._id })
    const orderCount = orders.length
    const totalSpent = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0)

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        orderCount,
        totalSpent,
        recentOrders: orders.slice(0, 5)
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    })
  }
})

export default router
