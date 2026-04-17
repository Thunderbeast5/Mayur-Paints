import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['register', 'login', 'reset'],
    default: 'login'
  },
  attempts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // TTL: 5 minutes (300 seconds)
  }
})

// Index for efficient queries
otpSchema.index({ email: 1, type: 1 })
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 })

export default mongoose.model('Otp', otpSchema)
