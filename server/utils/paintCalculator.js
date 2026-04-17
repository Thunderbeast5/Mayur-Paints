/**
 * Paint Calculator Utility
 * Calculates paint quantity needed based on room dimensions and surface type
 */

// Coverage rates in sq.ft per liter for different surface types
const COVERAGE_RATES = {
  smooth: 140,
  textured: 90,
  concrete: 70,
  wood: 80,
  metal: 100,
  primer: 120
}

// Standard opening sizes in sq.ft
const OPENING_SIZES = {
  door: 20,
  window: 15,
  largeWindow: 30
}

// Available can sizes in liters
const CAN_SIZES = [1, 4, 10, 20]

/**
 * Calculate total wall area
 * @param {Object} dimensions - Room dimensions
 * @returns {number} Total wall area in sq.ft
 */
function calculateWallArea(dimensions) {
  const { length, width, height } = dimensions
  
  // Calculate perimeter
  const perimeter = 2 * (length + width)
  
  // Calculate total wall area
  const wallArea = perimeter * height
  
  return wallArea
}

/**
 * Calculate ceiling area
 * @param {Object} dimensions - Room dimensions
 * @returns {number} Ceiling area in sq.ft
 */
function calculateCeilingArea(dimensions) {
  const { length, width } = dimensions
  return length * width
}

/**
 * Calculate openings area
 * @param {Object} openings - Number of doors and windows
 * @returns {number} Total openings area in sq.ft
 */
function calculateOpeningsArea(openings) {
  const { doors = 0, windows = 0, largeWindows = 0 } = openings
  
  const doorArea = doors * OPENING_SIZES.door
  const windowArea = windows * OPENING_SIZES.window
  const largeWindowArea = largeWindows * OPENING_SIZES.largeWindow
  
  return doorArea + windowArea + largeWindowArea
}

/**
 * Calculate optimal can combination
 * @param {number} totalQuantity - Total quantity needed in liters
 * @returns {Array} Array of can sizes and quantities
 */
function calculateOptimalCans(totalQuantity) {
  const cans = []
  let remaining = Math.ceil(totalQuantity * 10) / 10 // Round up to 1 decimal
  
  // Start with largest cans
  for (let i = CAN_SIZES.length - 1; i >= 0; i--) {
    const canSize = CAN_SIZES[i]
    const count = Math.floor(remaining / canSize)
    
    if (count > 0) {
      cans.push({
        size: `${canSize}L`,
        quantity: count,
        totalLiters: count * canSize
      })
      remaining -= count * canSize
    }
  }
  
  // If there's still remaining, add one more small can
  if (remaining > 0) {
    const smallestCan = CAN_SIZES[0]
    const existingSmallCan = cans.find(c => c.size === `${smallestCan}L`)
    
    if (existingSmallCan) {
      existingSmallCan.quantity += 1
      existingSmallCan.totalLiters += smallestCan
    } else {
      cans.push({
        size: `${smallestCan}L`,
        quantity: 1,
        totalLiters: smallestCan
      })
    }
  }
  
  return cans
}

/**
 * Main paint calculator function
 * @param {Object} params - Calculation parameters
 * @returns {Object} Calculation results
 */
export function calculatePaintQuantity(params) {
  const {
    dimensions,
    openings = {},
    surfaceType = 'smooth',
    coats = 2,
    includeCeiling = false,
    wasteFactor = 1.1 // 10% waste factor
  } = params
  
  // Validate inputs
  if (!dimensions || !dimensions.length || !dimensions.width || !dimensions.height) {
    throw new Error('Invalid dimensions provided')
  }
  
  // Calculate areas
  const wallArea = calculateWallArea(dimensions)
  const ceilingArea = includeCeiling ? calculateCeilingArea(dimensions) : 0
  const openingsArea = calculateOpeningsArea(openings)
  
  // Calculate net paintable area
  const netArea = (wallArea + ceilingArea - openingsArea) * wasteFactor
  
  // Get coverage rate
  const coverageRate = COVERAGE_RATES[surfaceType] || COVERAGE_RATES.smooth
  
  // Calculate quantity per coat
  const quantityPerCoat = netArea / coverageRate
  
  // Calculate total quantity
  const totalQuantity = quantityPerCoat * coats
  
  // Calculate optimal cans
  const recommendedCans = calculateOptimalCans(totalQuantity)
  
  // Calculate total liters to purchase
  const totalLitersToPurchase = recommendedCans.reduce((sum, can) => sum + can.totalLiters, 0)
  
  return {
    areas: {
      wallArea: Math.round(wallArea * 10) / 10,
      ceilingArea: Math.round(ceilingArea * 10) / 10,
      openingsArea: Math.round(openingsArea * 10) / 10,
      netArea: Math.round(netArea * 10) / 10
    },
    coverage: {
      rate: coverageRate,
      surfaceType
    },
    quantity: {
      perCoat: Math.round(quantityPerCoat * 100) / 100,
      total: Math.round(totalQuantity * 100) / 100,
      toPurchase: totalLitersToPurchase
    },
    coats,
    recommendedCans,
    wasteFactor
  }
}

/**
 * Calculate cost estimate
 * @param {Array} cans - Recommended cans
 * @param {number} pricePerLiter - Price per liter
 * @returns {Object} Cost breakdown
 */
export function calculateCost(cans, pricePerLiter) {
  let totalCost = 0
  const breakdown = []
  
  cans.forEach(can => {
    const canSize = parseInt(can.size)
    const canPrice = canSize * pricePerLiter
    const subtotal = canPrice * can.quantity
    
    breakdown.push({
      size: can.size,
      quantity: can.quantity,
      pricePerCan: Math.round(canPrice),
      subtotal: Math.round(subtotal)
    })
    
    totalCost += subtotal
  })
  
  return {
    breakdown,
    totalCost: Math.round(totalCost),
    currency: 'INR'
  }
}

/**
 * Get paint recommendations based on room type
 * @param {string} roomType - Type of room
 * @returns {Object} Paint recommendations
 */
export function getPaintRecommendations(roomType) {
  const recommendations = {
    'living-room': {
      finish: ['satin', 'eggshell'],
      colors: ['neutral', 'warm'],
      coats: 2,
      primer: true
    },
    'bedroom': {
      finish: ['matte', 'eggshell'],
      colors: ['calm', 'neutral'],
      coats: 2,
      primer: true
    },
    'kitchen': {
      finish: ['satin', 'glossy'],
      colors: ['bright', 'clean'],
      coats: 2,
      primer: true
    },
    'bathroom': {
      finish: ['satin', 'glossy'],
      colors: ['light', 'clean'],
      coats: 2,
      primer: true,
      special: 'moisture-resistant'
    },
    'exterior': {
      finish: ['satin', 'glossy'],
      colors: ['weather-resistant'],
      coats: 2,
      primer: true,
      special: 'weather-resistant'
    },
    'wood': {
      finish: ['satin', 'glossy'],
      coats: 2,
      primer: true,
      special: 'wood-primer'
    },
    'metal': {
      finish: ['glossy'],
      coats: 2,
      primer: true,
      special: 'anti-rust-primer'
    }
  }
  
  return recommendations[roomType] || recommendations['living-room']
}

export default {
  calculatePaintQuantity,
  calculateCost,
  getPaintRecommendations,
  COVERAGE_RATES,
  CAN_SIZES
}
