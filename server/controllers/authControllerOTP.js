import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { createOTP, verifyOTP as verifyOTPService, checkOTPRateLimit } from '../services/otpService.js'

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'mayurpaints_jwt_secret_key_2026',
    { expiresIn: '7d' }
  )

// @desc    Register user - Step 1: Send OTP
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' })
    }

    // Check rate limit
    const canSendOTP = await checkOTPRateLimit(email.toLowerCase().trim())
    if (!canSendOTP) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 5 minutes.'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Send OTP
    await createOTP(email.toLowerCase().trim(), 'register')

    // Return temp user data (don't create user yet)
    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      data: {
        email: email.toLowerCase().trim(),
        tempUser: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          phone: phone.trim(),
          role: 'user'
        }
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ success: false, message: 'Server error during registration' })
  }
}

// @desc    Login user - Step 1: Verify password and send OTP
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

    // Check rate limit
    const canSendOTP = await checkOTPRateLimit(email.toLowerCase().trim())
    if (!canSendOTP) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 5 minutes.'
      })
    }

    // Send OTP for 2FA
    await createOTP(email.toLowerCase().trim(), 'login')

    res.json({
      success: true,
      message: 'Password verified. OTP sent to your email.',
      data: {
        email: user.email,
        requiresOTP: true
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error during login' })
  }
}

// @desc    Verify OTP - Step 2: Complete registration or login
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, tempUser, type = 'login' } = req.body

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' })
    }

    // Verify OTP
    const verification = await verifyOTPService(email.toLowerCase().trim(), otp, type)

    if (!verification.success) {
      return res.status(400).json({
        success: false,
        message: verification.message
      })
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() })

    // If registering, create the user now
    if (type === 'register' && !user && tempUser) {
      user = await User.create({
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password, // Already hashed
        phone: tempUser.phone || '',
        role: 'user',
        emailVerified: true
      })
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Generate JWT token
    const token = generateToken(user)

    res.json({
      success: true,
      message: type === 'register' ? 'Registration successful' : 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        role: user.role
      }
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
  try {
    const { email, type = 'login' } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    // Check rate limit
    const canSendOTP = await checkOTPRateLimit(email.toLowerCase().trim())
    if (!canSendOTP) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 5 minutes.'
      })
    }

    // Send new OTP
    await createOTP(email.toLowerCase().trim(), type)

    res.json({
      success: true,
      message: 'New OTP sent to your email'
    })
  } catch (error) {
    console.error('Resend OTP error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
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
