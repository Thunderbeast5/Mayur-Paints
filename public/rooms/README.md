# Room Images for Wall Visualizer

## Required Images

Place the following images in this directory:

### Living Room
- `living-room.jpg` - Original room image (1200x800)
- `living-room-mask.png` - White mask where walls are white, everything else is black

### Bedroom  
- `bedroom.jpg` - Original room image (1200x800)
- `bedroom-mask.png` - White mask where walls are white, everything else is black

### Kitchen
- `kitchen.jpg` - Original room image (1200x800)
- `kitchen-mask.png` - White mask where walls are white, everything else is black

### Bathroom
- `bathroom.jpg` - Original room image (1200x800)
- `bathroom-mask.png` - White mask where walls are white, everything else is black

## Mask Creation Instructions

1. **Use Photoshop/GIMP**:
   - Open room image
   - Create new layer
   - Paint walls with pure white (#FFFFFF)
   - Paint everything else with pure black (#000000)
   - Save as PNG

2. **Use remove.bg**:
   - Upload room image
   - Download transparent background
   - Fill walls with white, everything else black
   - Save as PNG

3. **Manual Drawing**:
   - Fastest method for demo
   - Use rectangle tool to outline walls
   - Fill with white
   - Save as PNG

## Important Notes

- **White pixels** = Walls (paint will be applied here)
- **Black pixels** = Everything else (no paint applied)
- **PNG format** required for transparency
- **1200x800** recommended resolution
- **Pure colors** (#FFFFFF and #000000) work best
