import express from 'express'
import ServiceBooking from '../models/ServiceBooking.js'
import ServiceProvider from '../models/ServiceProvider.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// POST /api/service-bookings - Create a new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      providerId,
      serviceType,
      description,
      location,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
      estimatedCost
    } = req.body
    
    // Validate required fields
    if (!providerId || !serviceType || !description || !location || !scheduledDate || !scheduledTime || !estimatedCost) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      })
    }
    
    // Verify provider exists
    const provider = await ServiceProvider.findById(providerId)
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      })
    }
    
    // Generate booking number
    const bookingNumber = ServiceBooking.generateBookingNumber()
    
    // Calculate advance (30%)
    const advanceAmount = Math.round(estimatedCost * 0.3)
    const remainingAmount = estimatedCost - advanceAmount
    
    const booking = await ServiceBooking.create({
      bookingNumber,
      customer: req.user._id,
      provider: providerId,
      serviceType,
      description,
      location,
      scheduledDate,
      scheduledTime,
      estimatedDuration: estimatedDuration || 2,
      pricing: {
        estimatedCost,
        advanceAmount,
        remainingAmount
      },
      timeline: [{
        status: 'pending',
        note: 'Booking created',
        updatedBy: req.user._id
      }]
    })
    
    await booking.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'provider', populate: { path: 'user', select: 'name email phone' } }
    ])
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    })
  } catch (error) {
    console.error('Create booking error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    })
  }
})

// GET /api/service-bookings - Get user's bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    
    const query = { customer: req.user._id }
    
    if (status) {
      query.status = status
    }
    
    const bookings = await ServiceBooking.find(query)
      .populate([
        { path: 'customer', select: 'name email phone' },
        { path: 'provider', populate: { path: 'user', select: 'name email phone' } }
      ])
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
    
    const total = await ServiceBooking.countDocuments(query)
    
    res.json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: bookings
    })
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    })
  }
})

// GET /api/service-bookings/:id - Get booking details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await ServiceBooking.findById(req.params.id)
      .populate([
        { path: 'customer', select: 'name email phone' },
        { path: 'provider', populate: { path: 'user', select: 'name email phone' } }
      ])
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }
    
    // Check if user is authorized to view this booking
    if (booking.customer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      })
    }
    
    res.json({
      success: true,
      data: booking
    })
  } catch (error) {
    console.error('Get booking error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    })
  }
})

// PUT /api/service-bookings/:id/status - Update booking status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, note } = req.body
    
    const booking = await ServiceBooking.findById(req.params.id)
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }
    
    booking.status = status
    await booking.addTimelineEntry(status, note, req.user._id)
    
    await booking.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'provider', populate: { path: 'user', select: 'name email phone' } }
    ])
    
    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking
    })
  } catch (error) {
    console.error('Update booking status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    })
  }
})

// PUT /api/service-bookings/:id/payment - Update payment status
router.put('/:id/payment', authenticateToken, async (req, res) => {
  try {
    const { type, status, transactionId, method } = req.body
    
    const booking = await ServiceBooking.findById(req.params.id)
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }
    
    if (type === 'advance') {
      booking.payment.advance.status = status
      booking.payment.advance.transactionId = transactionId
      booking.payment.advance.method = method
      if (status === 'paid') {
        booking.payment.advance.paidAt = new Date()
        booking.status = 'confirmed'
        await booking.addTimelineEntry('confirmed', 'Advance payment received', req.user._id)
      }
    } else if (type === 'remaining') {
      booking.payment.remaining.status = status
      booking.payment.remaining.transactionId = transactionId
      booking.payment.remaining.method = method
      if (status === 'escrowed') {
        booking.payment.remaining.paidAt = new Date()
      } else if (status === 'released') {
        booking.payment.remaining.releasedAt = new Date()
      }
    }
    
    await booking.save()
    
    res.json({
      success: true,
      message: 'Payment status updated',
      data: booking
    })
  } catch (error) {
    console.error('Update payment error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update payment',
      error: error.message
    })
  }
})

// POST /api/service-bookings/:id/complete - Mark booking as complete
router.post('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { verificationCode, photos, notes, finalCost } = req.body
    
    const booking = await ServiceBooking.findById(req.params.id)
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }
    
    booking.status = 'completed'
    booking.completion = {
      completedAt: new Date(),
      verifiedBy: req.user._id,
      verificationCode,
      photos: photos || [],
      notes
    }
    
    if (finalCost) {
      booking.pricing.finalCost = finalCost
    }
    
    await booking.addTimelineEntry('completed', 'Job completed', req.user._id)
    
    // Update provider stats
    const provider = await ServiceProvider.findById(booking.provider)
    if (provider) {
      provider.stats.completedJobs += 1
      provider.stats.totalEarnings += finalCost || booking.pricing.estimatedCost
      await provider.save()
    }
    
    res.json({
      success: true,
      message: 'Booking marked as complete',
      data: booking
    })
  } catch (error) {
    console.error('Complete booking error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to complete booking',
      error: error.message
    })
  }
})

// POST /api/service-bookings/:id/rate - Rate the service
router.post('/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { rating, review, ratingType } = req.body
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }
    
    const booking = await ServiceBooking.findById(req.params.id)
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }
    
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed bookings'
      })
    }
    
    if (ratingType === 'customer') {
      booking.rating.customerRating = {
        rating,
        review,
        ratedAt: new Date()
      }
      
      // Update provider rating
      const provider = await ServiceProvider.findById(booking.provider)
      if (provider) {
        await provider.updateRating(rating)
      }
    } else if (ratingType === 'provider') {
      booking.rating.providerRating = {
        rating,
        review,
        ratedAt: new Date()
      }
    }
    
    await booking.save()
    
    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: booking
    })
  } catch (error) {
    console.error('Rate booking error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating',
      error: error.message
    })
  }
})

// POST /api/service-bookings/:id/cancel - Cancel booking
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body
    
    const booking = await ServiceBooking.findById(req.params.id)
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      })
    }
    
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this booking'
      })
    }
    
    booking.status = 'cancelled'
    booking.cancellation = {
      cancelledBy: 'customer',
      reason,
      cancelledAt: new Date()
    }
    
    await booking.addTimelineEntry('cancelled', `Cancelled: ${reason}`, req.user._id)
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    })
  } catch (error) {
    console.error('Cancel booking error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    })
  }
})

export default router
