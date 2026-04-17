import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'mayurpaints_jwt_secret_key_2026',
    { expiresIn: '7d' }
  )

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Optional role check - only warn, don't block
    if (role && user.role !== role) {
      console.log(`User ${email} tried to login as ${role} but is ${user.role}`)
      // Allow login but return actual role
    }

    const token = generateToken(user)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        role: user.role,
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error during login' })
  }
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'user' } = req.body

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      role: role === 'admin' ? 'user' : role, // prevent self-promotion to admin
      emailVerified: true,
    })

    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        role: user.role,
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered' })
    }
    res.status(500).json({ success: false, message: 'Server error during registration' })
  }
}

// @desc    Verify OTP (simplified — always succeeds in dev)
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, tempUser } = req.body
    // In production, validate against stored OTP
    // For now, accept any 6-digit OTP
    if (!otp || otp.toString().length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }

    let user = await User.findOne({ email })
    if (!user && tempUser) {
      // Create user from tempUser data
      const hashedPassword = await bcrypt.hash(tempUser.password || 'changeme', 12)
      user = await User.create({
        name: tempUser.name,
        email: tempUser.email,
        password: hashedPassword,
        phone: tempUser.phone || '',
        role: 'user',
        emailVerified: true,
      })
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const token = generateToken(user)
    res.json({
      success: true,
      message: 'OTP verified',
      data: { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role }, role: user.role }
    })
  } catch (error) {
    console.error('OTP verify error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
  res.json({ success: true, message: 'OTP sent (development mode: use any 6-digit code)' })
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
