import express from 'express'
import { login, register, verifyOTP, resendOTP, getMe } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/verify-otp', verifyOTP)
router.post('/resend-otp', resendOTP)
router.get('/me', authenticate, getMe)

export default router
