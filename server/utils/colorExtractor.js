/**
 * Color Extraction Utility
 * Extracts dominant colors from images and matches them to paint catalog
 */

/**
 * Convert RGB to Hex
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color code
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Convert Hex to RGB
 * @param {string} hex - Hex color code
 * @returns {Object} RGB values
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Convert RGB to LAB color space
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} LAB values
 */
export function rgbToLab(r, g, b) {
  // Convert RGB to XYZ
  let x = r / 255
  let y = g / 255
  let z = b / 255
  
  x = x > 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) : x / 12.92
  y = y > 0.04045 ? Math.pow((y + 0.055) / 1.055, 2.4) : y / 12.92
  z = z > 0.04045 ? Math.pow((z + 0.055) / 1.055, 2.4) : z / 12.92
  
  x = x * 100
  y = y * 100
  z = z * 100
  
  // Observer = 2°, Illuminant = D65
  x = x * 0.4124 + y * 0.3576 + z * 0.1805
  y = x * 0.2126 + y * 0.7152 + z * 0.0722
  z = x * 0.0193 + y * 0.1192 + z * 0.9505
  
  // Convert XYZ to LAB
  x = x / 95.047
  y = y / 100.000
  z = z / 108.883
  
  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116)
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116)
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116)
  
  return {
    l: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z)
  }
}

/**
 * Calculate Delta E 2000 color difference
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @returns {number} Delta E value (0 = identical, 100 = opposite)
 */
export function calculateDeltaE2000(hex1, hex2) {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  
  if (!rgb1 || !rgb2) return 100
  
  const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b)
  const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b)
  
  // Simplified Delta E calculation (not full CIE2000 formula)
  const deltaL = lab1.l - lab2.l
  const deltaA = lab1.a - lab2.a
  const deltaB = lab1.b - lab2.b
  
  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB)
}

/**
 * Find closest paint match from catalog
 * @param {string} targetHex - Target color hex code
 * @param {Array} paintCatalog - Array of paint products with hexCode
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Array} Matched paints sorted by similarity
 */
export function findClosestPaints(targetHex, paintCatalog, maxResults = 5) {
  const matches = []
  
  for (const paint of paintCatalog) {
    if (!paint.hexCode) continue
    
    const deltaE = calculateDeltaE2000(targetHex, paint.hexCode)
    const similarity = Math.max(0, 100 - deltaE)
    
    matches.push({
      paint,
      deltaE: Math.round(deltaE * 10) / 10,
      similarity: Math.round(similarity * 10) / 10,
      matchQuality: deltaE < 5 ? 'excellent' : deltaE < 10 ? 'good' : deltaE < 20 ? 'fair' : 'poor'
    })
  }
  
  // Sort by deltaE (lower is better)
  matches.sort((a, b) => a.deltaE - b.deltaE)
  
  return matches.slice(0, maxResults)
}

/**
 * Extract dominant colors using K-means clustering (simplified)
 * This is a placeholder - in production, use a proper image processing library
 * @param {Array} pixels - Array of RGB pixel values
 * @param {number} k - Number of colors to extract
 * @returns {Array} Dominant colors as hex codes
 */
export function extractDominantColors(pixels, k = 7) {
  // This is a simplified version
  // In production, implement proper K-means clustering or use a library
  
  // For now, return a sample palette
  // In real implementation, this would analyze the pixel data
  
  const colorMap = new Map()
  
  // Count color frequencies
  for (const pixel of pixels) {
    const hex = rgbToHex(pixel.r, pixel.g, pixel.b)
    colorMap.set(hex, (colorMap.get(hex) || 0) + 1)
  }
  
  // Sort by frequency
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([hex, count]) => ({
      hex,
      count,
      percentage: Math.round((count / pixels.length) * 100)
    }))
  
  return sortedColors
}

/**
 * Generate color palette from a base color
 * @param {string} baseHex - Base color hex code
 * @returns {Object} Color palette with variations
 */
export function generateColorPalette(baseHex) {
  const rgb = hexToRgb(baseHex)
  if (!rgb) return null
  
  const palette = {
    base: baseHex,
    lighter: [],
    darker: [],
    complementary: null,
    analogous: [],
    triadic: []
  }
  
  // Generate lighter shades
  for (let i = 1; i <= 3; i++) {
    const factor = 1 + (i * 0.15)
    palette.lighter.push(rgbToHex(
      Math.min(255, rgb.r * factor),
      Math.min(255, rgb.g * factor),
      Math.min(255, rgb.b * factor)
    ))
  }
  
  // Generate darker shades
  for (let i = 1; i <= 3; i++) {
    const factor = 1 - (i * 0.15)
    palette.darker.push(rgbToHex(
      Math.max(0, rgb.r * factor),
      Math.max(0, rgb.g * factor),
      Math.max(0, rgb.b * factor)
    ))
  }
  
  // Complementary color (opposite on color wheel)
  palette.complementary = rgbToHex(
    255 - rgb.r,
    255 - rgb.g,
    255 - rgb.b
  )
  
  return palette
}

/**
 * Get color name from hex code
 * @param {string} hex - Hex color code
 * @returns {string} Color name
 */
export function getColorName(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 'Unknown'
  
  const { r, g, b } = rgb
  
  // Simple color naming logic
  const brightness = (r + g + b) / 3
  
  if (brightness < 30) return 'Black'
  if (brightness > 225) return 'White'
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const saturation = max === 0 ? 0 : (max - min) / max
  
  if (saturation < 0.1) {
    if (brightness < 85) return 'Dark Grey'
    if (brightness < 170) return 'Grey'
    return 'Light Grey'
  }
  
  if (r > g && r > b) {
    if (g > b) return 'Orange'
    return 'Red'
  }
  
  if (g > r && g > b) {
    if (r > b) return 'Yellow'
    return 'Green'
  }
  
  if (b > r && b > g) {
    if (r > g) return 'Purple'
    return 'Blue'
  }
  
  return 'Mixed'
}

export default {
  rgbToHex,
  hexToRgb,
  rgbToLab,
  calculateDeltaE2000,
  findClosestPaints,
  extractDominantColors,
  generateColorPalette,
  getColorName
}
