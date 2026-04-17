import express from 'express'
import { calculatePaintQuantity, calculateCost, getPaintRecommendations } from '../utils/paintCalculator.js'
import Paint from '../models/Paint.js'

const router = express.Router()

// POST /api/paint-calculator/calculate - Calculate paint quantity
router.post('/calculate', async (req, res) => {
  try {
    const calculation = calculatePaintQuantity(req.body)
    
    res.json({
      success: true,
      data: calculation
    })
  } catch (error) {
    console.error('Paint calculation error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to calculate paint quantity'
    })
  }
})

// POST /api/paint-calculator/estimate - Calculate with cost estimate
router.post('/estimate', async (req, res) => {
  try {
    const { paintId, ...calculationParams } = req.body
    
    // Calculate quantity
    const calculation = calculatePaintQuantity(calculationParams)
    
    // Get paint details for pricing
    let costEstimate = null
    let recommendedPaint = null
    
    if (paintId) {
      const paint = await Paint.findById(paintId)
      if (paint) {
        // Calculate price per liter based on paint size
        const sizeInLiters = parseInt(paint.size) || 1
        const pricePerLiter = paint.price / sizeInLiters
        
        costEstimate = calculateCost(calculation.recommendedCans, pricePerLiter)
        recommendedPaint = {
          id: paint._id,
          name: paint.name,
          brand: paint.brand,
          color: paint.color,
          finish: paint.finish,
          pricePerLiter: Math.round(pricePerLiter)
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        calculation,
        costEstimate,
        recommendedPaint
      }
    })
  } catch (error) {
    console.error('Paint estimate error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to calculate estimate'
    })
  }
})

// GET /api/paint-calculator/recommendations/:roomType - Get paint recommendations
router.get('/recommendations/:roomType', (req, res) => {
  try {
    const recommendations = getPaintRecommendations(req.params.roomType)
    
    res.json({
      success: true,
      data: recommendations
    })
  } catch (error) {
    console.error('Get recommendations error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations'
    })
  }
})

// POST /api/paint-calculator/recommend-products - Recommend products based on calculation
router.post('/recommend-products', async (req, res) => {
  try {
    const { calculation, roomType, budget } = req.body
    
    if (!calculation || !calculation.quantity) {
      return res.status(400).json({
        success: false,
        message: 'Calculation data is required'
      })
    }
    
    const recommendations = getPaintRecommendations(roomType || 'living-room')
    
    // Build query
    const query = {
      stock: { $gt: 0 }
    }
    
    if (recommendations.finish) {
      query.finish = { $in: recommendations.finish }
    }
    
    // Find suitable paints
    let paints = await Paint.find(query)
      .sort({ price: 1 })
      .limit(10)
    
    // Calculate cost for each paint
    const paintsWithCost = paints.map(paint => {
      const sizeInLiters = parseInt(paint.size) || 1
      const pricePerLiter = paint.price / sizeInLiters
      const costEstimate = calculateCost(calculation.recommendedCans, pricePerLiter)
      
      return {
        paint: {
          id: paint._id,
          name: paint.name,
          brand: paint.brand,
          color: paint.color,
          finish: paint.finish,
          size: paint.size,
          price: paint.price,
          image: paint.image
        },
        costEstimate,
        withinBudget: budget ? costEstimate.totalCost <= budget : true
      }
    })
    
    // Sort by cost
    paintsWithCost.sort((a, b) => a.costEstimate.totalCost - b.costEstimate.totalCost)
    
    res.json({
      success: true,
      data: {
        recommendations: paintsWithCost,
        calculation
      }
    })
  } catch (error) {
    console.error('Recommend products error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to recommend products'
    })
  }
})

export default router
