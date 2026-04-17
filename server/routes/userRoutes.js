import express from 'express'
import User from '../models/User.js'
import { authenticate, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// GET /api/users — admin only
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' })
  }
})

// GET /api/users/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean()
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile' })
  }
})

// PUT /api/users/me — update profile
router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body
    const updates = {}
    if (name) updates.name = name
    if (phone) updates.phone = phone
    if (avatar) updates.avatar = avatar

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password')
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile' })
  }
})

// POST /api/users/me/address — add address
router.post('/me/address', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.addresses.push(req.body)
    await user.save()
    res.json({ success: true, data: user.addresses })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding address' })
  }
})

// GET /api/users/me/addresses
router.get('/me/addresses', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses')
    res.json({ success: true, data: user.addresses })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching addresses' })
  }
})

// DELETE /api/users/me/address/:id
router.delete('/me/address/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id)
    await user.save()
    res.json({ success: true, data: user.addresses })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting address' })
  }
})

export default router
