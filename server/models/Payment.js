import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  paymentNumber: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    default: 'QR Code'
  },
  qrCode: {
    type: String, // Base64 encoded QR code image
    required: true
  },
  paymentScreenshot: {
    type: String, // Path to uploaded screenshot
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'verified', 'rejected', 'completed'],
    default: 'pending'
  },
  submittedAt: {
    type: Date
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String
  },
  rejectedAt: {
    type: Date
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  paymentDetails: {
    upiId: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
})

// Indexes
paymentSchema.index({ user: 1, createdAt: -1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ order: 1 })

// Generate payment number
paymentSchema.statics.generatePaymentNumber = function() {
  const prefix = 'PAY'
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}${timestamp}${random}`
}

// Method to add timeline entry
paymentSchema.methods.addTimelineEntry = function(status, note, userId) {
  this.timeline.push({
    status,
    note,
    updatedBy: userId
  })
  return this.save()
}

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment
