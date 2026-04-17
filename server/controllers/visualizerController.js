import path from 'path'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

// @desc    Get available room types and their configurations
// @route   GET /api/visualizer/rooms
// @access   Public
export const getRoomTypes = async (req, res) => {
  try {
    const roomTypes = [
      {
        id: 'living',
        name: 'Living Room',
        icon: 'weekend',
        image: '/rooms/living-room.jpg',
        maskImage: '/masks/living-room-mask.png',
        description: 'Spacious living area with multiple walls',
        dimensions: { width: 1200, height: 800 }
      },
      {
        id: 'bedroom',
        name: 'Bedroom',
        icon: 'bed',
        image: '/rooms/bedroom.jpg',
        maskImage: '/masks/bedroom-mask.png',
        description: 'Cozy bedroom with accent wall',
        dimensions: { width: 1200, height: 800 }
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        icon: 'kitchen',
        image: '/rooms/kitchen.jpg',
        maskImage: '/masks/kitchen-mask.png',
        description: 'Modern kitchen with backsplash',
        dimensions: { width: 1200, height: 800 }
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        icon: 'bathtub',
        image: '/rooms/bathroom.jpg',
        maskImage: '/masks/bathroom-mask.png',
        description: 'Fresh bathroom with tile walls',
        dimensions: { width: 1200, height: 800 }
      }
    ]

    res.json({
      success: true,
      data: roomTypes
    })
  } catch (error) {
    console.error('Get room types error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching room types',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Get available paint colors and shades
// @route   GET /api/visualizer/colors
// @access   Public
export const getPaintColors = async (req, res) => {
  try {
    const { category, search } = req.query

    const shadeCategories = {
      neutrals: [
        { name: 'Pearl White', color: '#fefefe', code: 'CC-115', category: 'Neutrals', popular: true },
        { name: 'Cloud', color: '#ecf0f1', code: 'CC-108', category: 'Neutrals' },
        { name: 'Sand', color: '#f4e4d4', code: 'CC-101', category: 'Neutrals' },
        { name: 'Concrete', color: '#95a5a6', code: 'CC-105', category: 'Neutrals' },
      ],
      warm: [
        { name: 'Sunset', color: '#ec5b13', code: 'CC-103', category: 'Oranges', popular: true },
        { name: 'Ochre', color: '#e67e22', code: 'CC-107', category: 'Oranges' },
        { name: 'Terracotta', color: '#c14545', code: 'CC-110', category: 'Reds' },
        { name: 'Peach', color: '#ffb6c1', code: 'CC-114', category: 'Pinks' },
      ],
      cool: [
        { name: 'Sage', color: '#d9e4dd', code: 'CC-102', category: 'Greens', popular: true },
        { name: 'Ocean', color: '#3498db', code: 'CC-111', category: 'Blues' },
        { name: 'Midnight', color: '#2c3e50', code: 'CC-104', category: 'Blues' },
        { name: 'Forest', color: '#27ae60', code: 'CC-112', category: 'Greens' },
      ],
      bold: [
        { name: 'Lavender', color: '#9b59b6', code: 'CC-113', category: 'Purples', popular: true },
        { name: 'Asphalt', color: '#7f8c8d', code: 'CC-106', category: 'Greys' },
        { name: 'Wetland', color: '#34495e', code: 'CC-109', category: 'Blues' },
      ]
    }

    let colors = []
    
    if (category && shadeCategories[category]) {
      colors = shadeCategories[category]
    } else {
      colors = Object.values(shadeCategories).flat()
    }

    // Filter by search
    if (search) {
      colors = colors.filter(color => 
        color.name.toLowerCase().includes(search.toLowerCase()) ||
        color.code.toLowerCase().includes(search.toUpperCase())
      )
    }

    res.json({
      success: true,
      data: {
        colors,
        categories: Object.keys(shadeCategories),
        total: colors.length
      }
    })
  } catch (error) {
    console.error('Get paint colors error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching paint colors',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Get available paint finishes
// @route   GET /api/visualizer/finishes
// @access   Public
export const getPaintFinishes = async (req, res) => {
  try {
    const finishes = [
      { 
        id: 'matte', 
        label: 'Matte', 
        icon: 'texture', 
        description: 'Non-reflective, smooth finish with sophisticated look',
        effect: { opacity: 0.8, brightness: 1.0, saturation: 0.9 }
      },
      { 
        id: 'satin', 
        label: 'Satin', 
        icon: 'opacity', 
        description: 'Subtle sheen with easy-clean properties',
        effect: { opacity: 0.7, brightness: 1.1, saturation: 1.1 }
      },
      { 
        id: 'gloss', 
        label: 'Gloss', 
        icon: 'flare', 
        description: 'High shine with maximum durability',
        effect: { opacity: 0.6, brightness: 1.2, saturation: 1.2 }
      },
    ]

    res.json({
      success: true,
      data: finishes
    })
  } catch (error) {
    console.error('Get paint finishes error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching paint finishes',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Save visualizer configuration
// @route   POST /api/visualizer/save
// @access   Private
export const saveConfiguration = async (req, res) => {
  try {
    const { room, color, finish, brightness, saturation, wallOpacity } = req.body
    
    if (!room || !color || !finish) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        error: 'MISSING_FIELDS'
      })
    }

    // Generate unique configuration ID
    const configId = uuidv4()
    
    const configuration = {
      id: configId,
      userId: req.user?.id || 'anonymous',
      room,
      color,
      finish,
      brightness: brightness || 1.0,
      saturation: saturation || 1.0,
      wallOpacity: wallOpacity || 0.7,
      timestamp: new Date().toISOString()
    }

    // In production, save to database
    // await VisualizerConfig.create(configuration)
    
    // For now, save to file (development only)
    const configPath = path.join(process.cwd(), 'uploads', 'visualizer-configs')
    await fs.mkdir(configPath, { recursive: true })
    await fs.writeFile(
      path.join(configPath, `${configId}.json`),
      JSON.stringify(configuration, null, 2)
    )

    res.status(201).json({
      success: true,
      message: 'Configuration saved successfully',
      data: {
        id: configId,
        shareUrl: `${req.protocol}://${req.get('host')}/visualizer/shared/${configId}`
      }
    })
  } catch (error) {
    console.error('Save configuration error:', error)
    res.status(500).json({
      success: false,
      message: 'Error saving configuration',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Load visualizer configuration
// @route   GET /api/visualizer/load/:id
// @access   Public
export const loadConfiguration = async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Configuration ID is required',
        error: 'MISSING_ID'
      })
    }

    // In production, load from database
    // const configuration = await VisualizerConfig.findById(id)
    
    // For now, load from file (development only)
    const configPath = path.join(process.cwd(), 'uploads', 'visualizer-configs', `${id}.json`)
    
    try {
      const configData = await fs.readFile(configPath, 'utf8')
      const configuration = JSON.parse(configData)
      
      res.json({
        success: true,
        data: configuration
      })
    } catch (fileError) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found',
        error: 'NOT_FOUND'
      })
    }
  } catch (error) {
    console.error('Load configuration error:', error)
    res.status(500).json({
      success: false,
      message: 'Error loading configuration',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Generate shareable image of painted room
// @route   POST /api/visualizer/generate-image
// @access   Private
export const generateImage = async (req, res) => {
  try {
    const { imageData, room, color } = req.body
    
    if (!imageData || !room || !color) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        error: 'MISSING_FIELDS'
      })
    }

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '')
    const imageBuffer = Buffer.from(base64Data, 'base64')
    
    // Generate unique filename
    const filename = `visualizer-${Date.now()}-${uuidv4()}.png`
    const imagePath = path.join(process.cwd(), 'uploads', 'visualizer-images', filename)
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(imagePath), { recursive: true })
    
    // Save image
    await fs.writeFile(imagePath, imageBuffer)
    
    // Return image URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/visualizer-images/${filename}`
    
    res.json({
      success: true,
      message: 'Image generated successfully',
      data: {
        imageUrl,
        filename
      }
    })
  } catch (error) {
    console.error('Generate image error:', error)
    res.status(500).json({
      success: false,
      message: 'Error generating image',
      error: 'SERVER_ERROR'
    })
  }
}

// @desc    Get visualizer analytics
// @route   GET /api/visualizer/analytics
// @access   Private/Admin
export const getVisualizerAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    // Mock analytics data - in production, query database
    const analytics = {
      totalConfigurations: 1250,
      totalShares: 342,
      popularRooms: [
        { room: 'living', count: 523, percentage: 41.8 },
        { room: 'bedroom', count: 412, percentage: 32.9 },
        { room: 'kitchen', count: 215, percentage: 17.2 },
        { room: 'bathroom', count: 100, percentage: 8.0 }
      ],
      popularColors: [
        { color: '#ec5b13', name: 'Sunset', count: 156 },
        { color: '#d9e4dd', name: 'Sage', count: 142 },
        { color: '#3498db', name: 'Ocean', count: 128 },
        { color: '#fefefe', name: 'Pearl White', count: 115 }
      ],
      popularFinishes: [
        { finish: 'matte', count: 625, percentage: 50.0 },
        { finish: 'satin', count: 438, percentage: 35.0 },
        { finish: 'gloss', count: 187, percentage: 15.0 }
      ],
      dailyUsage: [
        { date: '2024-01-01', configurations: 45, shares: 12 },
        { date: '2024-01-02', configurations: 52, shares: 18 },
        { date: '2024-01-03', configurations: 48, shares: 15 },
        { date: '2024-01-04', configurations: 61, shares: 22 },
        { date: '2024-01-05', configurations: 58, shares: 20 }
      ]
    }

    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('Get visualizer analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching visualizer analytics',
      error: 'SERVER_ERROR'
    })
  }
}

export default {
  getRoomTypes,
  getPaintColors,
  getPaintFinishes,
  saveConfiguration,
  loadConfiguration,
  generateImage,
  getVisualizerAnalytics
}
