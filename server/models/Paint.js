import mongoose from 'mongoose'

const paintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Paint name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  color: {
    type: String,
    required: [true, 'Color name is required'],
    trim: true
  },
  hexCode: {
    type: String,
    required: [true, 'Hex code is required'],
    match: /^#[0-9A-Fa-f]{6}$/
  },
  finish: {
    type: String,
    enum: ['matte', 'glossy', 'satin', 'eggshell'],
    required: [true, 'Finish type is required']
  },
  size: {
    type: String,
    required: [true, 'Size is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Interior', 'Exterior', 'Wood', 'Metal']
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'https://placehold.co/400x400/E85D26/white?text=Paint'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Text index for search
paintSchema.index({ name: 'text', brand: 'text', color: 'text', description: 'text' })

export default mongoose.model('Paint', paintSchema)
