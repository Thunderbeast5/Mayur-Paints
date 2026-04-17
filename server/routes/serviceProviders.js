import express from 'express'
import ServiceProvider from '../models/ServiceProvider.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// GET /api/service-providers - Get all service providers (with filters)
router.get('/', async (req, res) => {
  try {
    const { 
      service, 
      lat, 
      lng, 
      maxDistance = 10, // km
      minRating = 0,
      verified,
      limit = 20,
      page = 1
    } = req.query
    
    const query = { isActive: true }
    
    if (service) {
      query.services = service
    }
    
    if (verified === 'true') {
      query.isVerified = true
    }
    
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) }
    }
    
    let providers
    
    // Location-based search
    if (lat && lng) {
      providers = await ServiceProvider.find({
        ...query,
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: maxDistance * 1000 // Convert km to meters
          }
        }
      })
      .populate('user', 'name email phone')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
    } else {
      providers = await ServiceProvider.find(query)
        .populate('user', 'name email phone')
        .sort({ 'rating.average': -1, 'stats.completedJobs': -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
    }
    
    const total = await ServiceProvider.countDocuments(query)
    
    res.json({
      success: true,
      count: providers.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: providers
    })
  } catch (error) {
    console.error('Get service providers error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service providers',
      error: error.message
    })
  }
})

// POST /api/service-providers/match - Match providers for a service request
router.post('/match', async (req, res) => {
  try {
    const { serviceType, location, budget, urgency } = req.body
    
    if (!serviceType || !location) {
      return res.status(400).json({
        success: false,
        message: 'Service type and location are required'
      })
    }
    
    // Find providers within 10km
    let providers = await ServiceProvider.find({
      isActive: true,
      isVerified: true,
      services: serviceType,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat]
          },
          $maxDistance: 10000 // 10km in meters
        }
      }
    }).populate('user', 'name email phone')
    
    // Calculate scores for each provider
    providers = providers.map(provider => {
      const distance = provider.calculateDistance([location.lng, location.lat])
      const score = provider.calculateScore([location.lng, location.lat], budget)
      
      return {
        ...provider.toObject(),
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal
        matchScore: score
      }
    })
    
    // Sort by score
    providers.sort((a, b) => b.matchScore - a.matchScore)
    
    // Return top 5
    const topProviders = providers.slice(0, 5)
    
    res.json({
      success: true,
      count: topProviders.length,
      data: topProviders
    })
  } catch (error) {
    console.error('Match providers error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to match providers',
      error: error.message
    })
  }
})

// GET /api/service-providers/:id - Get provider details
router.get('/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
      .populate('user', 'name email phone')
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      })
    }
    
    res.json({
      success: true,
      data: provider
    })
  } catch (error) {
    console.error('Get provider error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provider',
      error: error.message
    })
  }
})

// POST /api/service-providers - Register as service provider
router.post('/', authenticateToken, async (req, res) => {
  try {
    const existingProvider = await ServiceProvider.findOne({ user: req.user._id })
    
    if (existingProvider) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a service provider'
      })
    }
    
    const providerData = {
      user: req.user._id,
      ...req.body
    }
    
    const provider = await ServiceProvider.create(providerData)
    
    res.status(201).json({
      success: true,
      message: 'Service provider registered successfully',
      data: provider
    })
  } catch (error) {
    console.error('Register provider error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to register service provider',
      error: error.message
    })
  }
})

// PUT /api/service-providers/:id - Update provider profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      })
    }
    
    // Check if user owns this provider profile
    if (provider.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      })
    }
    
    Object.assign(provider, req.body)
    await provider.save()
    
    res.json({
      success: true,
      message: 'Provider profile updated successfully',
      data: provider
    })
  } catch (error) {
    console.error('Update provider error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update provider',
      error: error.message
    })
  }
})

// GET /api/service-providers/my/profile - Get own provider profile
router.get('/my/profile', authenticateToken, async (req, res) => {
  try {
    const provider = await ServiceProvider.findOne({ user: req.user._id })
      .populate('user', 'name email phone')
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      })
    }
    
    res.json({
      success: true,
      data: provider
    })
  } catch (error) {
    console.error('Get my provider profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provider profile',
      error: error.message
    })
  }
})

export default router
