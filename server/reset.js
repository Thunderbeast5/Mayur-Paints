import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mayurpaints'

async function reset() {
  try {
    // Connect to MongoDB
    console.log('\n🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB:', mongoose.connection.host)

    // Drop all collections
    console.log('\n🗑️  Dropping all collections...')
    const collections = await mongoose.connection.db.collections()
    
    for (const collection of collections) {
      await collection.drop()
      console.log(`   ✓ Dropped: ${collection.collectionName}`)
    }
    console.log('✅ All collections dropped')

    // Create admin user
    console.log('\n👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@mayurpaints.com',
      password: hashedPassword,
      phone: '+91 00000 00000',
      role: 'admin'
    })
    
    console.log('✅ Admin user created')
    console.log(`   Email: ${admin.email}`)
    console.log('   Password: admin123')

    // Success message
    console.log('\n🎉 Database reset complete!')
    console.log('═══════════════════════════════════════')
    console.log('📊 DATABASE STATUS')
    console.log('═══════════════════════════════════════')
    console.log('Users: 1 (admin only)')
    console.log('Paints: 0 (empty)')
    console.log('Hardware: 0 (empty)')
    console.log('Orders: 0 (empty)')
    console.log('═══════════════════════════════════════')
    console.log('\n🔐 ADMIN LOGIN')
    console.log('═══════════════════════════════════════')
    console.log('Email: admin@mayurpaints.com')
    console.log('Password: admin123')
    console.log('═══════════════════════════════════════')
    console.log('\n✨ Ready for fresh data!\n')

    // Disconnect
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB\n')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Reset error:', error.message)
    console.error(error)
    process.exit(1)
  }
}

reset()
