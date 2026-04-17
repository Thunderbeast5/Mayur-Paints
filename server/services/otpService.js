import nodemailer from 'nodemailer'
import Otp from '../models/Otp.js'

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP email with beautiful template
export async function sendOTPEmail(email, otp, type = 'login') {
  const subject = type === 'register' ? 'Verify Your Email - Mayur Paints' : 'Your Login OTP - Mayur Paints'
  const title = type === 'register' ? 'Welcome to Mayur Paints!' : 'Login Verification'
  const message = type === 'register' 
    ? 'Thank you for registering with Mayur Paints. Please verify your email address to complete your registration.'
    : 'You are attempting to log in to your Mayur Paints account. Please use the OTP below to complete your login.'
  
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #E85D26 0%, #F5A623 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #ffffff;
          margin: 0;
        }
        .content {
          padding: 40px 30px;
        }
        .title {
          font-size: 24px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0 0 16px 0;
          text-align: center;
        }
        .message {
          font-size: 16px;
          color: #6B7280;
          line-height: 1.6;
          margin: 0 0 32px 0;
          text-align: center;
        }
        .otp-container {
          background: linear-gradient(135deg, #FFF4E6 0%, #FFE5CC 100%);
          border: 2px dashed #E85D26;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          margin: 0 0 32px 0;
        }
        .otp-label {
          font-size: 14px;
          color: #6B7280;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .otp-code {
          font-size: 48px;
          font-weight: bold;
          color: #E85D26;
          letter-spacing: 8px;
          margin: 0;
          font-family: 'Courier New', monospace;
        }
        .expiry {
          font-size: 14px;
          color: #DC2626;
          margin: 16px 0 0 0;
          font-weight: 500;
        }
        .warning {
          background-color: #FEF2F2;
          border-left: 4px solid #DC2626;
          padding: 16px;
          margin: 0 0 32px 0;
          border-radius: 4px;
        }
        .warning-text {
          font-size: 14px;
          color: #991B1B;
          margin: 0;
          line-height: 1.5;
        }
        .footer {
          background-color: #F9FAFB;
          padding: 24px 30px;
          text-align: center;
          border-top: 1px solid #E5E7EB;
        }
        .footer-text {
          font-size: 14px;
          color: #6B7280;
          margin: 0 0 8px 0;
        }
        .footer-link {
          color: #E85D26;
          text-decoration: none;
          font-weight: 500;
        }
        .social-links {
          margin: 16px 0 0 0;
        }
        .social-link {
          display: inline-block;
          margin: 0 8px;
          color: #6B7280;
          text-decoration: none;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">🎨 Mayur Paints</h1>
        </div>
        
        <div class="content">
          <h2 class="title">${title}</h2>
          <p class="message">${message}</p>
          
          <div class="otp-container">
            <p class="otp-label">Your OTP Code</p>
            <p class="otp-code">${otp}</p>
            <p class="expiry">⏰ Valid for 5 minutes only</p>
          </div>
          
          <div class="warning">
            <p class="warning-text">
              <strong>🔒 Security Notice:</strong><br>
              Never share this OTP with anyone. Mayur Paints will never ask for your OTP via phone or email.
              If you didn't request this OTP, please ignore this email and secure your account.
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-text">
            Need help? Contact us at <a href="mailto:support@mayurpaints.com" class="footer-link">support@mayurpaints.com</a>
          </p>
          <p class="footer-text">
            Or call us at <strong>+91 1800-123-4567</strong>
          </p>
          <div class="social-links">
            <a href="#" class="social-link">Facebook</a> •
            <a href="#" class="social-link">Instagram</a> •
            <a href="#" class="social-link">Twitter</a>
          </div>
          <p class="footer-text" style="margin-top: 16px; font-size: 12px;">
            © ${new Date().getFullYear()} Mayur Paints. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const mailOptions = {
    from: `"Mayur Paints" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: htmlTemplate
  }
  
  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    throw new Error('Failed to send OTP email')
  }
}

// Create and store OTP
export async function createOTP(email, type = 'login') {
  // Delete any existing OTPs for this email and type
  await Otp.deleteMany({ email, type })
  
  // Generate new OTP
  const otp = generateOTP()
  
  // Store in database
  await Otp.create({
    email,
    otp,
    type
  })
  
  // Send email
  await sendOTPEmail(email, otp, type)
  
  return otp
}

// Verify OTP
export async function verifyOTP(email, otp, type = 'login') {
  const otpRecord = await Otp.findOne({ email, type }).sort({ createdAt: -1 })
  
  if (!otpRecord) {
    return { success: false, message: 'OTP not found or expired' }
  }
  
  // Increment attempts
  otpRecord.attempts += 1
  await otpRecord.save()
  
  // Check max attempts
  if (otpRecord.attempts > 3) {
    await Otp.deleteMany({ email, type })
    return { success: false, message: 'Too many failed attempts. Please request a new OTP.' }
  }
  
  // Verify OTP
  if (otpRecord.otp !== otp) {
    return { success: false, message: 'Invalid OTP' }
  }
  
  // OTP is valid - delete it
  await Otp.deleteMany({ email, type })
  
  return { success: true, message: 'OTP verified successfully' }
}

// Check rate limit for OTP requests
export async function checkOTPRateLimit(email) {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  const recentOTPs = await Otp.countDocuments({
    email,
    createdAt: { $gte: fiveMinutesAgo }
  })
  
  return recentOTPs < 3 // Max 3 OTPs per 5 minutes
}
