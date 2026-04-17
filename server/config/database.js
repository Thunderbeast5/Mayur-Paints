import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mayurpaints')

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    
    // Create indexes for better performance
    await createIndexes()
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}

const createIndexes = async () => {
  try {
    // Product indexes
    await mongoose.connection.db.collection('products').createIndex({ 
      name: 'text', 
      category: 1, 
      price: 1 
    })
    await mongoose.connection.db.collection('products').createIndex({ code: 1 }, { unique: true })

    // Order indexes
    await mongoose.connection.db.collection('orders').createIndex({ userId: 1, createdAt: -1 })
    await mongoose.connection.db.collection('orders').createIndex({ orderId: 1 }, { unique: true })
    await mongoose.connection.db.collection('orders').createIndex({ status: 1 })

    // User indexes
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true })
    await mongoose.connection.db.collection('users').createIndex({ role: 1 })

    console.log('✅ Database indexes created successfully')
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message)
  }
}

export default connectDB
