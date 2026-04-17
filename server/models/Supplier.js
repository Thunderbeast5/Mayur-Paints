import mongoose from 'mongoose'

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  products: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

export default mongoose.model('Supplier', supplierSchema)
