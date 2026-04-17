import { createTransport } from 'nodemailer'

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendOTPEmail(email, otp, name = 'User') {
  const mailOptions = {
    from: `"Mayur Paints" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Mayur Paints Verification',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #E85D26 0%, #F5A623 100%); padding: 40px 20px; text-align: center; }
          .logo { font-size: 32px; font-weight: bold; color: white; margin: 0; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 20px; color: #333; margin-bottom: 20px; }
          .message { font-size: 16px; color: #666; line-height: 1.6; margin-bottom: 30px; }
          .otp-box { background: #f8f9fa; border: 2px dashed #E85D26; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0; }
          .otp-label { font-size: 14px; color: #666; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
          .otp-code { font-size: 42px; font-weight: bold; color: #E85D26; letter-spacing: 8px; font-family: 'Courier New', monospace; }
          .expiry { font-size: 14px; color: #999; margin-top: 15px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .warning-text { font-size: 14px; color: #856404; margin: 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999; }
          .footer a { color: #E85D26; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🎨 Mayur Paints</h1>
          </div>
          <div class="content">
            <div class="greeting">Hello ${name},</div>
            <div class="message">
              Thank you for choosing Mayur Paints! To complete your verification, please use the One-Time Password (OTP) below:
            </div>
            <div class="otp-box">
              <div class="otp-label">Your OTP Code</div>
              <div class="otp-code">${otp}</div>
              <div class="expiry">⏱ Valid for 5 minutes</div>
            </div>
            <div class="warning">
              <p class="warning-text">
                <strong>⚠️ Security Notice:</strong> Do not share this OTP with anyone. Mayur Paints will never ask for your OTP via phone or email.
              </p>
            </div>
            <div class="message">
              If you didn't request this OTP, please ignore this email or contact our support team immediately.
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Mayur Paints. All rights reserved.</p>
            <p>Need help? <a href="mailto:support@mayurpaints.com">Contact Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

export async function sendOrderConfirmationEmail(email, orderDetails) {
  const mailOptions = {
    from: `"Mayur Paints" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmation - ${orderDetails.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #E85D26; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-id { font-size: 24px; font-weight: bold; color: #E85D26; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎨 Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Thank you for your order!</p>
            <p class="order-id">Order ID: ${orderDetails.orderId}</p>
            <p>Total Amount: ₹${orderDetails.total}</p>
            <p>We'll send you another email when your order ships.</p>
          </div>
          <div class="footer">
            <p>© 2026 Mayur Paints. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}
