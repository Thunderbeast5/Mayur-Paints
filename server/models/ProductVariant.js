import mongoose from 'mongoose'

const variantSchema = new mongoose.Schema({
  baseProduct: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'productType',
    required: true
  },
  productType: {
    type: String,
    required: true,
    enum: ['Paint', 'Hardware']
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  attributes: {
    // For Paints
    color: {
      name: String,
      hex: String
    },
    finish: {
      type: String,
      enum: ['matte', 'glossy', 'satin', 'eggshell']
    },
    volume: {
      type: String,
      enum: ['1L', '4L', '10L', '20L']
    },
    sheen: {
      type: Number,
      min: 0,
      max: 1
    },
    // For Hardware
    size: String,
    material: String,
    // Dynamic attributes stored as key-value pairs
    custom: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  images: {
    main: String,
    swatch: String,
    room: String,
    gallery: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  weight: Number, // in grams
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}, {
  timestamps: true
})

// Indexes for fast queries
variantSchema.index({ baseProduct: 1, productType: 1 })
variantSchema.index({ sku: 1 })
variantSchema.index({ 'attributes.color.hex': 1 })
variantSchema.index({ price: 1 })
variantSchema.index({ stock: 1 })

// Virtual for discount percentage
variantSchema.virtual('discountPercent').get(function() {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100)
  }
  return 0
})

// Method to check if in stock
variantSchema.methods.isInStock = function() {
  return this.stock > 0 && this.isActive
}

// Method to generate SKU
variantSchema.statics.generateSKU = function(brand, category, attributes) {
  const brandCode = brand.substring(0, 2).toUpperCase()
  const categoryCode = category.substring(0, 2).toUpperCase()
  const colorCode = attributes.color?.name?.substring(0, 2).toUpperCase() || 'XX'
  const finishCode = attributes.finish?.substring(0, 1).toUpperCase() || 'X'
  const volumeCode = attributes.volume?.replace('L', '') || '0'
  const timestamp = Date.now().toString().slice(-4)
  
  return `${brandCode}-${categoryCode}-${colorCode}-${finishCode}${volumeCode}-${timestamp}`
}

const ProductVariant = mongoose.model('ProductVariant', variantSchema)

export default ProductVariant
