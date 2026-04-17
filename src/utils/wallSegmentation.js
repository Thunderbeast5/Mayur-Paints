/**
 * Advanced Wall Segmentation for Paint Visualizer
 * Uses Canvas API with edge detection and masking techniques
 * to isolate wall regions for realistic paint application
 */

export class WallSegmentation {
  constructor(canvas, imageElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.image = imageElement
    this.width = imageElement.width
    this.height = imageElement.height
    this.wallMasks = []
    this.originalImageData = null
    this.processedImageData = null
    
    this.initializeCanvas()
  }

  initializeCanvas() {
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx.drawImage(this.image, 0, 0, this.width, this.height)
    this.originalImageData = this.ctx.getImageData(0, 0, this.width, this.height)
    this.processedImageData = this.ctx.getImageData(0, 0, this.width, this.height)
  }

  /**
   * Detect walls using edge detection and color analysis
   */
  detectWalls() {
    const edges = this.detectEdges()
    const regions = this.segmentRegions(edges)
    const walls = this.identifyWalls(regions)
    
    this.wallMasks = walls.map(wall => ({
      ...wall,
      mask: this.createMask(wall.pixels),
      id: `wall_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }))

    return this.wallMasks
  }

  /**
   * Sobel edge detection algorithm
   */
  detectEdges() {
    const imageData = this.originalImageData
    const data = imageData.data
    const width = this.width
    const height = this.height
    const edges = new Uint8ClampedArray(width * height)

    // Convert to grayscale
    const grayscale = new Uint8ClampedArray(width * height)
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
      grayscale[i / 4] = gray
    }

    // Sobel operators
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0
        let pixelY = 0

        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            const idx = (y + j) * width + (x + i)
            const kernelIdx = (j + 1) * 3 + (i + 1)
            pixelX += grayscale[idx] * sobelX[kernelIdx]
            pixelY += grayscale[idx] * sobelY[kernelIdx]
          }
        }

        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY)
        edges[y * width + x] = magnitude > 100 ? 255 : 0
      }
    }

    return edges
  }

  /**
   * Segment regions based on edges
   */
  segmentRegions(edges) {
    const width = this.width
    const height = this.height
    const visited = new Array(width * height).fill(false)
    const regions = []

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x
        if (!visited[idx] && edges[idx] === 0) {
          const region = this.floodFill(edges, visited, x, y, width, height)
          if (region.pixels.length > 1000) { // Filter small regions
            regions.push(region)
          }
        }
      }
    }

    return regions
  }

  /**
   * Flood fill algorithm for region detection
   */
  floodFill(edges, visited, startX, startY, width, height) {
    const stack = [[startX, startY]]
    const pixels = []
    let minX = startX, maxX = startX, minY = startY, maxY = startY

    while (stack.length > 0) {
      const [x, y] = stack.pop()
      const idx = y * width + x

      if (x < 0 || x >= width || y < 0 || y >= height || visited[idx] || edges[idx] === 255) {
        continue
      }

      visited[idx] = true
      pixels.push([x, y])
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }

    return {
      pixels,
      bounds: { minX, maxX, minY, maxY },
      area: pixels.length
    }
  }

  /**
   * Identify walls from regions using heuristics
   */
  identifyWalls(regions) {
    return regions
      .filter(region => {
        const aspectRatio = (region.bounds.maxX - region.bounds.minX) / (region.bounds.maxY - region.bounds.minY)
        const relativeArea = region.area / (this.width * this.height)
        
        // Wall characteristics: large area, reasonable aspect ratio
        return relativeArea > 0.05 && aspectRatio > 1.5 && aspectRatio < 10
      })
      .sort((a, b) => b.area - a.area)
      .slice(0, 4) // Take top 4 wall regions
  }

  /**
   * Create binary mask for wall region
   */
  createMask(pixels) {
    const mask = new Uint8ClampedArray(this.width * this.height)
    pixels.forEach(([x, y]) => {
      mask[y * this.width + x] = 255
    })
    return mask
  }

  /**
   * Apply paint color to specific wall with realistic blending
   */
  applyPaintToWall(wallId, color, options = {}) {
    const wall = this.wallMasks.find(w => w.id === wallId)
    if (!wall) return

    const {
      opacity = 0.7,
      brightness = 1.0,
      saturation = 1.0,
      finish = 'matte' // matte, satin, gloss
    } = options

    const imageData = this.ctx.getImageData(0, 0, this.width, this.height)
    const data = imageData.data
    const mask = wall.mask

    // Convert hex color to RGB
    const r = parseInt(color.substr(1, 2), 16)
    const g = parseInt(color.substr(3, 2), 16)
    const b = parseInt(color.substr(5, 2), 16)

    // Apply color transformation only to wall pixels
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === 255) {
        const idx = i * 4
        
        // Preserve original texture and lighting
        const originalR = this.originalImageData.data[idx]
        const originalG = this.originalImageData.data[idx + 1]
        const originalB = this.originalImageData.data[idx + 2]
        
        // Calculate luminance for lighting preservation
        const luminance = (originalR * 0.299 + originalG * 0.587 + originalB * 0.114) / 255
        
        // Apply color with lighting and texture preservation
        const blendFactor = opacity * (0.3 + 0.7 * luminance) // Preserve shadows
        
        data[idx] = Math.round(originalR * (1 - blendFactor) + r * blendFactor * brightness)
        data[idx + 1] = Math.round(originalG * (1 - blendFactor) + g * blendFactor * brightness)
        data[idx + 2] = Math.round(originalB * (1 - blendFactor) + b * blendFactor * brightness)
        
        // Apply saturation adjustment
        if (saturation !== 1.0) {
          const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]
          data[idx] = Math.round(gray + saturation * (data[idx] - gray))
          data[idx + 1] = Math.round(gray + saturation * (data[idx + 1] - gray))
          data[idx + 2] = Math.round(gray + saturation * (data[idx + 2] - gray))
        }
        
        // Apply finish effects
        if (finish === 'gloss') {
          // Add subtle highlight effect
          const highlight = Math.sin(i * 0.001) * 10
          data[idx] = Math.min(255, data[idx] + highlight)
          data[idx + 1] = Math.min(255, data[idx + 1] + highlight)
          data[idx + 2] = Math.min(255, data[idx + 2] + highlight)
        } else if (finish === 'satin') {
          // Add subtle sheen
          const sheen = Math.sin(i * 0.002) * 5
          data[idx] = Math.min(255, data[idx] + sheen)
          data[idx + 1] = Math.min(255, data[idx + 1] + sheen)
          data[idx + 2] = Math.min(255, data[idx + 2] + sheen)
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0)
    this.processedImageData = imageData
  }

  /**
   * Reset to original image
   */
  reset() {
    this.ctx.putImageData(this.originalImageData, 0, 0)
    this.processedImageData = this.originalImageData
  }

  /**
   * Get wall masks for visualization
   */
  getWallMasks() {
    return this.wallMasks
  }

  /**
   * Export processed image
   */
  exportImage() {
    return this.canvas.toDataURL('image/png')
  }
}

/**
 * Utility function to preload image
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Create predefined wall masks for common room layouts
 */
export function createPredefinedMasks(width, height, roomType = 'living') {
  const masks = []
  
  switch (roomType) {
    case 'living':
      // Back wall (largest)
      masks.push({
        id: 'back_wall',
        bounds: { x: 0, y: height * 0.2, w: width, h: height * 0.5 },
        pixels: generateWallPixels(0, height * 0.2, width, height * 0.5, width, height)
      })
      
      // Left wall
      masks.push({
        id: 'left_wall',
        bounds: { x: 0, y: height * 0.2, w: width * 0.3, h: height * 0.4 },
        pixels: generateWallPixels(0, height * 0.2, width * 0.3, height * 0.4, width, height)
      })
      
      // Right wall
      masks.push({
        id: 'right_wall',
        bounds: { x: width * 0.7, y: height * 0.2, w: width * 0.3, h: height * 0.4 },
        pixels: generateWallPixels(width * 0.7, height * 0.2, width * 0.3, height * 0.4, width, height)
      })
      break
      
    case 'bedroom':
      // Back wall
      masks.push({
        id: 'back_wall',
        bounds: { x: 0, y: height * 0.15, w: width, h: height * 0.55 },
        pixels: generateWallPixels(0, height * 0.15, width, height * 0.55, width, height)
      })
      
      // Side wall
      masks.push({
        id: 'side_wall',
        bounds: { x: width * 0.6, y: height * 0.15, w: width * 0.4, h: height * 0.45 },
        pixels: generateWallPixels(width * 0.6, height * 0.15, width * 0.4, height * 0.45, width, height)
      })
      break
      
    default:
      // Single wall fallback
      masks.push({
        id: 'main_wall',
        bounds: { x: 0, y: height * 0.2, w: width, h: height * 0.6 },
        pixels: generateWallPixels(0, height * 0.2, width, height * 0.6, width, height)
      })
  }
  
  return masks
}

function generateWallPixels(x, y, w, h, imgWidth, imgHeight) {
  const pixels = []
  const startX = Math.floor(x)
  const startY = Math.floor(y)
  const endX = Math.floor(x + w)
  const endY = Math.floor(y + h)
  
  for (let py = startY; py < endY; py++) {
    for (let px = startX; px < endX; px++) {
      if (px >= 0 && px < imgWidth && py >= 0 && py < imgHeight) {
        pixels.push([px, py])
      }
    }
  }
  
  return pixels
}
