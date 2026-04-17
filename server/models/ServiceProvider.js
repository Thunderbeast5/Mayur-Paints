import mongoose from 'mongoose'

const serviceProviderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  gst: {
    number: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  services: [{
    type: String,
    enum: [
      'Interior Painting',
      'Exterior Painting',
      'Texture Application',
      'Waterproofing',
      'Pipe Installation',
      'Leak Repair',
      'Bathroom Fitting',
      'Water Tank Cleaning',
      'Wiring & Rewiring',
      'Switch Installation',
      'Appliance Installation',
      'Safety Inspection',
      'Furniture Assembly',
      'Door Installation',
      'Custom Woodwork'
    ]
  }],
  serviceAreas: [{
    area: String,
    pincode: String
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: String,
    city: {
      type: String,
      default: 'Pune'
    }
  },
  certifications: [{
    name: String,
    issuer: String,
    url: String,
    expiryDate: Date
  }],
  experience: {
    years: {
      type: Number,
      min: 0
    },
    description: String
  },
  pricing: {
    hourlyRate: Number,
    minimumCharge: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  availability: {
    schedule: {
      monday: { available: Boolean, hours: String },
      tuesday: { available: Boolean, hours: String },
      wednesday: { available: Boolean, hours: String },
      thursday: { available: Boolean, hours: String },
      friday: { available: Boolean, hours: String },
      saturday: { available: Boolean, hours: String },
      sunday: { available: Boolean, hours: String }
    },
    bookingBuffer: {
      type: Number,
      default: 24 // hours
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  stats: {
    completedJobs: {
      type: Number,
      default: 0
    },
    cancelledJobs: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: Number, // in minutes
      default: 0
    }
  },
  documents: {
    idProof: String,
    addressProof: String,
    policeClearance: String
  },
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    accountHolderName: String,
    upi: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Geospatial index for location-based queries
serviceProviderSchema.index({ 'location.coordinates': '2dsphere' })
serviceProviderSchema.index({ services: 1 })
serviceProviderSchema.index({ 'rating.average': -1 })
serviceProviderSchema.index({ isVerified: 1, isActive: 1 })

// Method to calculate provider score
serviceProviderSchema.methods.calculateScore = function(userLocation, budget) {
  let score = 0
  
  // Rating weight: 40%
  score += (this.rating.average / 5) * 40
  
  // Completed jobs weight: 20%
  const jobScore = Math.min(this.stats.completedJobs / 100, 1) * 20
  score += jobScore
  
  // Distance weight: 20% (closer is better)
  if (userLocation) {
    const distance = this.calculateDistance(userLocation)
    const distanceScore = Math.max(0, (10 - distance) / 10) * 20
    score += distanceScore
  }
  
  // Price match weight: 10%
  if (budget && this.pricing.hourlyRate) {
    const priceDiff = Math.abs(this.pricing.hourlyRate - budget)
    const priceScore = Math.max(0, (1 - priceDiff / budget)) * 10
    score += priceScore
  }
  
  // Response time weight: 10%
  const responseScore = Math.max(0, (60 - this.stats.responseTime) / 60) * 10
  score += responseScore
  
  return Math.round(score)
}

// Method to calculate distance from user location
serviceProviderSchema.methods.calculateDistance = function(userCoordinates) {
  // Haversine formula
  const R = 6371 // Earth's radius in km
  const lat1 = userCoordinates[1] * Math.PI / 180
  const lat2 = this.location.coordinates[1] * Math.PI / 180
  const deltaLat = (this.location.coordinates[1] - userCoordinates[1]) * Math.PI / 180
  const deltaLon = (this.location.coordinates[0] - userCoordinates[0]) * Math.PI / 180
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c // Distance in km
}

// Method to update rating
serviceProviderSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.count
  this.rating.count += 1
  this.rating.average = (totalRating + newRating) / this.rating.count
  return this.save()
}

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema)

export default ServiceProvider
