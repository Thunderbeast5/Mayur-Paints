import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from './models/User.js'
import Paint from './models/Paint.js'
import Hardware from './models/Hardware.js'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mayurpaints'

// Paint generation data
const brands = {
  'Asian Paints': { count: 200, lines: ['Royale Shyne', 'Royale', 'Apex Ultima', 'Apcolite', 'Tractor Emulsion', 'Woodtech'] },
  'Berger Paints': { count: 160, lines: ['Silk', 'Silk Glamour', 'WeatherCoat', 'Easy Clean', 'Bison Acrylic', 'Luxol'] },
  'Nerolac': { count: 150, lines: ['Impressions', 'Impressions HD', 'Excel', 'Excel Mica Marble', 'Beauty Gold', 'Suraksha'] },
  'Dulux': { count: 120, lines: ['Weathershield', 'Velvet Touch', 'Promise', 'Pentalite', 'Wash & Wear'] },
  'Indigo Paints': { count: 100, lines: ['Acrylic Emulsion', 'Utsav', 'Paints of the Past', 'Exterior Acrylic'] },
  'Nippon Paint': { count: 100, lines: ['Weatherbond', 'Vinilex', 'Spotless', 'Ezyclean', 'Momento'] },
  'Jotun': { count: 80, lines: ['Essence Matt', 'Majestic', 'Jotashield', 'Jotashield Textura'] },
  'Shalimar Paints': { count: 60, lines: ['Superlac', 'Sigmacryl', 'Shalimar Enamel', 'Shalimar Primer'] },
  'Kamdhenu': { count: 30, lines: ['Kamdhenu Emulsion', 'Kamdhenu Enamel', 'Kamdhenu Primer'] }
}

const colours = [
  { name: "Pure White", hex: "#FFFFFF", family: "Whites & Neutrals" },
  { name: "Antique White", hex: "#FAEBD7", family: "Whites & Neutrals" },
  { name: "Ivory", hex: "#FFFFF0", family: "Whites & Neutrals" },
  { name: "Cream", hex: "#FFFDD0", family: "Whites & Neutrals" },
  { name: "Pearl White", hex: "#F5F5F5", family: "Whites & Neutrals" },
  { name: "Off White", hex: "#FAF9F6", family: "Whites & Neutrals" },
  { name: "Linen", hex: "#FAF0E6", family: "Whites & Neutrals" },
  { name: "Alabaster", hex: "#F2F0EB", family: "Whites & Neutrals" },
  { name: "Lemon Zest", hex: "#FFF44F", family: "Yellows" },
  { name: "Sunflower", hex: "#FFC512", family: "Yellows" },
  { name: "Marigold", hex: "#ECA727", family: "Yellows" },
  { name: "Mango Yellow", hex: "#FFD93D", family: "Yellows" },
  { name: "Peach Blossom", hex: "#FFCBA4", family: "Oranges & Peaches" },
  { name: "Apricot", hex: "#FBCEB1", family: "Oranges & Peaches" },
  { name: "Coral", hex: "#FF6B6B", family: "Reds & Pinks" },
  { name: "Terracotta", hex: "#C27A5D", family: "Oranges & Peaches" },
  { name: "Burnt Sienna", hex: "#E97451", family: "Oranges & Peaches" },
  { name: "Saffron", hex: "#F4C430", family: "Yellows" },
  { name: "Rose Petal", hex: "#FFB7C5", family: "Reds & Pinks" },
  { name: "Dusty Rose", hex: "#DCAE96", family: "Reds & Pinks" },
  { name: "Blush", hex: "#DE5D83", family: "Reds & Pinks" },
  { name: "Crimson", hex: "#DC143C", family: "Reds & Pinks" },
  { name: "Burgundy", hex: "#800020", family: "Reds & Pinks" },
  { name: "Marsala", hex: "#96524A", family: "Reds & Pinks" },
  { name: "Flamingo", hex: "#FC8EAC", family: "Reds & Pinks" },
  { name: "Salmon", hex: "#FA8072", family: "Reds & Pinks" },
  { name: "Candy Pink", hex: "#FFB3BA", family: "Reds & Pinks" },
  { name: "Hot Pink", hex: "#FF69B4", family: "Reds & Pinks" },
  { name: "Navy Blue", hex: "#1B2A4A", family: "Blues" },
  { name: "Sky Blue", hex: "#87CEEB", family: "Blues" },
  { name: "Ocean Mist", hex: "#B0D8E3", family: "Blues" },
  { name: "Steel Blue", hex: "#4682B4", family: "Blues" },
  { name: "Powder Blue", hex: "#B0E0E6", family: "Blues" },
  { name: "Royal Blue", hex: "#4169E1", family: "Blues" },
  { name: "Teal Blue", hex: "#367588", family: "Blues" },
  { name: "Denim", hex: "#1560BD", family: "Blues" },
  { name: "Baby Blue", hex: "#89CFF0", family: "Blues" },
  { name: "Cornflower", hex: "#6495ED", family: "Blues" },
  { name: "Forest Green", hex: "#228B22", family: "Greens" },
  { name: "Sage Green", hex: "#87AE73", family: "Greens" },
  { name: "Mint Cream", hex: "#F5FFFA", family: "Greens" },
  { name: "Olive", hex: "#808000", family: "Greens" },
  { name: "Moss Green", hex: "#8A9A5B", family: "Greens" },
  { name: "Seafoam", hex: "#9FE2BF", family: "Greens" },
  { name: "Emerald", hex: "#50C878", family: "Greens" },
  { name: "Fern", hex: "#4F7942", family: "Greens" },
  { name: "Lime", hex: "#32CD32", family: "Greens" },
  { name: "Pistachio", hex: "#93C572", family: "Greens" },
  { name: "Lavender", hex: "#E6E6FA", family: "Purples" },
  { name: "Mauve", hex: "#E0B0FF", family: "Purples" },
  { name: "Lilac", hex: "#C8A2C8", family: "Purples" },
  { name: "Plum", hex: "#DDA0DD", family: "Purples" },
  { name: "Violet", hex: "#EE82EE", family: "Purples" },
  { name: "Amethyst", hex: "#9966CC", family: "Purples" },
  { name: "Wisteria", hex: "#C9A0DC", family: "Purples" },
  { name: "Periwinkle", hex: "#CCCCFF", family: "Purples" },
  { name: "Purple Haze", hex: "#6A0DAD", family: "Purples" },
  { name: "Mulberry", hex: "#C54B8C", family: "Purples" },
  { name: "Warm Sand", hex: "#D4A96A", family: "Browns & Tans" },
  { name: "Caramel", hex: "#C68642", family: "Browns & Tans" },
  { name: "Chocolate", hex: "#7B3F00", family: "Browns & Tans" },
  { name: "Mahogany", hex: "#C04000", family: "Browns & Tans" },
  { name: "Sienna", hex: "#A0522D", family: "Browns & Tans" },
  { name: "Khaki", hex: "#C3B091", family: "Browns & Tans" },
  { name: "Taupe", hex: "#483C32", family: "Browns & Tans" },
  { name: "Tan", hex: "#D2B48C", family: "Browns & Tans" },
  { name: "Beige", hex: "#F5F5DC", family: "Browns & Tans" },
  { name: "Umber", hex: "#635147", family: "Browns & Tans" },
  { name: "Charcoal", hex: "#36454F", family: "Grays" },
  { name: "Slate Gray", hex: "#708090", family: "Grays" },
  { name: "Silver", hex: "#C0C0C0", family: "Grays" },
  { name: "Ash Gray", hex: "#B2BEB5", family: "Grays" },
  { name: "Steel Gray", hex: "#71797E", family: "Grays" },
  { name: "Graphite", hex: "#383838", family: "Grays" },
  { name: "Smoke", hex: "#848884", family: "Grays" },
  { name: "Pewter", hex: "#96A8A1", family: "Grays" },
  { name: "Platinum", hex: "#E5E4E2", family: "Grays" },
  { name: "Gold", hex: "#FFD700", family: "Metallics" },
  { name: "Bronze", hex: "#CD7F32", family: "Metallics" },
  { name: "Copper", hex: "#B87333", family: "Metallics" },
  { name: "Rose Gold", hex: "#B76E79", family: "Metallics" },
  { name: "Champagne", hex: "#F7E7CE", family: "Metallics" }
]

const categories = [
  { name: "Interior Emulsion", sub: ["Matt Finish", "Silk Finish", "Satin Finish"], priceRange: [400, 550] },
  { name: "Exterior Emulsion", sub: ["Weather Coat", "All Weather"], priceRange: [380, 480] },
  { name: "Enamel", sub: ["Synthetic Enamel", "Gloss Enamel"], priceRange: [250, 400] },
  { name: "Primer", sub: ["Wall Primer", "Wood Primer", "Metal Primer"], priceRange: [180, 320] },
  { name: "Texture Paint", sub: ["Designer Texture", "Rustic Finish"], priceRange: [600, 1200] },
  { name: "Wood Finish", sub: ["Varnish", "Wood Stain", "PU Finish"], priceRange: [700, 1500] },
  { name: "Waterproofing", sub: ["Acrylic", "Bituminous"], priceRange: [450, 900] },
  { name: "Distemper", sub: ["Acrylic Distemper", "Synthetic Distemper"], priceRange: [100, 180] }
]

function generatePaints(targetCount) {
  const paints = []
  let counter = 1
  
  for (const [brandName, brandData] of Object.entries(brands)) {
    const productsForBrand = brandData.count
    
    for (let i = 0; i < productsForBrand; i++) {
      const productLine = brandData.lines[i % brandData.lines.length]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const subCategory = category.sub[Math.floor(Math.random() * category.sub.length)]
      const colour = colours[Math.floor(Math.random() * colours.length)]
      
      const basePrice = Math.floor(Math.random() * (category.priceRange[1] - category.priceRange[0])) + category.priceRange[0]
      
      paints.push({
        name: `${brandName} ${productLine} ${category.name} - ${colour.name}`,
        brand: brandName,
        productLine: productLine,
        category: category.name,
        subCategory: subCategory,
        colour: colour.name,
        hexCode: colour.hex,
        colourFamily: colour.family,
        sizes: [
          { volume: "1L", price: basePrice },
          { volume: "4L", price: Math.floor(basePrice * 3.8) },
          { volume: "10L", price: Math.floor(basePrice * 9.2) },
          { volume: "20L", price: Math.floor(basePrice * 17.5) }
        ],
        price: basePrice,
        mrp: Math.floor(basePrice * 1.08),
        coverage: `${Math.floor(Math.random() * 40) + 100}-${Math.floor(Math.random() * 40) + 130} sq ft per litre`,
        finishType: subCategory.includes('Matt') ? 'Matt' : subCategory.includes('Silk') ? 'Silk' : subCategory.includes('Satin') ? 'Satin' : 'Gloss',
        dryingTime: `Surface dry: ${Math.floor(Math.random() * 30) + 20} min, Recoat: ${Math.floor(Math.random() * 4) + 3} hrs`,
        coats: Math.floor(Math.random() * 2) + 2,
        thinning: `${Math.floor(Math.random() * 10) + 5}-${Math.floor(Math.random() * 10) + 10}% water`,
        voc: "Low VOC < 50 g/L",
        features: [
          "Washable",
          "Anti-fungal",
          "Low VOC",
          Math.random() > 0.5 ? "UV Resistant" : "Stain Guard",
          Math.random() > 0.5 ? "Anti-Bacterial" : "Dust Resistant"
        ].slice(0, Math.floor(Math.random() * 3) + 3),
        application: ["Brush", "Roller"],
        surface: category.name.includes('Interior') ? ["Interior walls", "Ceilings"] : ["Exterior walls", "Facades"],
        stock: Math.floor(Math.random() * 200) + 20,
        rating: (Math.random() * 1.3 + 3.6).toFixed(1),
        reviews: Math.floor(Math.random() * 500) + 12,
        imageUrl: `https://picsum.photos/seed/paint${String(counter).padStart(4, '0')}/400/400`,
        sku: `${brandName.substring(0, 2).toUpperCase()}-${productLine.substring(0, 3).toUpperCase()}-${colour.name.replace(/\s/g, '').substring(0, 6).toUpperCase()}-${counter}`,
        isPopular: Math.random() > 0.85,
        isFeatured: Math.random() > 0.92,
        isBestseller: Math.random() > 0.88,
        isNewArrival: Math.random() > 0.90,
        tags: [category.name.toLowerCase(), subCategory.toLowerCase(), colour.family.toLowerCase()],
        description: `${brandName} ${productLine} ${category.name} in ${colour.name}. Premium quality paint with excellent coverage and durability.`
      })
      
      counter++
      if (counter > targetCount) break
    }
    if (counter > targetCount) break
  }
  
  return paints
}

function generateHardware(targetCount) {
  const hardware = []
  const hardwareBrands = ['Stanley', 'Bosch', '3M India', 'Pidilite', 'Fischer', 'Black+Decker', 'DeWalt', 'CUMI', 'JK Cement', 'Birla White']
  
  const hardwareCategories = [
    { name: 'Brushes & Rollers', items: ['Paint Brush', 'Foam Roller', 'Texture Roller', 'Angled Brush', 'Trim Brush'], priceRange: [50, 800] },
    { name: 'Masking & Tape', items: ['Masking Tape', 'Duct Tape', 'Double Sided Tape', 'Painter Tape'], priceRange: [80, 350] },
    { name: 'Sandpaper & Abrasives', items: ['Sandpaper Sheet', 'Sanding Block', 'Wire Wool', 'Emery Paper'], priceRange: [30, 250] },
    { name: 'Putty & Fillers', items: ['Wall Putty', 'Wood Filler', 'Crack Filler', 'Acrylic Putty'], priceRange: [200, 800] },
    { name: 'Trowels & Scrapers', items: ['Putty Knife', 'Wall Scraper', 'Trowel', 'Flexible Scraper'], priceRange: [120, 450] },
    { name: 'Safety Equipment', items: ['Dust Mask', 'Safety Goggles', 'Work Gloves', 'Respirator'], priceRange: [50, 600] },
    { name: 'Spray Equipment', items: ['Spray Gun', 'Airless Sprayer', 'HVLP Sprayer', 'Spray Bottle'], priceRange: [500, 15000] },
    { name: 'Ladders & Scaffolding', items: ['Step Ladder', 'Extension Ladder', 'Platform Ladder', 'Folding Ladder'], priceRange: [1500, 8000] },
    { name: 'Measuring Tools', items: ['Tape Measure', 'Spirit Level', 'Laser Level', 'Angle Finder'], priceRange: [150, 3500] },
    { name: 'Adhesives & Sealants', items: ['Silicone Sealant', 'Acrylic Sealant', 'Construction Adhesive', 'Caulk'], priceRange: [120, 450] },
    { name: 'Mixing Equipment', items: ['Paint Mixer', 'Mixing Bucket', 'Stirring Stick', 'Electric Mixer'], priceRange: [80, 2500] },
    { name: 'Cleaning Supplies', items: ['Brush Cleaner', 'Paint Thinner', 'Turpentine', 'Cleaning Rags'], priceRange: [60, 350] },
    { name: 'Surface Preparation', items: ['Surface Cleaner', 'Degreaser', 'Rust Converter', 'Primer Sealer'], priceRange: [180, 650] }
  ]
  
  let counter = 1
  
  for (let i = 0; i < targetCount; i++) {
    const category = hardwareCategories[i % hardwareCategories.length]
    const item = category.items[Math.floor(Math.random() * category.items.length)]
    const brand = hardwareBrands[Math.floor(Math.random() * hardwareBrands.length)]
    const basePrice = Math.floor(Math.random() * (category.priceRange[1] - category.priceRange[0])) + category.priceRange[0]
    const hasDiscount = Math.random() > 0.7
    
    hardware.push({
      name: `${brand} ${item}`,
      brand: brand,
      category: category.name,
      subCategory: item,
      description: `Professional grade ${item.toLowerCase()} from ${brand}. Durable construction for long-lasting performance.`,
      price: basePrice,
      mrp: Math.floor(basePrice * 1.15),
      discountPrice: hasDiscount ? Math.floor(basePrice * 0.85) : null,
      discountPercent: hasDiscount ? 15 : 0,
      stock: Math.floor(Math.random() * 300) + 20,
      unit: ['piece', 'pack', 'set', 'roll', 'kg', 'litre'][Math.floor(Math.random() * 6)],
      specifications: {
        material: ['Steel', 'Aluminium', 'Plastic', 'Nylon', 'Rubber'][Math.floor(Math.random() * 5)],
        weight: `${(Math.random() * 2 + 0.1).toFixed(2)} kg`,
        dimensions: `${Math.floor(Math.random() * 30) + 10} x ${Math.floor(Math.random() * 20) + 5} cm`
      },
      features: ['Durable', 'Ergonomic', 'Professional Grade', 'Easy to Use', 'Long Lasting'].slice(0, Math.floor(Math.random() * 3) + 2),
      application: ['Painting', 'Surface Preparation', 'Finishing'],
      rating: (Math.random() * 1.3 + 3.6).toFixed(1),
      reviews: Math.floor(Math.random() * 400) + 12,
      imageUrl: `https://picsum.photos/seed/hw${String(counter).padStart(4, '0')}/400/400`,
      sku: `${brand.substring(0, 3).toUpperCase()}-${item.replace(/\s/g, '').substring(0, 6).toUpperCase()}-${counter}`,
      isPopular: Math.random() > 0.85,
      isBestseller: Math.random() > 0.88,
      isNewArrival: Math.random() > 0.90,
      tags: [category.name.toLowerCase(), item.toLowerCase()]
    })
    
    counter++
  }
  
  return hardware
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('  ✅ Connected to MongoDB\n')

    await Promise.all([
      User.deleteMany(),
      Paint.deleteMany(),
      Hardware.deleteMany()
    ])
    console.log('  🗑  Cleared existing data')

    // Create admin user
    const hash = await bcrypt.hash('Manas@06', 10)
    const users = await User.insertMany([
      {
        name: 'Manas Shinde',
        email: 'manashshinde@gmail.com',
        password: hash,
        phone: '+91 84465 61545',
        role: 'admin',
        emailVerified: true
      }
    ])
    console.log(`  👤 Seeded ${users.length} user(s)`)

    // Generate and insert paints
    console.log('  🎨 Generating 1000+ paints...')
    const paints = generatePaints(1000)
    await Paint.insertMany(paints)
    console.log(`  🎨 Seeded ${paints.length} paints`)

    // Generate and insert hardware
    console.log('  🔧 Generating 1000+ hardware items...')
    const hardware = generateHardware(1000)
    await Hardware.insertMany(hardware)
    console.log(`  🔧 Seeded ${hardware.length} hardware items`)

    console.log('\n  ✅ Database seeded successfully!')
    console.log(`  📊 Total Products: ${paints.length + hardware.length}`)
    console.log(`  🎨 Paints: ${paints.length}`)
    console.log(`  🔧 Hardware: ${hardware.length}`)
    console.log('\n  🔐 Admin Login:')
    console.log('  Email: manashshinde@gmail.com')
    console.log('  Password: Manas@06\n')
    
    await mongoose.disconnect()
  } catch (err) {
    console.error('  ❌ Seed error:', err.message)
    process.exit(1)
  }
}

seedDatabase()
