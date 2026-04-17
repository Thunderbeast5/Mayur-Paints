import express from 'express'
import QRCode from 'qrcode'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Payment from '../models/Payment.js'
import Order from '../models/Order.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/payment-screenshots'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'))
    }
  }
})

// POST /api/payments/generate-qr - Generate QR code for payment
router.post('/generate-qr', authenticateToken, async (req, res) => {
  try {
    const { orderId, amount, shippingAddress } = req.body
    
    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and amount are required'
      })
    }
    
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required',
        requiresAddress: true
      })
    }
    
    // Verify order exists and belongs to user
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      })
    }
    
    // Check if payment already exists for this order
    let payment = await Payment.findOne({ order: orderId })
    
    if (payment && payment.status !== 'rejected') {
      return res.json({
        success: true,
        message: 'Payment already exists',
        data: payment
      })
    }
    
    // Generate payment number
    const paymentNumber = Payment.generatePaymentNumber()
    
    // Create payment data for QR code
    const paymentData = {
      paymentNumber,
      amount,
      orderId,
      merchantName: 'Mayur Paints',
      upiId: process.env.UPI_ID || 'mayurpaints@upi',
      note: `Payment for Order #${order.orderNumber}`
    }
    
    // Generate UPI payment string
    const upiString = `upi://pay?pa=${paymentData.upiId}&pn=${encodeURIComponent(paymentData.merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(paymentData.note)}`
    
    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(upiString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2
    })
    
    // Create or update payment record
    if (payment && payment.status === 'rejected') {
      // Update existing rejected payment
      payment.paymentNumber = paymentNumber
      payment.amount = amount
      payment.qrCode = qrCodeDataURL
      payment.status = 'pending'
      payment.shippingAddress = shippingAddress
      payment.paymentScreenshot = null
      payment.rejectionReason = null
      payment.rejectedAt = null
      await payment.addTimelineEntry('pending', 'Payment regenerated after rejection', req.user._id)
    } else {
      // Create new payment
      payment = await Payment.create({
        paymentNumber,
        order: orderId,
        user: req.user._id,
        amount,
        qrCode: qrCodeDataURL,
        shippingAddress,
        paymentDetails: {
          upiId: paymentData.upiId
        },
        timeline: [{
          status: 'pending',
          note: 'Payment initiated',
          updatedBy: req.user._id
        }]
      })
    }
    
    await payment.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'order' }
    ])
    
    res.json({
      success: true,
      message: 'QR code generated successfully',
      data: payment
    })
  } catch (error) {
    console.error('Generate QR error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    })
  }
})

// POST /api/payments/:id/upload-screenshot - Upload payment screenshot
router.post('/:id/upload-screenshot', authenticateToken, upload.single('screenshot'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      })
    }
    
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      })
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Screenshot file is required'
      })
    }
    
    // Delete old screenshot if exists
    if (payment.paymentScreenshot) {
      const oldPath = payment.paymentScreenshot
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }
    
    payment.paymentScreenshot = req.file.path
    payment.status = 'submitted'
    payment.submittedAt = new Date()
    await payment.addTimelineEntry('submitted', 'Payment screenshot uploaded', req.user._id)
    
    await payment.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'order' }
    ])
    
    res.json({
      success: true,
      message: 'Screenshot uploaded successfully. Payment pending admin verification.',
      data: payment
    })
  } catch (error) {
    console.error('Upload screenshot error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to upload screenshot',
      error: error.message
    })
  }
})

// GET /api/payments/my-payments - Get user's payments
router.get('/my-payments', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    
    const query = { user: req.user._id }
    
    if (status) {
      query.status = status
    }
    
    const payments = await Payment.find(query)
      .populate([
        { path: 'user', select: 'name email phone' },
        { path: 'order' }
      ])
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
    
    const total = await Payment.countDocuments(query)
    
    res.json({
      success: true,
      count: payments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: payments
    })
  } catch (error) {
    console.error('Get my payments error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    })
  }
})

// GET /api/payments/:id - Get payment details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate([
        { path: 'user', select: 'name email phone' },
        { path: 'order' },
        { path: 'verifiedBy', select: 'name email' }
      ])
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      })
    }
    
    // Check authorization
    if (payment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      })
    }
    
    res.json({
      success: true,
      data: payment
    })
  } catch (error) {
    console.error('Get payment error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message
    })
  }
})

// GET /api/payments/admin/pending - Get all pending payments (Admin only)
router.get('/admin/pending', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    
    const payments = await Payment.find({ status: 'submitted' })
      .populate([
        { path: 'user', select: 'name email phone' },
        { path: 'order' }
      ])
      .sort({ submittedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
    
    const total = await Payment.countDocuments({ status: 'submitted' })
    
    res.json({
      success: true,
      count: payments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: payments
    })
  } catch (error) {
    console.error('Get pending payments error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending payments',
      error: error.message
    })
  }
})

// GET /api/payments/admin/all - Get all payments (Admin only)
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    
    const query = {}
    if (status) {
      query.status = status
    }
    
    const payments = await Payment.find(query)
      .populate([
        { path: 'user', select: 'name email phone' },
        { path: 'order' },
        { path: 'verifiedBy', select: 'name email' }
      ])
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
    
    const total = await Payment.countDocuments(query)
    
    res.json({
      success: true,
      count: payments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: payments
    })
  } catch (error) {
    console.error('Get all payments error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    })
  }
})

// PUT /api/payments/:id/verify - Verify payment (Admin only)
router.put('/:id/verify', authenticateToken, isAdmin, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      })
    }
    
    if (payment.status !== 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Payment is not in submitted state'
      })
    }
    
    payment.status = 'verified'
    payment.verifiedAt = new Date()
    payment.verifiedBy = req.user._id
    await payment.addTimelineEntry('verified', 'Payment verified by admin', req.user._id)
    
    // Update order status
    const order = await Order.findById(payment.order)
    if (order) {
      order.paymentStatus = 'paid'
      order.status = 'confirmed'
      await order.save()
    }
    
    await payment.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'order' },
      { path: 'verifiedBy', select: 'name email' }
    ])
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: payment
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    })
  }
})

// PUT /api/payments/:id/reject - Reject payment (Admin only)
router.put('/:id/reject', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      })
    }
    
    const payment = await Payment.findById(req.params.id)
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      })
    }
    
    if (payment.status !== 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Payment is not in submitted state'
      })
    }
    
    payment.status = 'rejected'
    payment.rejectionReason = reason
    payment.rejectedAt = new Date()
    await payment.addTimelineEntry('rejected', `Payment rejected: ${reason}`, req.user._id)
    
    // Update order status
    const order = await Order.findById(payment.order)
    if (order) {
      order.status = 'cancelled'
      order.paymentStatus = 'failed'
      await order.save()
    }
    
    await payment.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'order' },
      { path: 'verifiedBy', select: 'name email' }
    ])
    
    res.json({
      success: true,
      message: 'Payment rejected',
      data: payment
    })
  } catch (error) {
    console.error('Reject payment error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reject payment',
      error: error.message
    })
  }
})

// Serve uploaded screenshots
router.get('/screenshot/:filename', (req, res) => {
  const filepath = path.join(process.cwd(), 'uploads', 'payment-screenshots', req.params.filename)
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath)
  } else {
    res.status(404).json({
      success: false,
      message: 'Screenshot not found'
    })
  }
})

export default router
