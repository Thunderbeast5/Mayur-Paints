import React, { useRef, useEffect, useState, useCallback } from 'react'
import { WallSegmentation, preloadImage, createPredefinedMasks } from '../utils/wallSegmentation'

const VisualizerCanvas = ({ 
  imageUrl, 
  roomType = 'living',
  onWallDetected,
  onWallSelected,
  selectedWalls = {},
  paintOptions = {}
}) => {
  const canvasRef = useRef(null)
  const [segmentation, setSegmentation] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [wallMasks, setWallMasks] = useState([])
  const [hoveredWall, setHoveredWall] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Initialize canvas and load image
  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return

    const initializeCanvas = async () => {
      setIsProcessing(true)
      try {
        const img = await preloadImage(imageUrl)
        const canvas = canvasRef.current
        const seg = new WallSegmentation(canvas, img)
        
        // Try automatic wall detection first
        const detectedWalls = seg.detectWalls()
        
        if (detectedWalls.length === 0) {
          // Fallback to predefined masks
          const predefinedMasks = createPredefinedMasks(img.width, img.height, roomType)
          setWallMasks(predefinedMasks.map(mask => ({
            ...mask,
            id: mask.id,
            mask: seg.createMask(mask.pixels)
          })))
        } else {
          setWallMasks(detectedWalls)
        }
        
        setSegmentation(seg)
        setImageLoaded(true)
        onWallDetected?.(detectedWalls.length > 0 ? detectedWalls : predefinedMasks)
      } catch (error) {
        console.error('Failed to initialize canvas:', error)
        // Fallback to predefined masks
        const canvas = canvasRef.current
        const img = await preloadImage(imageUrl)
        const seg = new WallSegmentation(canvas, img)
        const predefinedMasks = createPredefinedMasks(img.width, img.height, roomType)
        setWallMasks(predefinedMasks.map(mask => ({
          ...mask,
          id: mask.id,
          mask: seg.createMask(mask.pixels)
        })))
        setSegmentation(seg)
        setImageLoaded(true)
      } finally {
        setIsProcessing(false)
      }
    }

    initializeCanvas()
  }, [imageUrl, roomType, onWallDetected])

  // Apply paint to walls when selection changes
  useEffect(() => {
    if (!segmentation || !imageLoaded) return

    // Reset to original first
    segmentation.reset()

    // Apply paint to each selected wall
    Object.entries(selectedWalls).forEach(([wallId, config]) => {
      if (config.color) {
        segmentation.applyPaintToWall(wallId, config.color, {
          opacity: config.opacity || 0.7,
          brightness: config.brightness || 1.0,
          saturation: config.saturation || 1.0,
          finish: config.finish || 'matte'
        })
      }
    })
  }, [selectedWalls, segmentation, imageLoaded])

  // Handle canvas click for wall selection
  const handleCanvasClick = useCallback((event) => {
    if (!segmentation || !wallMasks.length) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const canvasX = x * scaleX
    const canvasY = y * scaleY

    // Find which wall was clicked
    for (const wall of wallMasks) {
      const idx = Math.floor(canvasY) * canvas.width + Math.floor(canvasX)
      if (wall.mask && wall.mask[idx] === 255) {
        onWallSelected?.(wall.id)
        break
      }
    }
  }, [segmentation, wallMasks, onWallSelected])

  // Handle canvas hover for wall highlighting
  const handleCanvasMove = useCallback((event) => {
    if (!segmentation || !wallMasks.length) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const canvasX = x * scaleX
    const canvasY = y * scaleY

    // Find which wall is being hovered
    let hoveredWallId = null
    for (const wall of wallMasks) {
      const idx = Math.floor(canvasY) * canvas.width + Math.floor(canvasX)
      if (wall.mask && wall.mask[idx] === 255) {
        hoveredWallId = wall.id
        break
      }
    }

    if (hoveredWallId !== hoveredWall) {
      setHoveredWall(hoveredWallId)
      canvas.style.cursor = hoveredWallId ? 'pointer' : 'default'
    }
  }, [segmentation, wallMasks, hoveredWall])

  // Draw wall overlays for visualization
  useEffect(() => {
    if (!segmentation || !wallMasks.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Redraw the processed image
    if (segmentation.processedImageData) {
      ctx.putImageData(segmentation.processedImageData, 0, 0)
    }

    // Draw wall overlays
    wallMasks.forEach(wall => {
      const isSelected = selectedWalls[wall.id]
      const isHovered = wall.id === hoveredWall
      
      if (isHovered || isSelected) {
        ctx.save()
        
        // Create overlay for this wall
        const overlay = ctx.createImageData(canvas.width, canvas.height)
        const mask = wall.mask
        
        for (let i = 0; i < mask.length; i++) {
          if (mask[i] === 255) {
            const idx = i * 4
            if (isSelected) {
              // Green tint for selected walls
              overlay.data[idx] = 0
              overlay.data[idx + 1] = 255
              overlay.data[idx + 2] = 0
              overlay.data[idx + 3] = 50
            } else if (isHovered) {
              // Blue tint for hovered walls
              overlay.data[idx] = 0
              overlay.data[idx + 1] = 150
              overlay.data[idx + 2] = 255
              overlay.data[idx + 3] = 30
            }
          }
        }
        
        ctx.putImageData(overlay, 0, 0)
        ctx.restore()
      }
    })
  }, [wallMasks, selectedWalls, hoveredWall, segmentation])

  return (
    <div className="relative inline-block">
      {/* Loading overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-slate-600">Detecting walls...</span>
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto rounded-lg shadow-lg border border-slate-200"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        onMouseLeave={() => setHoveredWall(null)}
        style={{ maxHeight: '600px' }}
      />

      {/* Wall indicators */}
      {wallMasks.length > 0 && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-xs font-medium text-slate-600 mb-2">Detected Walls</div>
          <div className="space-y-1">
            {wallMasks.map((wall, index) => (
              <div key={wall.id} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 rounded-full ${
                  selectedWalls[wall.id] ? 'bg-green-500' : 
                  hoveredWall === wall.id ? 'bg-blue-500' : 'bg-slate-300'
                }`} />
                <span className="capitalize">{wall.id.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VisualizerCanvas
