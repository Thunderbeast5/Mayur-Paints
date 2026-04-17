import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Product code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [20, 'Code cannot exceed 20 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Interior', 'Exterior', 'Waterproofing', 'Primers', 'Hardware'],
  },
  subCategory: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['paint', 'hardware'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  mrp: {
    type: Number,
    min: [0, 'MRP cannot be negative']
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    trim: true
  },
  finish: {
    type: String,
    enum: ['Matte', 'Satin', 'Gloss', 'Semi-Gloss'],
    default: 'Matte'
  },
  color: {
    type: String,
    trim: true
  },
  shade: {
    type: String,
    trim: true
  },
  coverage: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  features: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }],
  img: {
    type: String,
    required: [true, 'Product image is required'],
    trim: true
  },
  badge: {
    type: String,
    enum: ['Bestseller', 'New', 'Popular', 'Premium', 'Trending', 'Value']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  specifications: {
    warranty: String,
    application: String,
    dryingTime: String,
    recoatTime: String,
    coveragePerLiter: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for discount calculation
productSchema.virtual('discount').get(function() {
  if (this.mrp && this.price < this.mrp) {
    return Math.round(((this.mrp - this.price) / this.mrp) * 100)
  }
  return 0
})

// Text search index
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  shade: 'text',
  code: 'text'
})

// Compound indexes for common queries
productSchema.index({ category: 1, price: 1 })
productSchema.index({ type: 1, isActive: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ badge: 1, isActive: 1 })

// Pre-save middleware
productSchema.pre('save', function(next) {
  if (this.isModified('price') && this.mrp && this.price > this.mrp) {
    this.mrp = this.price
  }
  next()
})

// Static methods
productSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true })
}

productSchema.statics.findBestsellers = function(limit = 10) {
  return this.find({ 
    isActive: true,
    badge: { $in: ['Bestseller', 'Popular'] }
  }).sort({ rating: -1 }).limit(limit)
}

productSchema.statics.searchProducts = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    isActive: true,
    ...filters
  }
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
}

const Product = mongoose.model('Product', productSchema)

export default Product
