import mongoose from 'mongoose'

const serviceBookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    },
    pincode: String
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  estimatedDuration: {
    type: Number, // in hours
    required: true
  },
  pricing: {
    estimatedCost: {
      type: Number,
      required: true
    },
    advanceAmount: {
      type: Number,
      required: true
    },
    remainingAmount: {
      type: Number,
      required: true
    },
    finalCost: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  payment: {
    advance: {
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
      },
      transactionId: String,
      paidAt: Date,
      method: String
    },
    remaining: {
      status: {
        type: String,
        enum: ['pending', 'escrowed', 'released', 'refunded'],
        default: 'pending'
      },
      transactionId: String,
      paidAt: Date,
      releasedAt: Date,
      method: String
    }
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
      'disputed'
    ],
    default: 'pending'
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
  }],
  completion: {
    completedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationCode: String,
    photos: [String],
    notes: String
  },
  rating: {
    customerRating: {
      rating: Number,
      review: String,
      ratedAt: Date
    },
    providerRating: {
      rating: Number,
      review: String,
      ratedAt: Date
    }
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['customer', 'provider', 'admin']
    },
    reason: String,
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    }
  },
  dispute: {
    raisedBy: {
      type: String,
      enum: ['customer', 'provider']
    },
    reason: String,
    description: String,
    raisedAt: Date,
    resolvedAt: Date,
    resolution: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
})

// Indexes
serviceBookingSchema.index({ customer: 1, createdAt: -1 })
serviceBookingSchema.index({ provider: 1, createdAt: -1 })
serviceBookingSchema.index({ status: 1 })
serviceBookingSchema.index({ scheduledDate: 1 })

// Generate booking number
serviceBookingSchema.statics.generateBookingNumber = function() {
  const prefix = 'SB'
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}${timestamp}${random}`
}

// Method to calculate advance amount (30%)
serviceBookingSchema.methods.calculateAdvance = function() {
  return Math.round(this.pricing.estimatedCost * 0.3)
}

// Method to add timeline entry
serviceBookingSchema.methods.addTimelineEntry = function(status, note, userId) {
  this.timeline.push({
    status,
    note,
    updatedBy: userId
  })
  return this.save()
}

const ServiceBooking = mongoose.model('ServiceBooking', serviceBookingSchema)

export default ServiceBooking
