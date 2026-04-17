import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalCount: 0,
  },
  reducers: {
    addItem(state, action) {
      const product = action.payload
      // Normalize MongoDB _id to id for consistent lookups
      const normalizedId = product._id || product.id
      const existing = state.items.find(i => i.id === normalizedId && i.type === product.type)
      if (existing) {
        existing.qty += 1
      } else {
        const { _id, ...rest } = product
        state.items.push({ ...rest, id: normalizedId, qty: 1 })
      }
      state.totalCount = state.items.reduce((sum, i) => sum + i.qty, 0)
    },
    removeItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload)
      state.totalCount = state.items.reduce((sum, i) => sum + i.qty, 0)
    },
    updateQuantity(state, action) {
      const { id, qty } = action.payload
      const item = state.items.find(i => i.id === id)
      if (item) item.qty = qty
      state.totalCount = state.items.reduce((sum, i) => sum + i.qty, 0)
    },
    clearCart(state) {
      state.items = []
      state.totalCount = 0
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
