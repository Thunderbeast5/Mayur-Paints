import express from 'express'
import { findClosestPaints, generateColorPalette, getColorName, hexToRgb } from '../utils/colorExtractor.js'
import Paint from '../models/Paint.js'

const router = express.Router()

// POST /api/color-matcher/match - Find closest paint matches for a color
router.post('/match', async (req, res) => {
  try {
    const { hex, maxResults = 5, category, finish } = req.body
    
    if (!hex) {
      return res.status(400).json({
        success: false,
        message: 'Hex color code is required'
      })
    }
    
    // Validate hex format
    if (!/^#[0-9A-F]{6}$/i.test(hex)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hex color code format'
      })
    }
    
    // Build query
    const query = { hexCode: { $exists: true, $ne: null } }
    
    if (category) {
      query.category = category
    }
    
    if (finish) {
      query.finish = finish
    }
    
    // Get all paints with hex codes
    const paints = await Paint.find(query).select('name brand color hexCode finish size price image category stock')
    
    // Find closest matches
    const matches = findClosestPaints(hex, paints, maxResults)
    
    // Get color name
    const colorName = getColorName(hex)
    
    res.json({
      success: true,
      data: {
        targetColor: {
          hex,
          name: colorName,
          rgb: hexToRgb(hex)
        },
        matches
      }
    })
  } catch (error) {
    console.error('Color match error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to match color',
      error: error.message
    })
  }
})

// POST /api/color-matcher/palette - Generate color palette
router.post('/palette', async (req, res) => {
  try {
    const { hex } = req.body
    
    if (!hex) {
      return res.status(400).json({
        success: false,
        message: 'Hex color code is required'
      })
    }
    
    const palette = generateColorPalette(hex)
    
    if (!palette) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hex color code'
      })
    }
    
    // Find paint matches for each color in palette
    const paints = await Paint.find({ 
      hexCode: { $exists: true, $ne: null } 
    }).select('name brand color hexCode finish size price image')
    
    const paletteWithMatches = {
      base: {
        hex: palette.base,
        name: getColorName(palette.base),
        matches: findClosestPaints(palette.base, paints, 3)
      },
      lighter: palette.lighter.map(hex => ({
        hex,
        name: getColorName(hex),
        matches: findClosestPaints(hex, paints, 2)
      })),
      darker: palette.darker.map(hex => ({
        hex,
        name: getColorName(hex),
        matches: findClosestPaints(hex, paints, 2)
      })),
      complementary: {
        hex: palette.complementary,
        name: getColorName(palette.complementary),
        matches: findClosestPaints(palette.complementary, paints, 2)
      }
    }
    
    res.json({
      success: true,
      data: paletteWithMatches
    })
  } catch (error) {
    console.error('Generate palette error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate palette',
      error: error.message
    })
  }
})

// GET /api/color-matcher/colors - Get all available colors
router.get('/colors', async (req, res) => {
  try {
    const { category, finish, brand } = req.query
    
    const query = { hexCode: { $exists: true, $ne: null } }
    
    if (category) query.category = category
    if (finish) query.finish = finish
    if (brand) query.brand = brand
    
    const paints = await Paint.find(query)
      .select('color hexCode category finish brand')
      .sort({ color: 1 })
    
    // Group by color
    const colorMap = new Map()
    
    paints.forEach(paint => {
      if (!colorMap.has(paint.hexCode)) {
        colorMap.set(paint.hexCode, {
          hex: paint.hexCode,
          name: paint.color,
          count: 0,
          categories: new Set(),
          finishes: new Set(),
          brands: new Set()
        })
      }
      
      const color = colorMap.get(paint.hexCode)
      color.count++
      color.categories.add(paint.category)
      color.finishes.add(paint.finish)
      color.brands.add(paint.brand)
    })
    
    const colors = Array.from(colorMap.values()).map(color => ({
      ...color,
      categories: Array.from(color.categories),
      finishes: Array.from(color.finishes),
      brands: Array.from(color.brands)
    }))
    
    res.json({
      success: true,
      count: colors.length,
      data: colors
    })
  } catch (error) {
    console.error('Get colors error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch colors',
      error: error.message
    })
  }
})

// POST /api/color-matcher/extract - Extract colors from image (placeholder)
router.post('/extract', async (req, res) => {
  try {
    // This is a placeholder for image color extraction
    // In production, this would use a proper image processing library
    // like sharp, jimp, or an AI service
    
    res.json({
      success: false,
      message: 'Image color extraction requires additional setup. Please use the /match endpoint with a hex code for now.'
    })
  } catch (error) {
    console.error('Extract colors error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to extract colors',
      error: error.message
    })
  }
})

export default router
