import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'items.productType',
      required: true
    },
    productType: {
      type: String,
      required: true,
      enum: ['Paint', 'Hardware']
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

// Index for fast user lookups
wishlistSchema.index({ user: 1 })

// Method to add item
wishlistSchema.methods.addItem = function(productId, productType, variantId = null) {
  const existingItem = this.items.find(
    item => item.product.toString() === productId.toString() && 
            (!variantId || item.variant?.toString() === variantId.toString())
  )
  
  if (!existingItem) {
    this.items.push({
      product: productId,
      productType,
      variant: variantId
    })
  }
  
  return this.save()
}

// Method to remove item
wishlistSchema.methods.removeItem = function(productId, variantId = null) {
  this.items = this.items.filter(
    item => !(item.product.toString() === productId.toString() && 
              (!variantId || item.variant?.toString() === variantId.toString()))
  )
  
  return this.save()
}

// Method to check if item exists
wishlistSchema.methods.hasItem = function(productId, variantId = null) {
  return this.items.some(
    item => item.product.toString() === productId.toString() && 
            (!variantId || item.variant?.toString() === variantId.toString())
  )
}

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

export default Wishlist
