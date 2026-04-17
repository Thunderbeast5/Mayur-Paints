import express from 'express'
import User from '../models/User.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// GET /api/users/me/addresses - Get all addresses for current user
router.get('/me/addresses', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: user.addresses || []
    })
  } catch (error) {
    console.error('Get addresses error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message
    })
  }
})

// POST /api/users/me/address - Add new address
router.post('/me/address', authenticateToken, async (req, res) => {
  try {
    const { label, name, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body

    // Validation
    if (!label || !name || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      })
    }

    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // If this is set as default, unset all other defaults
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false
      })
    }

    // If this is the first address, make it default
    const makeDefault = isDefault || user.addresses.length === 0

    // Add new address
    user.addresses.push({
      label,
      name,
      phone,
      addressLine1,
      addressLine2: addressLine2 || '',
      city,
      state,
      pincode,
      isDefault: makeDefault
    })

    await user.save()

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses
    })
  } catch (error) {
    console.error('Add address error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: error.message
    })
  }
})

// PUT /api/users/me/address/:id - Update address
router.put('/me/address/:id', authenticateToken, async (req, res) => {
  try {
    const { label, name, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body

    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const address = user.addresses.id(req.params.id)
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      })
    }

    // If setting as default, unset all other defaults
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false
      })
    }

    // Update address fields
    if (label) address.label = label
    if (name) address.name = name
    if (phone) address.phone = phone
    if (addressLine1) address.addressLine1 = addressLine1
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2
    if (city) address.city = city
    if (state) address.state = state
    if (pincode) address.pincode = pincode
    if (isDefault !== undefined) address.isDefault = isDefault

    await user.save()

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses
    })
  } catch (error) {
    console.error('Update address error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    })
  }
})

// DELETE /api/users/me/address/:id - Delete address
router.delete('/me/address/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const address = user.addresses.id(req.params.id)
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      })
    }

    const wasDefault = address.isDefault

    // Remove address
    address.deleteOne()

    // If deleted address was default, set first remaining as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true
    }

    await user.save()

    res.json({
      success: true,
      message: 'Address deleted successfully',
      data: user.addresses
    })
  } catch (error) {
    console.error('Delete address error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message
    })
  }
})

// PUT /api/users/me/address/:id/default - Set address as default
router.put('/me/address/:id/default', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const address = user.addresses.id(req.params.id)
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      })
    }

    // Unset all defaults
    user.addresses.forEach(addr => {
      addr.isDefault = false
    })

    // Set this as default
    address.isDefault = true

    await user.save()

    res.json({
      success: true,
      message: 'Default address updated',
      data: user.addresses
    })
  } catch (error) {
    console.error('Set default address error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: error.message
    })
  }
})

export default router
