# Wall Masks for Visualizer

## How Masks Work

Masks are **binary images** that tell the visualizer WHERE to apply paint:

- **White pixels** (#FFFFFF) = Wall areas (paint will be applied)
- **Black pixels** (#000000) = Everything else (no paint applied)

## Algorithm Logic

```javascript
// Check each pixel in the mask
if (maskData[i] > 200) { // White pixel = wall
  // Apply paint to original image
  imageData.data[i] = blend(original, paintColor)
}
```

## Creating Perfect Masks

### Method 1: Photoshop (Recommended)
1. Open room image in Photoshop
2. Create new layer
3. Use brush tool with pure white (#FFFFFF)
4. Paint only the wall areas
5. Fill everything else with pure black (#000000)
6. Save as PNG (not JPEG)

### Method 2: Online Tools
1. Use `remove.bg` to remove background
2. Download transparent image
3. Fill walls with white, everything else black
4. Save as PNG

### Method 3: Quick Manual (Fast for Demo)
1. Use rectangle selection tool
2. Select wall areas
3. Fill with white
4. Invert selection
5. Fill with black
6. Save as PNG

## Technical Requirements

- **Format**: PNG (supports transparency)
- **Colors**: Pure white (#FFFFFF) and pure black (#000000)
- **Resolution**: Match original room image
- **Size**: Keep file size reasonable (< 1MB)

## Testing Your Mask

1. Load mask in image viewer
2. Walls should appear pure white
3. Everything else should be pure black
4. No gray areas (threshold > 200)

## Example Mask Structure

```
living-room-mask.png
├── White areas (walls)
│   ├── Main back wall
│   ├── Left wall
│   └── Right wall
└── Black areas (no paint)
    ├── Floor
    ├── Ceiling
    ├── Furniture
    ├── Windows
    └── Doors
```

## Common Issues & Solutions

### Issue: Gray areas in mask
**Solution**: Use threshold tool to convert to pure black/white

### Issue: Paint appears on furniture
**Solution**: Paint furniture areas with pure black in mask

### Issue: Walls not getting painted
**Solution**: Ensure wall areas are pure white (#FFFFFF)

### Issue: Mask doesn't align with image
**Solution**: Ensure mask and room image have identical dimensions
