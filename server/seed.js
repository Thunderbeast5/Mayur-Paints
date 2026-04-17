import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User.js'
import Paint from './models/Paint.js'
import Hardware from './models/Hardware.js'
import Order from './models/Order.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mayurpaints'

// Seed data
const paintData = [
  // Interior Paints
  { name: 'Royale Luxury Emulsion', brand: 'Asian Paints', color: 'Pearl White', hexCode: '#F8F8F8', finish: 'matte', size: '4L', price: 1850, stock: 45, category: 'Interior', description: 'Premium luxury emulsion with superior coverage and washability' },
  { name: 'Apcolite Premium Emulsion', brand: 'Asian Paints', color: 'Ivory Cream', hexCode: '#FFF8DC', finish: 'satin', size: '10L', price: 3200, stock: 30, category: 'Interior', description: 'High-quality interior emulsion with excellent finish' },
  { name: 'Easy Clean Fresh', brand: 'Berger', color: 'Sky Blue', hexCode: '#87CEEB', finish: 'eggshell', size: '4L', price: 1650, stock: 50, category: 'Interior', description: 'Stain-resistant interior paint with fresh fragrance' },
  { name: 'Silk Luxury Emulsion', brand: 'Berger', color: 'Warm Beige', hexCode: '#F5F5DC', finish: 'satin', size: '10L', price: 3500, stock: 25, category: 'Interior', description: 'Silky smooth finish with superior durability' },
  { name: 'Excel Total', brand: 'Nerolac', color: 'Mint Green', hexCode: '#98FF98', finish: 'matte', size: '4L', price: 1550, stock: 60, category: 'Interior', description: 'Total protection interior emulsion' },
  
  // Exterior Paints
  { name: 'Apex Ultima', brand: 'Asian Paints', color: 'Sandstone', hexCode: '#D2B48C', finish: 'glossy', size: '20L', price: 8500, stock: 15, category: 'Exterior', description: 'Weather-proof exterior emulsion with 10-year warranty' },
  { name: 'WeatherCoat All Guard', brand: 'Berger', color: 'Terracotta', hexCode: '#E2725B', finish: 'satin', size: '20L', price: 7800, stock: 20, category: 'Exterior', description: 'All-weather protection with anti-algal properties' },
  { name: 'Suraksha Advanced', brand: 'Nerolac', color: 'Desert Sand', hexCode: '#EDC9AF', finish: 'glossy', size: '10L', price: 4200, stock: 35, category: 'Exterior', description: 'Advanced exterior protection against harsh weather' },
  { name: 'Apex Weatherproof', brand: 'Asian Paints', color: 'Stone Grey', hexCode: '#928E85', finish: 'matte', size: '20L', price: 7500, stock: 18, category: 'Exterior', description: 'Superior weatherproofing technology' },
  
  // Wood Paints
  { name: 'Wood Tech PU', brand: 'Asian Paints', color: 'Teak Brown', hexCode: '#8B4513', finish: 'glossy', size: '1L', price: 950, stock: 40, category: 'Wood', description: 'Premium polyurethane wood finish' },
  { name: 'Woodtech Melamine', brand: 'Berger', color: 'Walnut', hexCode: '#5C4033', finish: 'satin', size: '1L', price: 850, stock: 45, category: 'Wood', description: 'Durable melamine wood coating' },
  { name: 'Wood Stain', brand: 'Nerolac', color: 'Oak', hexCode: '#806517', finish: 'matte', size: '500ml', price: 450, stock: 55, category: 'Wood', description: 'Natural wood stain for beautiful grain enhancement' },
  
  // Metal Paints
  { name: 'Apcolite Enamel', brand: 'Asian Paints', color: 'Royal Blue', hexCode: '#4169E1', finish: 'glossy', size: '1L', price: 650, stock: 50, category: 'Metal', description: 'High-gloss enamel for metal surfaces' },
  { name: 'Luxol Hi-Gloss', brand: 'Berger', color: 'Fire Red', hexCode: '#DC143C', finish: 'glossy', size: '1L', price: 680, stock: 48, category: 'Metal', description: 'Premium synthetic enamel with superior shine' },
  { name: 'Enamel Paint', brand: 'Nerolac', color: 'Jet Black', hexCode: '#000000', finish: 'glossy', size: '500ml', price: 380, stock: 65, category: 'Metal', description: 'Durable enamel for metal and wood' }
]

const hardwareData = [
  // Brushes
  { name: 'Professional Paint Brush Set', brand: 'Asian Paints', category: 'Brushes', price: 450, stock: 80, description: '5-piece professional brush set for all painting needs', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
  { name: 'Flat Wall Brush 4"', brand: 'Berger', category: 'Brushes', price: 180, stock: 120, description: 'Wide flat brush for smooth wall painting', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
  
  // Rollers
  { name: 'Foam Roller Kit', brand: 'Asian Paints', category: 'Rollers', price: 320, stock: 95, description: 'Complete roller kit with tray and extension pole', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400' },
  { name: 'Texture Roller 9"', brand: 'Nerolac', category: 'Rollers', price: 280, stock: 75, description: 'Professional texture roller for decorative finishes', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400' },
  
  // Tape
  { name: 'Blue Painters Tape 2"', brand: 'Asian Paints', category: 'Tape', price: 150, stock: 200, description: 'Clean removal masking tape for sharp paint lines', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=400' },
  { name: 'Masking Tape Roll', brand: 'Berger', category: 'Tape', price: 95, stock: 180, description: 'General purpose masking tape for painting', image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=400' },
  
  // Tools
  { name: 'Putty Knife Set', brand: 'Asian Paints', category: 'Tools', price: 380, stock: 65, description: '3-piece putty knife set for wall preparation', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400' },
  { name: 'Paint Scraper', brand: 'Nerolac', category: 'Tools', price: 220, stock: 90, description: 'Heavy-duty scraper for removing old paint', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },
  { name: 'Sandpaper Assorted Pack', brand: 'Berger', category: 'Tools', price: 180, stock: 150, description: 'Assorted grit sandpaper for surface preparation', image: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400' },
  { name: 'Paint Tray with Liner', brand: 'Asian Paints', category: 'Accessories', price: 160, stock: 110, description: 'Durable paint tray with disposable liner', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400' }
]

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI)
    console.log('\n✅ Connected to MongoDB\n')

    // Drop existing collections
    await User.deleteMany({})
    await Paint.deleteMany({})
    await Hardware.deleteMany({})
    await Order.deleteMany({})
    console.log('🗑️  Cleared existing data\n')

    // Create users
    const hashedPassword = await bcrypt.hash('admin123', 12)
    const hashedUserPassword = await bcrypt.hash('user123', 12)

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@mayurpaints.com',
        password: hashedPassword,
        phone: '+91 98765 43210',
        role: 'admin'
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: hashedUserPassword,
        phone: '+91 98765 11111',
        role: 'user'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: hashedUserPassword,
        phone: '+91 98765 22222',
        role: 'user'
      }
    ])
    console.log(`👤 Created ${users.length} users`)

    // Create paints
    const paints = await Paint.insertMany(paintData)
    console.log(`🎨 Created ${paints.length} paint products`)

    // Create hardware
    const hardware = await Hardware.insertMany(hardwareData)
    console.log(`🔧 Created ${hardware.length} hardware products`)

    // Create sample orders
    const sampleOrders = [
      {
        orderId: 'ORD-2024-001',
        user: users[1]._id,
        items: [
          { product: paints[0]._id, productType: 'Paint', name: paints[0].name, price: paints[0].price, quantity: 2 },
          { product: hardware[0]._id, productType: 'Hardware', name: hardware[0].name, price: hardware[0].price, quantity: 1 }
        ],
        totalAmount: paints[0].price * 2 + hardware[0].price,
        shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 11111' },
        paymentMethod: 'online',
        status: 'delivered'
      },
      {
        orderId: 'ORD-2024-002',
        user: users[2]._id,
        items: [
          { product: paints[5]._id, productType: 'Paint', name: paints[5].name, price: paints[5].price, quantity: 1 },
          { product: hardware[2]._id, productType: 'Hardware', name: hardware[2].name, price: hardware[2].price, quantity: 2 }
        ],
        totalAmount: paints[5].price + hardware[2].price * 2,
        shippingAddress: { street: '456 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 22222' },
        paymentMethod: 'cod',
        status: 'shipped'
      },
      {
        orderId: 'ORD-2024-003',
        user: users[1]._id,
        items: [
          { product: paints[2]._id, productType: 'Paint', name: paints[2].name, price: paints[2].price, quantity: 3 }
        ],
        totalAmount: paints[2].price * 3,
        shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 11111' },
        paymentMethod: 'online',
        status: 'confirmed'
      },
      {
        orderId: 'ORD-2024-004',
        user: users[2]._id,
        items: [
          { product: hardware[4]._id, productType: 'Hardware', name: hardware[4].name, price: hardware[4].price, quantity: 5 },
          { product: hardware[5]._id, productType: 'Hardware', name: hardware[5].name, price: hardware[5].price, quantity: 3 }
        ],
        totalAmount: hardware[4].price * 5 + hardware[5].price * 3,
        shippingAddress: { street: '456 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 22222' },
        paymentMethod: 'cod',
        status: 'pending'
      },
      {
        orderId: 'ORD-2024-005',
        user: users[1]._id,
        items: [
          { product: paints[9]._id, productType: 'Paint', name: paints[9].name, price: paints[9].price, quantity: 2 },
          { product: paints[10]._id, productType: 'Paint', name: paints[10].name, price: paints[10].price, quantity: 1 }
        ],
        totalAmount: paints[9].price * 2 + paints[10].price,
        shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 11111' },
        paymentMethod: 'online',
        status: 'delivered'
      },
      {
        orderId: 'ORD-2024-006',
        user: users[2]._id,
        items: [
          { product: paints[1]._id, productType: 'Paint', name: paints[1].name, price: paints[1].price, quantity: 1 }
        ],
        totalAmount: paints[1].price,
        shippingAddress: { street: '456 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 22222' },
        paymentMethod: 'cod',
        status: 'cancelled'
      },
      {
        orderId: 'ORD-2024-007',
        user: users[1]._id,
        items: [
          { product: hardware[6]._id, productType: 'Hardware', name: hardware[6].name, price: hardware[6].price, quantity: 1 },
          { product: hardware[7]._id, productType: 'Hardware', name: hardware[7].name, price: hardware[7].price, quantity: 2 }
        ],
        totalAmount: hardware[6].price + hardware[7].price * 2,
        shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 11111' },
        paymentMethod: 'online',
        status: 'delivered'
      },
      {
        orderId: 'ORD-2024-008',
        user: users[2]._id,
        items: [
          { product: paints[12]._id, productType: 'Paint', name: paints[12].name, price: paints[12].price, quantity: 4 }
        ],
        totalAmount: paints[12].price * 4,
        shippingAddress: { street: '456 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 22222' },
        paymentMethod: 'cod',
        status: 'shipped'
      },
      {
        orderId: 'ORD-2024-009',
        user: users[1]._id,
        items: [
          { product: paints[7]._id, productType: 'Paint', name: paints[7].name, price: paints[7].price, quantity: 1 },
          { product: hardware[1]._id, productType: 'Hardware', name: hardware[1].name, price: hardware[1].price, quantity: 3 }
        ],
        totalAmount: paints[7].price + hardware[1].price * 3,
        shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 11111' },
        paymentMethod: 'online',
        status: 'confirmed'
      },
      {
        orderId: 'ORD-2024-010',
        user: users[2]._id,
        items: [
          { product: paints[3]._id, productType: 'Paint', name: paints[3].name, price: paints[3].price, quantity: 2 },
          { product: hardware[8]._id, productType: 'Hardware', name: hardware[8].name, price: hardware[8].price, quantity: 1 }
        ],
        totalAmount: paints[3].price * 2 + hardware[8].price,
        shippingAddress: { street: '456 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 22222' },
        paymentMethod: 'cod',
        status: 'pending'
      }
    ]

    await Order.insertMany(sampleOrders)
    console.log(`📦 Created ${sampleOrders.length} sample orders\n`)

    console.log('✅ Database seeded successfully!\n')
    console.log('═══════════════════════════════════════')
    console.log('📊 SEED SUMMARY')
    console.log('═══════════════════════════════════════')
    console.log(`Total Users: ${users.length}`)
    console.log(`Total Paints: ${paints.length}`)
    console.log(`Total Hardware: ${hardware.length}`)
    console.log(`Total Orders: ${sampleOrders.length}`)
    console.log('═══════════════════════════════════════\n')
    console.log('🔐 LOGIN CREDENTIALS')
    console.log('═══════════════════════════════════════')
    console.log('Admin Account:')
    console.log('  Email: admin@mayurpaints.com')
    console.log('  Password: admin123')
    console.log('\nCustomer Accounts:')
    console.log('  Email: rajesh@example.com')
    console.log('  Password: user123')
    console.log('\n  Email: priya@example.com')
    console.log('  Password: user123')
    console.log('═══════════════════════════════════════\n')

    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB\n')
  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  }
}

seed()
