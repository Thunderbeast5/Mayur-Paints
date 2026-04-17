# 🎨 Mayur Paints - Production-Grade Digital Paint Ecosystem
## Complete Transformation Guide

---

## 📋 TABLE OF CONTENTS

1. [Feature Expansion](#part-1-feature-expansion)
2. [System Design & Architecture](#part-2-system-design)
3. [AI Features Implementation](#part-3-ai-features)
4. [3D/AR Visualizer](#part-4-3dar-visualizer)
5. [Payment & Integrations](#part-5-payment--integrations)
6. [Production Readiness](#part-6-production-readiness)
7. [Final Structure](#part-7-final-structure)
8. [Resume & Portfolio](#part-8-resume--portfolio)

---

## PART 1: FEATURE EXPANSION

### 1.1 AI Paint Advisor

**Implementation Strategy:**

```javascript
// backend/services/aiAdvisor.js
class PaintAdvisorService {
  // Rule-based recommendation engine
  async getRecommendations(params) {
    const { roomType, lighting, mood, existingColors, budget } = params;
    
    // Color psychology mapping
    const moodColorMap = {
      'calm': ['#87AE73', '#B0E0E6', '#E6E6FA'], // Sage, Powder Blue, Lavender
      'energetic': ['#FF6B6B', '#FFC512', '#FF69B4'], // Coral, Sunflower, Hot Pink
      'professional': ['#1B2A4A', '#708090', '#F5F5F5'], // Navy, Slate, Pearl
      'cozy': ['#D4A96A', '#C27A5D', '#DCAE96'] // Warm Sand, Terracotta, Dusty Rose
    };
    
    // Room-specific recommendations
    const roomRecommendations = {
      'bedroom': { finishes: ['Matt', 'Silk'], colors: moodColorMap.calm },
      'kitchen': { finishes: ['Satin', 'Semi-Gloss'], colors: ['#FFFFFF', '#FFFDD0'] },
      'living_room': { finishes: ['Matt', 'Silk'], colors: moodColorMap.professional },
      'bathroom': { finishes: ['Semi-Gloss', 'Gloss'], colors: ['#87CEEB', '#F5FFFA'] }
    };
    
    // Lighting adjustments
    const lightingAdjustments = {
      'low': 'lighter_shades', // Recommend 20% lighter
      'medium': 'true_to_sample',
      'high': 'slightly_darker' // Recommend 10% darker
    };
    
    // Get base recommendations
    const baseColors = roomRecommendations[roomType]?.colors || moodColorMap[mood];
    const finishes = roomRecommendations[roomType]?.finishes || ['Matt'];
    
    // Query database with filters
    const recommendations = await Paint.find({
      hexCode: { $in: baseColors },
      finishType: { $in: finishes },
      price: { $lte: budget },
      stock: { $gt: 0 }
    })
    .sort({ rating: -1, reviews: -1 })
    .limit(10);
    
    // Add AI reasoning
    return recommendations.map(paint => ({
      ...paint.toObject(),
      aiReasoning: this.generateReasoning(paint, roomType, mood, lighting),
      confidenceScore: this.calculateConfidence(paint, params)
    }));
  }
  
  generateReasoning(paint, roomType, mood, lighting) {
    return `${paint.colour} is perfect for ${roomType} because it creates a ${mood} atmosphere. 
            With ${lighting} lighting, this ${paint.finishType} finish will ${this.getLightingEffect(lighting)}.`;
  }
  
  calculateConfidence(paint, params) {
    let score = 0.5;
    if (paint.rating > 4.5) score += 0.2;
    if (paint.reviews > 100) score += 0.15;
    if (paint.isBestseller) score += 0.15;
    return Math.min(score, 1.0);
  }
}
```

**Frontend Component:**

```jsx
// frontend/src/components/AIPaintAdvisor.jsx
import { useState } from 'react';
import { aiAdvisorAPI } from '../api';

export default function AIPaintAdvisor() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    roomType: '',
    lighting: '',
    mood: '',
    budget: 5000
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const results = await aiAdvisorAPI.getRecommendations(formData);
      setRecommendations(results);
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">AI Paint Advisor</h2>
          <div className="grid grid-cols-2 gap-4">
            <select 
              value={formData.roomType}
              onChange={(e) => setFormData({...formData, roomType: e.target.value})}
              className="p-3 border rounded-lg"
            >
              <option value="">Select Room Type</option>
              <option value="bedroom">Bedroom</option>
              <option value="living_room">Living Room</option>
              <option value="kitchen">Kitchen</option>
              <option value="bathroom">Bathroom</option>
            </select>
            
            <select 
              value={formData.lighting}
              onChange={(e) => setFormData({...formData, lighting: e.target.value})}
              className="p-3 border rounded-lg"
            >
              <option value="">Lighting Condition</option>
              <option value="low">Low (North-facing)</option>
              <option value="medium">Medium</option>
              <option value="high">High (South-facing)</option>
            </select>
            
            <select 
              value={formData.mood}
              onChange={(e) => setFormData({...formData, mood: e.target.value})}
              className="p-3 border rounded-lg"
            >
              <option value="">Desired Mood</option>
              <option value="calm">Calm & Relaxing</option>
              <option value="energetic">Energetic & Vibrant</option>
              <option value="professional">Professional</option>
              <option value="cozy">Cozy & Warm</option>
            </select>
            
            <div>
              <label className="block text-sm mb-2">Budget: ₹{formData.budget}</label>
              <input 
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full"
              />
            </div>
          </div>
          
          <button 
            onClick={handleGetRecommendations}
            disabled={!formData.roomType || !formData.lighting || !formData.mood}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            Get AI Recommendations
          </button>
        </div>
      )}
      
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Your Personalized Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map(paint => (
              <div key={paint._id} className="border rounded-lg p-4 space-y-3">
                <div 
                  className="h-32 rounded-lg"
                  style={{ backgroundColor: paint.hexCode }}
                />
                <h4 className="font-bold">{paint.name}</h4>
                <p className="text-sm text-gray-600">{paint.aiReasoning}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">₹{paint.price}</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    {(paint.confidenceScore * 100).toFixed(0)}% Match
                  </span>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded-lg">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### 1.2 AR Room Visualizer

**Backend Implementation:**

```javascript
// backend/services/imageProcessing.js
import sharp from 'sharp';
import { createCanvas, loadImage } from 'canvas';

class ImageProcessingService {
  async applyColorToWall(imageBuffer, hexColor, maskCoordinates) {
    // Load image
    const image = await loadImage(imageBuffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    // Draw original image
    ctx.drawImage(image, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Convert hex to RGB
    const rgb = this.hexToRgb(hexColor);
    
    // Apply color with blend mode
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor((i / 4) / canvas.width);
      
      // Check if pixel is in mask
      if (this.isInMask(x, y, maskCoordinates)) {
        // Preserve luminance, change hue
        const [h, s, l] = this.rgbToHsl(data[i], data[i + 1], data[i + 2]);
        const [newH, newS] = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const [r, g, b] = this.hslToRgb(newH, newS, l);
        
        // Blend with original (70% new color, 30% original for texture)
        data[i] = r * 0.7 + data[i] * 0.3;
        data[i + 1] = g * 0.7 + data[i + 1] * 0.3;
        data[i + 2] = b * 0.7 + data[i + 2] * 0.3;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toBuffer('image/png');
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h, s, l];
  }
  
  hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  
  isInMask(x, y, maskCoordinates) {
    // Point-in-polygon algorithm
    let inside = false;
    for (let i = 0, j = maskCoordinates.length - 1; i < maskCoordinates.length; j = i++) {
      const xi = maskCoordinates[i].x, yi = maskCoordinates[i].y;
      const xj = maskCoordinates[j].x, yj = maskCoordinates[j].y;
      
      const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
}

// API Route
router.post('/visualizer/apply-color', upload.single('image'), async (req, res) => {
  try {
    const { hexColor, maskCoordinates } = req.body;
    const imageBuffer = req.file.buffer;
    
    const processor = new ImageProcessingService();
    const resultBuffer = await processor.applyColorToWall(
      imageBuffer,
      hexColor,
      JSON.parse(maskCoordinates)
    );
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'visualizer' },
      (error, result) => {
        if (error) throw error;
        res.json({ imageUrl: result.secure_url });
      }
    ).end(resultBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Frontend AR Visualizer:**

```jsx
// frontend/src/components/ARVisualizer.jsx
import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva';
import useImage from 'use-image';

export default function ARVisualizer() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [image] = useImage(uploadedImage);
  const [maskPoints, setMaskPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [processedImage, setProcessedImage] = useState(null);
  const stageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleStageClick = (e) => {
    if (!isDrawing) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setMaskPoints([...maskPoints, { x: point.x, y: point.y }]);
  };

  const handleApplyColor = async () => {
    if (maskPoints.length < 3) {
      alert('Please draw a mask area first');
      return;
    }

    const formData = new FormData();
    const blob = await fetch(uploadedImage).then(r => r.blob());
    formData.append('image', blob);
    formData.append('hexColor', selectedColor);
    formData.append('maskCoordinates', JSON.stringify(maskPoints));

    const response = await fetch('/api/visualizer/apply-color', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    setProcessedImage(data.imageUrl);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">AR Room Visualizer</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">Upload Room Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-semibold">Select Paint Color</label>
            <input 
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full h-12 rounded cursor-pointer"
            />
          </div>
          
          <button
            onClick={() => setIsDrawing(!isDrawing)}
            className={`w-full py-2 rounded font-semibold ${
              isDrawing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {isDrawing ? 'Stop Drawing' : 'Draw Wall Area'}
          </button>
          
          <button
            onClick={() => setMaskPoints([])}
            className="w-full py-2 bg-gray-500 text-white rounded font-semibold"
          >
            Clear Mask
          </button>
          
          <button
            onClick={handleApplyColor}
            disabled={maskPoints.length < 3}
            className="w-full py-2 bg-primary text-white rounded font-semibold disabled:opacity-50"
          >
            Apply Color
          </button>
        </div>
        
        {/* Middle Panel - Canvas */}
        <div className="lg:col-span-2 border rounded-lg p-4">
          {uploadedImage ? (
            <Stage
              width={800}
              height={600}
              ref={stageRef}
              onClick={handleStageClick}
            >
              <Layer>
                <KonvaImage image={image} />
                {maskPoints.length > 0 && (
                  <Line
                    points={maskPoints.flatMap(p => [p.x, p.y])}
                    stroke="blue"
                    strokeWidth={2}
                    closed={maskPoints.length > 2}
                    fill="rgba(0, 0, 255, 0.2)"
                  />
                )}
              </Layer>
            </Stage>
          ) : (
            <div className="h-96 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Upload an image to start</p>
            </div>
          )}
          
          {processedImage && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Result:</h3>
              <img src={processedImage} alt="Processed" className="w-full rounded" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## PART 2: SYSTEM DESIGN & ARCHITECTURE

### 2.1 Folder Structure (Production-Grade)

```
mayur-paints/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   └── manifest.json
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductFilter.jsx
│   │   │   │   └── ProductDetail.jsx
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   ├── CartSummary.jsx
│   │   │   │   └── CheckoutSteps.jsx
│   │   │   ├── ai/
│   │   │   │   ├── AIPaintAdvisor.jsx
│   │   │   │   ├── ColorRecommendations.jsx
│   │   │   │   └── RoomTypeSelector.jsx
│   │   │   └── visualizer/
│   │   │       ├── ARVisualizer.jsx
│   │   │       ├── ColorPicker.jsx
│   │   │       └── ImageUploader.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── PaintsShop.jsx
│   │   │   ├── HardwareShop.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ColourCosmos.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── NotFound.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   ├── productSlice.js
│   │   │   └── uiSlice.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   ├── useProducts.js
│   │   │   └── useDebounce.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── constants.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.production
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── cloudinary.js
│   │   │   ├── razorpay.js
│   │   │   └── email.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Paint.js
│   │   │   ├── Hardware.js
│   │   │   ├── Order.js
│   │   │   ├── Review.js
│   │   │   ├── Wishlist.js
│   │   │   ├── Coupon.js
│   │   │   ├── Otp.js
│   │   │   └── InventoryLog.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   ├── reviewController.js
│   │   │   ├── wishlistController.js
│   │   │   ├── aiAdvisorController.js
│   │   │   └── visualizerController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   ├── payments.js
│   │   │   ├── reviews.js
│   │   │   ├── wishlist.js
│   │   │   ├── aiAdvisor.js
│   │   │   └── visualizer.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── upload.js
│   │   │   ├── errorHandler.js
│   │   │   └── validator.js
│   │   ├── services/
│   │   │   ├── emailService.js
│   │   │   ├── aiAdvisorService.js
│   │   │   ├── imageProcessingService.js
│   │   │   ├── paymentService.js
│   │   │   └── analyticsService.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   └── index.js
│   ├── uploads/
│   ├── logs/
│   ├── .env
│   ├── .env.production
│   └── package.json
├── .gitignore
├── README.md
├── DEPLOYMENT.md
└── docker-compose.yml
```

### 2.2 Database Schema Design

```javascript
// Enhanced Paint Schema with AI Features
const paintSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true, index: true },
  brand: { type: String, required: true, index: true },
  productLine: String,
  sku: { type: String, unique: true, required: true },
  
  // Category & Classification
  category: { type: String, required: true, index: true },
  subCategory: String,
  tags: [String],
  
  // Color Information
  colour: { type: String, required: true },
  hexCode: { type: String, required: true, index: true },
  colourFamily: { type: String, index: true },
  rgbValues: {
    r: Number,
    g: Number,
    b: Number
  },
  hslValues: {
    h: Number,
    s: Number,
    l: Number
  },
  
  // Pricing
  sizes: [{
    volume: String,
    price: Number,
    mrp: Number
  }],
  price: { type: Number, required: true, index: true },
  mrp: Number,
  
  // Technical Specs
  coverage: String,
  finishType: { type: String, enum: ['Matt', 'Silk', 'Satin', 'Gloss', 'Semi-Gloss', 'Textured'] },
  dryingTime: String,
  coats: Number,
  thinning: String,
  voc: String,
  
  // Features & Application
  features: [String],
  application: [String],
  surface: [String],
  
  // Inventory
  stock: { type: Number, default: 0, index: true },
  lowStockThreshold: { type: Number, default: 10 },
  
  // Ratings & Reviews
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  
  // Media
  imageUrl: String,
  images: [String],
  videoUrl: String,
  
  // Flags
  isPopular: { type: Boolean, default: false, index: true },
  isFeatured: { type: Boolean, default: false, index: true },
  isBestseller: { type: Boolean, default: false, index: true },
  isNewArrival: { type: Boolean, default: false, index: true },
  isActive: { type: Boolean, default: true, index: true },
  
  // AI Recommendation Data
  aiMetadata: {
    recommendedFor: [String], // ['bedroom', 'living_room', 'kitchen']
    moodTags: [String], // ['calm', 'energetic', 'professional']
    lightingCompatibility: {
      low: Number, // 0-1 score
      medium: Number,
      high: Number
    },
    complementaryColors: [String], // hex codes
    popularCombinations: [{
      accentColor: String,
      trimColor: String,
      usageCount: Number
    }]
  },
  
  // SEO
  description: String,
  metaTitle: String,
  metaDescription: String,
  slug: { type: String, unique: true, index: true },
  
  // Analytics
  viewCount: { type: Number, default: 0 },
  purchaseCount: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  
}, { timestamps: true });

// Indexes for performance
paintSchema.index({ brand: 1, category: 1 });
paintSchema.index({ price: 1, rating: -1 });
paintSchema.index({ colourFamily: 1, finishType: 1 });
paintSchema.index({ name: 'text', description: 'text', tags: 'text' });
```

### 2.3 API Design Patterns

```javascript
// RESTful API Structure with Versioning

// Base URL: /api/v1

// Authentication
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/verify-otp
POST   /api/v1/auth/resend-otp
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

// Products
GET    /api/v1/products                    // All products with filters
GET    /api/v1/products/search             // Search with query
GET    /api/v1/products/featured           // Featured products
GET    /api/v1/products/bestsellers        // Bestselling products
GET    /api/v1/products/:id                // Single product
POST   /api/v1/products                    // Create (Admin)
PUT    /api/v1/products/:id                // Update (Admin)
DELETE /api/v1/products/:id                // Delete (Admin)
PATCH  /api/v1/products/:id/stock          // Update stock (Admin)

// Paints Specific
GET    /api/v1/paints                      // All paints with filters
GET    /api/v1/paints/colors               // Get all unique colors
GET    /api/v1/paints/brands               // Get all brands
GET    /api/v1/paints/by-color-family/:family  // Filter by color family
GET    /api/v1/paints/:id/similar          // Similar paints

// Hardware Specific
GET    /api/v1/hardware                    // All hardware with filters
GET    /api/v1/hardware/categories         // Get all categories
GET    /api/v1/hardware/:id/compatible     // Compatible products

// AI Paint Advisor
POST   /api/v1/ai/recommendations          // Get AI recommendations
POST   /api/v1/ai/color-match              // Match colors from image
POST   /api/v1/ai/room-analysis            // Analyze room for suggestions
GET    /api/v1/ai/trending-colors          // Get trending color combinations

// AR Visualizer
POST   /api/v1/visualizer/upload           // Upload room image
POST   /api/v1/visualizer/apply-color      // Apply color to image
POST   /api/v1/visualizer/save-design      // Save design
GET    /api/v1/visualizer/designs          // Get user's saved designs
DELETE /api/v1/visualizer/designs/:id      // Delete saved design

// Cart
GET    /api/v1/cart                        // Get user cart
POST   /api/v1/cart/items                  // Add item to cart
PUT    /api/v1/cart/items/:id              // Update cart item
DELETE /api/v1/cart/items/:id              // Remove from cart
DELETE /api/v1/cart                        // Clear cart

// Wishlist
GET    /api/v1/wishlist                    // Get user wishlist
POST   /api/v1/wishlist                    // Add to wishlist
DELETE /api/v1/wishlist/:itemId            // Remove from wishlist

// Orders
GET    /api/v1/orders                      // Get user orders
GET    /api/v1/orders/:id                  // Get order details
POST   /api/v1/orders                      // Create order
PUT    /api/v1/orders/:id/cancel           // Cancel order
GET    /api/v1/orders/:id/track            // Track order

// Admin Orders
GET    /api/v1/admin/orders                // All orders
PUT    /api/v1/admin/orders/:id/status     // Update order status
GET    /api/v1/admin/orders/stats          // Order statistics

// Payments
POST   /api/v1/payments/create-order       // Create Razorpay order
POST   /api/v1/payments/verify             // Verify payment
POST   /api/v1/payments/refund             // Process refund (Admin)

// Reviews
GET    /api/v1/reviews/product/:id         // Get product reviews
POST   /api/v1/reviews                     // Add review
PUT    /api/v1/reviews/:id                 // Update review
DELETE /api/v1/reviews/:id                 // Delete review
POST   /api/v1/reviews/:id/helpful         // Mark review helpful

// Coupons
GET    /api/v1/coupons                     // Get available coupons
POST   /api/v1/coupons/validate            // Validate coupon
POST   /api/v1/admin/coupons               // Create coupon (Admin)
PUT    /api/v1/admin/coupons/:id           // Update coupon (Admin)
DELETE /api/v1/admin/coupons/:id           // Delete coupon (Admin)

// User Profile
GET    /api/v1/users/me                    // Get current user
PUT    /api/v1/users/me                    // Update profile
POST   /api/v1/users/me/address            // Add address
PUT    /api/v1/users/me/address/:id        // Update address
DELETE /api/v1/users/me/address/:id        // Delete address
POST   /api/v1/users/me/avatar             // Upload avatar

// Admin Analytics
GET    /api/v1/admin/analytics/dashboard   // Dashboard stats
GET    /api/v1/admin/analytics/revenue     // Revenue analytics
GET    /api/v1/admin/analytics/products    // Product analytics
GET    /api/v1/admin/analytics/customers   // Customer analytics
GET    /api/v1/admin/analytics/inventory   // Inventory analytics

// Admin Users
GET    /api/v1/admin/users                 // All users
GET    /api/v1/admin/users/:id             // User details
PUT    /api/v1/admin/users/:id/role        // Update user role
DELETE /api/v1/admin/users/:id             // Delete user

// Notifications
GET    /api/v1/notifications               // Get user notifications
PUT    /api/v1/notifications/:id/read      // Mark as read
DELETE /api/v1/notifications/:id           // Delete notification
```


### 2.4 Response Format Standards

```javascript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "meta": {
    "timestamp": "2026-04-14T10:30:00Z",
    "version": "1.0.0"
  }
}

// Paginated Response
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 1000,
    "totalPages": 84,
    "hasNext": true,
    "hasPrev": false
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-04-14T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## PART 3: AI FEATURES IMPLEMENTATION

### 3.1 Color Psychology Engine

```javascript
// backend/services/colorPsychologyService.js
export class ColorPsychologyService {
  constructor() {
    this.moodColorMap = {
      calm: {
        primary: ['#87AE73', '#B0E0E6', '#E6E6FA', '#F5FFFA'],
        accent: ['#9FE2BF', '#C8A2C8'],
        description: 'Soft greens, blues, and lavenders promote relaxation'
      },
      energetic: {
        primary: ['#FF6B6B', '#FFC512', '#FF69B4', '#F4C430'],
        accent: ['#E97451', '#FC8EAC'],
        description: 'Vibrant reds, yellows, and pinks stimulate energy'
      },
      professional: {
        primary: ['#1B2A4A', '#708090', '#F5F5F5', '#4682B4'],
        accent: ['#C0C0C0', '#367588'],
        description: 'Navy, gray, and white convey professionalism'
      },
      cozy: {
        primary: ['#D4A96A', '#C27A5D', '#DCAE96', '#C68642'],
        accent: ['#A0522D', '#C3B091'],
        description: 'Warm earth tones create intimate spaces'
      },
      creative: {
        primary: ['#9966CC', '#50C878', '#FFD700', '#FF6B6B'],
        accent: ['#EE82EE', '#32CD32'],
        description: 'Bold purples, greens, and mixed hues inspire creativity'
      },
      minimalist: {
        primary: ['#FFFFFF', '#F5F5F5', '#36454F', '#E5E4E2'],
        accent: ['#383838'],
        description: 'Monochromatic whites and grays for clean aesthetics'
      }
    };
    
    this.roomTypeRecommendations = {
      bedroom: {
        moods: ['calm', 'cozy'],
        finishes: ['Matt', 'Silk'],
        avoidColors: ['#FF0000', '#FFFF00'], // Bright red, yellow
        lightingConsideration: 'Softer colors work best with bedroom lighting'
      },
      living_room: {
        moods: ['professional', 'cozy', 'creative'],
        finishes: ['Matt', 'Silk', 'Satin'],
        avoidColors: [],
        lightingConsideration: 'Consider natural light exposure'
      },
      kitchen: {
        moods: ['energetic', 'minimalist'],
        finishes: ['Satin', 'Semi-Gloss', 'Gloss'],
        avoidColors: ['#800020', '#6A0DAD'], // Dark burgundy, purple
        lightingConsideration: 'Washable finishes essential'
      },
      bathroom: {
        moods: ['calm', 'minimalist'],
        finishes: ['Semi-Gloss', 'Gloss'],
        avoidColors: [],
        lightingConsideration: 'Moisture-resistant finishes required'
      },
      office: {
        moods: ['professional', 'creative'],
        finishes: ['Matt', 'Satin'],
        avoidColors: ['#FF69B4', '#FF6B6B'], // Hot pink, coral
        lightingConsideration: 'Reduce glare for screen work'
      },
      kids_room: {
        moods: ['energetic', 'creative'],
        finishes: ['Matt', 'Satin'],
        avoidColors: [],
        lightingConsideration: 'Washable paints recommended'
      }
    };
  }
  
  getColorRecommendations(roomType, mood, lighting, budget) {
    const roomRec = this.roomTypeRecommendations[roomType];
    const moodColors = this.moodColorMap[mood];
    
    if (!roomRec || !moodColors) {
      throw new Error('Invalid room type or mood');
    }
    
    // Adjust colors based on lighting
    let recommendedColors = [...moodColors.primary];
    
    if (lighting === 'low') {
      // Recommend lighter shades for low light
      recommendedColors = this.adjustBrightness(recommendedColors, 1.2);
    } else if (lighting === 'high') {
      // Slightly darker for high light
      recommendedColors = this.adjustBrightness(recommendedColors, 0.9);
    }
    
    // Filter out avoided colors
    recommendedColors = recommendedColors.filter(color => 
      !roomRec.avoidColors.includes(color)
    );
    
    return {
      colors: recommendedColors,
      finishes: roomRec.finishes,
      reasoning: {
        mood: moodColors.description,
        room: roomRec.lightingConsideration,
        lighting: this.getLightingAdvice(lighting)
      }
    };
  }
  
  adjustBrightness(hexColors, factor) {
    return hexColors.map(hex => {
      const rgb = this.hexToRgb(hex);
      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
      hsl[2] = Math.min(1, Math.max(0, hsl[2] * factor));
      const newRgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);
      return this.rgbToHex(newRgb[0], newRgb[1], newRgb[2]);
    });
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h, s, l];
  }
  
  hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  
  getLightingAdvice(lighting) {
    const advice = {
      low: 'Choose lighter shades as they appear darker in low light. Avoid deep colors.',
      medium: 'Most colors will appear true to sample. Standard recommendations apply.',
      high: 'Colors may appear lighter. Consider slightly deeper shades for desired effect.'
    };
    return advice[lighting] || advice.medium;
  }
  
  getComplementaryColors(hexCode) {
    const rgb = this.hexToRgb(hexCode);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Complementary (opposite on color wheel)
    const compH = (hsl[0] + 0.5) % 1;
    const complementary = this.hslToRgb(compH, hsl[1], hsl[2]);
    
    // Analogous (adjacent on color wheel)
    const analog1H = (hsl[0] + 0.083) % 1; // +30 degrees
    const analog2H = (hsl[0] - 0.083 + 1) % 1; // -30 degrees
    const analogous1 = this.hslToRgb(analog1H, hsl[1], hsl[2]);
    const analogous2 = this.hslToRgb(analog2H, hsl[1], hsl[2]);
    
    // Triadic (120 degrees apart)
    const triad1H = (hsl[0] + 0.333) % 1;
    const triad2H = (hsl[0] + 0.666) % 1;
    const triadic1 = this.hslToRgb(triad1H, hsl[1], hsl[2]);
    const triadic2 = this.hslToRgb(triad2H, hsl[1], hsl[2]);
    
    return {
      complementary: this.rgbToHex(...complementary),
      analogous: [
        this.rgbToHex(...analogous1),
        this.rgbToHex(...analogous2)
      ],
      triadic: [
        this.rgbToHex(...triadic1),
        this.rgbToHex(...triadic2)
      ]
    };
  }
}
```

### 3.2 Machine Learning Recommendation System

```javascript
// backend/services/mlRecommendationService.js
import Paint from '../models/Paint.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

export class MLRecommendationService {
  // Collaborative Filtering - Users who bought X also bought Y
  async getCollaborativeRecommendations(userId, limit = 10) {
    // Get user's purchase history
    const userOrders = await Order.find({ user: userId })
      .populate('items.product');
    
    const userPurchasedProducts = new Set();
    userOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.productType === 'Paint') {
          userPurchasedProducts.add(item.product._id.toString());
        }
      });
    });
    
    if (userPurchasedProducts.size === 0) {
      return this.getPopularProducts(limit);
    }
    
    // Find other users who bought similar products
    const similarUsers = await Order.aggregate([
      {
        $match: {
          'items.product': { $in: Array.from(userPurchasedProducts) },
          user: { $ne: userId }
        }
      },
      {
        $group: {
          _id: '$user',
          commonProducts: { $sum: 1 }
        }
      },
      { $sort: { commonProducts: -1 } },
      { $limit: 50 }
    ]);
    
    // Get products bought by similar users
    const similarUserIds = similarUsers.map(u => u._id);
    const recommendations = await Order.aggregate([
      {
        $match: {
          user: { $in: similarUserIds },
          'items.productType': 'Paint'
        }
      },
      { $unwind: '$items' },
      {
        $match: {
          'items.productType': 'Paint',
          'items.product': { $nin: Array.from(userPurchasedProducts) }
        }
      },
      {
        $group: {
          _id: '$items.product',
          frequency: { $sum: 1 }
        }
      },
      { $sort: { frequency: -1 } },
      { $limit: limit }
    ]);
    
    const productIds = recommendations.map(r => r._id);
    const products = await Paint.find({ _id: { $in: productIds } });
    
    return products.map(product => ({
      ...product.toObject(),
      recommendationScore: recommendations.find(r => 
        r._id.toString() === product._id.toString()
      ).frequency,
      recommendationType: 'collaborative'
    }));
  }
  
  // Content-Based Filtering - Similar products based on attributes
  async getContentBasedRecommendations(productId, limit = 10) {
    const product = await Paint.findById(productId);
    if (!product) return [];
    
    // Find similar products based on multiple attributes
    const recommendations = await Paint.aggregate([
      {
        $match: {
          _id: { $ne: product._id },
          isActive: true,
          stock: { $gt: 0 }
        }
      },
      {
        $addFields: {
          similarityScore: {
            $add: [
              // Same color family: +30 points
              { $cond: [{ $eq: ['$colourFamily', product.colourFamily] }, 30, 0] },
              // Same finish type: +20 points
              { $cond: [{ $eq: ['$finishType', product.finishType] }, 20, 0] },
              // Same category: +15 points
              { $cond: [{ $eq: ['$category', product.category] }, 15, 0] },
              // Same brand: +10 points
              { $cond: [{ $eq: ['$brand', product.brand] }, 10, 0] },
              // Similar price range (±20%): +10 points
              {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$price', product.price * 0.8] },
                      { $lte: ['$price', product.price * 1.2] }
                    ]
                  },
                  10,
                  0
                ]
              },
              // High rating: +5 points
              { $cond: [{ $gte: ['$rating', 4.5] }, 5, 0] }
            ]
          }
        }
      },
      { $sort: { similarityScore: -1, rating: -1 } },
      { $limit: limit }
    ]);
    
    return recommendations.map(rec => ({
      ...rec,
      recommendationType: 'content-based'
    }));
  }
  
  // Trending Products - Based on recent purchases and views
  async getTrendingProducts(days = 7, limit = 10) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const trending = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'items.productType': 'Paint'
        }
      },
      { $unwind: '$items' },
      {
        $match: { 'items.productType': 'Paint' }
      },
      {
        $group: {
          _id: '$items.product',
          purchaseCount: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'paints',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $addFields: {
          trendingScore: {
            $add: [
              { $multiply: ['$purchaseCount', 10] },
              { $multiply: ['$product.viewCount', 0.1] },
              { $multiply: ['$product.rating', 5] }
            ]
          }
        }
      },
      { $sort: { trendingScore: -1 } },
      { $limit: limit }
    ]);
    
    return trending.map(item => ({
      ...item.product,
      trendingScore: item.trendingScore,
      recentPurchases: item.purchaseCount,
      recommendationType: 'trending'
    }));
  }
  
  // Personalized Recommendations - Hybrid approach
  async getPersonalizedRecommendations(userId, limit = 10) {
    const [collaborative, trending] = await Promise.all([
      this.getCollaborativeRecommendations(userId, Math.ceil(limit * 0.6)),
      this.getTrendingProducts(7, Math.ceil(limit * 0.4))
    ]);
    
    // Merge and deduplicate
    const seen = new Set();
    const merged = [];
    
    [...collaborative, ...trending].forEach(product => {
      const id = product._id.toString();
      if (!seen.has(id) && merged.length < limit) {
        seen.add(id);
        merged.push(product);
      }
    });
    
    return merged;
  }
  
  async getPopularProducts(limit = 10) {
    return await Paint.find({ isActive: true, stock: { $gt: 0 } })
      .sort({ rating: -1, reviews: -1, purchaseCount: -1 })
      .limit(limit);
  }
}
```


---

## PART 4: 3D/AR VISUALIZER (ADVANCED)

### 4.1 Three.js Room Visualizer

```javascript
// frontend/src/components/visualizer/ThreeJSRoomVisualizer.jsx
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function ThreeJSRoomVisualizer() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [roomModel, setRoomModel] = useState(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Create default room
    createDefaultRoom(scene);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  const createDefaultRoom = (scene) => {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.9
    });
    
    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 5),
      wallMaterial.clone()
    );
    backWall.position.set(0, 2.5, -5);
    backWall.name = 'backWall';
    scene.add(backWall);
    
    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 5),
      wallMaterial.clone()
    );
    leftWall.position.set(-5, 2.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.name = 'leftWall';
    scene.add(leftWall);
    
    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 5),
      wallMaterial.clone()
    );
    rightWall.position.set(5, 2.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.name = 'rightWall';
    scene.add(rightWall);
  };
  
  const applyColorToWalls = (hexColor) => {
    if (!sceneRef.current) return;
    
    const color = new THREE.Color(hexColor);
    
    ['backWall', 'leftWall', 'rightWall'].forEach(wallName => {
      const wall = sceneRef.current.getObjectByName(wallName);
      if (wall) {
        wall.material.color = color;
      }
    });
  };
  
  useEffect(() => {
    applyColorToWalls(selectedColor);
  }, [selectedColor]);
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-2/3">
        <div 
          ref={mountRef} 
          className="w-full h-[600px] border rounded-lg"
        />
      </div>
      
      <div className="lg:w-1/3 space-y-4">
        <h3 className="text-xl font-bold">3D Room Visualizer</h3>
        
        <div>
          <label className="block mb-2 font-semibold">Select Wall Color</label>
          <input 
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full h-12 rounded cursor-pointer"
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Use your mouse to:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            <li>Left click + drag to rotate</li>
            <li>Right click + drag to pan</li>
            <li>Scroll to zoom</li>
          </ul>
        </div>
        
        <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold">
          Save Design
        </button>
      </div>
    </div>
  );
}
```

### 4.2 Performance Optimization

```javascript
// frontend/src/utils/imageOptimization.js
export class ImageOptimizer {
  static async compressImage(file, maxWidth = 1920, quality = 0.8) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => resolve(blob),
            'image/jpeg',
            quality
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
  
  static async generateThumbnail(file, size = 200) {
    return this.compressImage(file, size, 0.7);
  }
}
```

---

## PART 5: PAYMENT & INTEGRATIONS

### 5.1 Advanced Razorpay Integration

```javascript
// backend/services/paymentService.js
import Razorpay from 'razorpay';
import crypto f