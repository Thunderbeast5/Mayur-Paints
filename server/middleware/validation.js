import Joi from 'joi'

// Common validation schemas
const schemas = {
  // User validation
  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).max(128).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password cannot exceed 128 characters',
      'any.required': 'Password is required'
    }),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).min(10).max(15).required().messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'string.min': 'Phone number must be at least 10 digits',
      'string.max': 'Phone number cannot exceed 15 digits',
      'any.required': 'Phone number is required'
    }),
    role: Joi.string().valid('user', 'admin').default('user')
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  }),

  // Product validation
  product: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    code: Joi.string().min(2).max(20).required(),
    category: Joi.string().valid('Interior', 'Exterior', 'Waterproofing', 'Primers', 'Hardware').required(),
    subCategory: Joi.string().max(50),
    type: Joi.string().valid('paint', 'hardware').required(),
    price: Joi.number().min(0).required(),
    mrp: Joi.number().min(0),
    size: Joi.string().required(),
    finish: Joi.string().valid('Matte', 'Satin', 'Gloss', 'Semi-Gloss').default('Matte'),
    color: Joi.string(),
    shade: Joi.string(),
    coverage: Joi.string(),
    stock: Joi.number().min(0).default(0),
    description: Joi.string().max(500),
    features: Joi.array().items(Joi.string().max(100)),
    images: Joi.array().items(Joi.string().uri()),
    img: Joi.string().uri().required(),
    badge: Joi.string().valid('Bestseller', 'New', 'Popular', 'Premium', 'Trending', 'Value'),
    rating: Joi.number().min(0).max(5).default(0),
    reviews: Joi.number().min(0).default(0),
    isActive: Joi.boolean().default(true),
    tags: Joi.array().items(Joi.string().max(50)),
    specifications: Joi.object({
      warranty: Joi.string(),
      application: Joi.string(),
      dryingTime: Joi.string(),
      recoatTime: Joi.string(),
      coveragePerLiter: Joi.string()
    })
  }),

  // Order validation
  order: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        qty: Joi.number().min(1).required(),
        price: Joi.number().min(0).required()
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().required(),
      phone: Joi.string().required()
    }).required(),
    billingAddress: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      pincode: Joi.string(),
      phone: Joi.string()
    }),
    paymentMethod: Joi.string().valid('COD', 'Card', 'UPI', 'NetBanking').required(),
    notes: Joi.string().max(500)
  }),

  // Address validation
  address: Joi.object({
    label: Joi.string().min(2).max(50).required(),
    street: Joi.string().min(5).max(200).required(),
    city: Joi.string().min(2).max(50).required(),
    state: Joi.string().min(2).max(50).required(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
      'string.pattern.base': 'Please provide a valid 6-digit pincode'
    }),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).min(10).max(15).required(),
    isDefault: Joi.boolean().default(false)
  }),

  // Review validation
  review: Joi.object({
    productId: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    title: Joi.string().min(5).max(100).required(),
    comment: Joi.string().min(10).max(1000).required(),
    images: Joi.array().items(Joi.string().uri()).max(5)
  }),

  // Query validation
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sort: Joi.string().valid('name', 'price', 'rating', 'createdAt', '-name', '-price', '-rating', '-createdAt'),
    search: Joi.string().max(100),
    category: Joi.string().valid('Interior', 'Exterior', 'Waterproofing', 'Primers', 'Hardware'),
    type: Joi.string().valid('paint', 'hardware'),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    rating: Joi.number().min(1).max(5)
  })
}

// Validation middleware factory
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = source === 'query' ? req.query : 
                 source === 'params' ? req.params : 
                 req.body

    const { error, value } = schemas[schema].validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    })

    if (error) {
      const errors = error.details.reduce((acc, detail) => {
        const key = detail.path.join('.')
        acc[key] = detail.message
        return acc
      }, {})

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
        error: 'VALIDATION_ERROR'
      })
    }

    // Add validated data back to request
    if (source === 'query') {
      req.query = value
    } else if (source === 'params') {
      req.params = { ...req.params, ...value }
    } else {
      req.body = value
    }

    next()
  }
}

// Custom validation functions
export const validateObjectId = (field = 'id') => {
  return (req, res, next) => {
    const id = req.params[field]
    
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${field} format`,
        error: 'INVALID_ID'
      })
    }

    next()
  }
}

export const validateEmail = (email) => {
  const schema = Joi.string().email().required()
  const { error } = schema.validate(email)
  return !error
}

export const validatePhone = (phone) => {
  const schema = Joi.string().pattern(/^[0-9+\-\s()]*$/).min(10).max(15).required()
  const { error } = schema.validate(phone)
  return !error
}

export const validatePassword = (password) => {
  const schema = Joi.string().min(6).max(128).required()
  const { error } = schema.validate(password)
  return !error
}

// Sanitization middleware
export const sanitize = (fields = []) => {
  return (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field]) {
        // Basic XSS protection
        req.body[field] = req.body[field]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*$)*<\/script>/gi, '')
          .replace(/<[^>]*>/g, '')
          .trim()
      }
    })
    next()
  }
}

// Rate limiting validation
export const validateRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  const requests = new Map()

  return (req, res, next) => {
    const key = req.ip + ':' + req.path
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean old requests
    for (const [requestKey, timestamps] of requests.entries()) {
      const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart)
      if (validTimestamps.length === 0) {
        requests.delete(requestKey)
      } else {
        requests.set(requestKey, validTimestamps)
      }
    }

    // Check current requests
    const currentRequests = requests.get(key) || []
    
    if (currentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        error: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(windowMs / 1000)
      })
    }

    // Add current request
    currentRequests.push(now)
    requests.set(key, currentRequests)

    next()
  }
}

export default {
  validate,
  validateObjectId,
  validateEmail,
  validatePhone,
  validatePassword,
  sanitize,
  validateRateLimit,
  schemas
}
