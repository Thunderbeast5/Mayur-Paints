import express from 'express'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Product from '../models/Product.js'
import { authenticate, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/analytics
// @desc    Get analytics data for admin dashboard
// @access  Admin
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    // Get all orders
    const orders = await Order.find().lean()
    
    // Calculate totals
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    
    // Get customer count
    const totalCustomers = await User.countDocuments({ role: 'user' })
    
    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const recentOrders = orders.filter(o => new Date(o.createdAt) >= sixMonthsAgo)
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const revenueByMonth = {}
    
    recentOrders.forEach(order => {
      const date = new Date(order.createdAt)
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + (order.total || 0)
    })
    
    const revenueData = Object.entries(revenueByMonth)
      .slice(-6)
      .map(([month, value]) => ({ month, value: Math.round(value) }))
    
    // If no data, create dummy data
    if (revenueData.length === 0) {
      const now = new Date()
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        revenueData.push({
          month: `${monthNames[date.getMonth()]}`,
          value: 0
        })
      }
    }
    
    // Top selling products
    const productSales = {}
    orders.forEach(order => {
      order.items?.forEach(item => {
        const key = item.name || item.productId
        if (!productSales[key]) {
          productSales[key] = { name: item.name, units: 0, revenue: 0 }
        }
        productSales[key].units += item.qty || 1
        productSales[key].revenue += (item.price || 0) * (item.qty || 1)
      })
    })
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
    
    // Order status breakdown
    const statusBreakdown = {}
    orders.forEach(order => {
      const status = order.status || 'Processing'
      statusBreakdown[status] = (statusBreakdown[status] || 0) + 1
    })
    
    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue),
        avgOrderValue,
        totalCustomers,
        revenueData,
        topProducts,
        statusBreakdown
      }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' })
  }
})

export default router
