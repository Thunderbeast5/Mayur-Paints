import Product from '../models/Product.js'
import { validateObjectId } from '../middleware/validation.js'

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access   Public
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      search,
      category,
      type,
      minPrice,
      maxPrice,
      rating
    } = req.query

    // Build query
    const query = { isActive: true }

    // Search functionality
    if (search) {
      query.$text = { $search: search }
    }

    // Category filter
    if (category) {
      query.category = category
    }

    // Type filter
    if (type) {
      query.type = type
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseFloat(minPrice)
      if (maxPrice) query.price.$lte = parseFloat(maxPrice)
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) }
    }

    // Parse sort parameter
    const sortOptions = {}
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort
    const sortOrder = sort.startsWith('-') ? -1 : 1
    
    if (['name', 'price', 'rating', 'createdAt'].includes(sortField)) {
      sortOptions[sortField] = sortOrder
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v')
      .lean()

    // Get total count for pagination
    const total = await Product.countDocuments(query)

    // Get categories for filters
    const categories = await Product.distinct('category', { isActive: true })
    
    // Get price range
    const priceRange = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } }
    ])

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total,
          hasNext: skip + products.length < total,
          hasPrev: page > 1
        },
        filters: {
          categories: categories.sort(),
          priceRange: priceRange[0] || { minPrice: 0, maxPrice: 10000 }
        }
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access   Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('-__v')
      .lean()

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: 'PRODUCT_NOT_FOUND'
      })
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product is not available',
        error: 'PRODUCT_INACTIVE'
      })
    }

    // Get related products
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
    .limit(6)
    .select('name code price img category rating badge')
    .lean()

    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    })
  } catch (error) {
    console.error('Get product by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access   Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params
    const { page = 1, limit = 10, sort = '-rating' } = req.query

    const query = {
      category: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
      isActive: true
    }

    const sortOptions = {}
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort
    const sortOrder = sort.startsWith('-') ? -1 : 1
    
    if (['name', 'price', 'rating', 'createdAt'].includes(sortField)) {
      sortOptions[sortField] = sortOrder
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('name code price img category rating badge reviews shade color finish')
      .lean()

    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total,
          hasNext: skip + products.length < total,
          hasPrev: page > 1
        },
        category
      }
    })
  } catch (error) {
    console.error('Get products by category error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Search products
// @route   GET /api/products/search
// @access   Public
export const searchProducts = async (req, res) => {
  try {
    const { q: query, page = 1, limit = 10 } = req.query

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
        error: 'MISSING_QUERY'
      })
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const products = await Product.searchProducts(query, {
      isActive: true
    })
    .skip(skip)
    .limit(parseInt(limit))
    .select('name code price img category rating badge reviews shade color finish')
    .lean()

    const total = await Product.countDocuments({
      $text: { $search: query },
      isActive: true
    })

    res.json({
      success: true,
      data: {
        products,
        query,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total,
          hasNext: skip + products.length < total,
          hasPrev: page > 1
        }
      }
    })
  } catch (error) {
    console.error('Search products error:', error)
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Get bestseller products
// @route   GET /api/products/bestsellers
// @access   Public
export const getBestsellers = async (req, res) => {
  try {
    const { limit = 10 } = req.query

    const products = await Product.findBestsellers(parseInt(limit))
      .select('name code price img category rating badge reviews shade color finish')
      .lean()

    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Get bestsellers error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching bestseller products',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Get featured products
// @route   GET /api/products/featured
// @access   Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query

    const products = await Product.find({
      isActive: true,
      badge: { $in: ['Bestseller', 'New', 'Premium', 'Trending'] }
    })
    .sort({ rating: -1, createdAt: -1 })
    .limit(parseInt(limit))
    .select('name code price img category rating badge reviews shade color finish')
    .lean()

    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Get featured products error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Create new product (Admin only)
// @route   POST /api/products
// @access   Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    })
  } catch (error) {
    console.error('Create product error:', error)
    
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0]
      return res.status(400).json({
        success: false,
        message: `Product ${field} already exists`,
        error: 'DUPLICATE_FIELD',
        field
      })
    }

    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access   Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: 'PRODUCT_NOT_FOUND'
      })
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access   Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: 'PRODUCT_NOT_FOUND'
      })
    }

    // Soft delete by setting isActive to false
    await Product.findByIdAndUpdate(req.params.id, { isActive: false })

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Get product statistics (Admin only)
// @route   GET /api/products/stats
// @access   Private/Admin
export const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgRating: { $avg: '$rating' },
          categoryBreakdown: {
            $push: {
              category: '$category',
              count: 1
            }
          },
          badgeBreakdown: {
            $push: {
              badge: '$badge',
              count: 1
            }
          }
        }
      },
      {
        $project: {
          totalProducts: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          minPrice: 1,
          maxPrice: 1,
          avgRating: { $round: ['$avgRating', 2] },
          categoryBreakdown: {
            $reduce: {
              input: '$categoryBreakdown',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    k: { $toString: '$$this.category' },
                    v: { $sum: '$$this.count' }
                  }
                ]
              }
            }
          },
          badgeBreakdown: {
            $reduce: {
              input: '$badgeBreakdown',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    k: { $ifNull: ['$$this.badge', 'none'] },
                    v: { $sum: '$$this.count' }
                  }
                ]
              }
            }
          }
        }
      }
    ])

    res.json({
      success: true,
      data: stats[0] || {
        totalProducts: 0,
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        avgRating: 0,
        categoryBreakdown: {},
        badgeBreakdown: {}
      }
    })
  } catch (error) {
    console.error('Get product stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching product statistics',
      error: 'SERVER_ERROR'
    })
  }
}

export default {
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getBestsellers,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
}
