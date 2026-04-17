import express from 'express'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Paint from '../models/Paint.js'
import Hardware from '../models/Hardware.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// GET /api/analytics - Get analytics data (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    const totalRevenue = revenueResult[0]?.total || 0

    // Total orders
    const totalOrders = await Order.countDocuments()

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    }
    ordersByStatus.forEach(item => {
      statusCounts[item._id] = item.count
    })

    // Top 5 selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          productType: { $first: '$items.productType' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ])

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    // Format monthly revenue
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: item.revenue,
      orders: item.orders
    }))

    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'user' })

    // Customer spending
    const customerSpending = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ])

    // Populate customer details
    const topCustomers = await User.populate(customerSpending, {
      path: '_id',
      select: 'name email'
    })

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        ordersByStatus: statusCounts,
        topProducts,
        monthlyRevenue: formattedMonthlyRevenue,
        totalCustomers,
        topCustomers: topCustomers.map(c => ({
          customer: c._id,
          totalSpent: c.totalSpent,
          orderCount: c.orderCount
        }))
      }
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    })
  }
})

export default router
