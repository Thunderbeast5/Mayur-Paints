import mongoose from 'mongoose'

const hardwareSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hardware name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Brushes', 'Rollers', 'Tape', 'Tools', 'Accessories']
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
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'https://placehold.co/400x400/64748B/white?text=Hardware'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Text index for search
hardwareSchema.index({ name: 'text', brand: 'text', description: 'text' })

export default mongoose.model('Hardware', hardwareSchema)
