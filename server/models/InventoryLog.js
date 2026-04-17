import mongoose from 'mongoose'

const inventoryLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productName: { type: String, required: true },
  productType: { type: String, enum: ['paint', 'hardware'], required: true },
  changeType: { type: String, enum: ['restock', 'sale', 'adjustment', 'return'], required: true },
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  reason: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('InventoryLog', inventoryLogSchema)
