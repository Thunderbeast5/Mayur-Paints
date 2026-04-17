import Order from '../models/Order.js'
import User from '../models/User.js'

// @desc    Get orders (all for admin, user's own for user)
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const { userId, status, page = 1, limit = 20 } = req.query
    const query = {}

    // Non-admins can only see their own orders
    if (req.user && req.user.role !== 'admin') {
      query.userId = req.user._id
    } else if (userId) {
      query.userId = userId
    }

    if (status) query.status = status

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Order.countDocuments(query)
    ])

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ success: false, message: 'Error fetching orders' })
  }
}

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean()
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }
    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order' })
  }
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod = 'COD' } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item' })
    }

    // Get user details
    const userIdToUse = userId || req.user?._id
    const user = await User.findById(userIdToUse)

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const tax = Math.round(subtotal * 0.18)
    const shipping = subtotal > 2000 ? 0 : 150
    const total = subtotal + tax + shipping

    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase()

    // Normalize shipping address keys  
    const addr = shippingAddress || {}
    const normalizedAddr = {
      street: addr.addressLine1 || addr.street || 'N/A',
      city: addr.city || 'N/A',
      state: addr.state || 'N/A',
      pincode: addr.pincode || '000000',
      phone: addr.phone || user?.phone || 'N/A',
    }

    const order = await Order.create({
      orderId,
      userId: userIdToUse,
      customerName: user?.name || addr.name || 'Customer',
      customerEmail: user?.email || 'customer@example.com',
      customerPhone: user?.phone || addr.phone || 'N/A',
      items: items.map(item => ({
        productId: item.productId || item.id,
        name: item.name,
        type: item.type || 'paint',
        qty: item.qty,
        price: item.price,
      })),
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      shippingAddress: normalizedAddr,
    })

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ success: false, message: 'Error creating order', details: error.message })
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded']
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, $push: { statusHistory: { status, timestamp: new Date() } } },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    res.json({ success: true, message: 'Order status updated', data: order })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating order status' })
  }
}
