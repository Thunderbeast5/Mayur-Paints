# 🚀 Mayur Paints - Quick Start Guide

Get your production-grade e-commerce platform running in 5 minutes!

---

## ⚡ Prerequisites

- Node.js 18+ installed
- MongoDB running on localhost:27017
- Gmail account for OTP emails (optional)
- Razorpay account for payments (optional)

---

## 📦 Step 1: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ..
npm install
```

---

## 🔧 Step 2: Configure Environment

### Server Configuration (`server/.env`)

```env
MONGO_URI=mongodb://127.0.0.1:27017/mayurpaints
JWT_SECRET=mayurpaints_jwt_secret_key_2026
PORT=3001

# Optional: For OTP emails
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password

# Optional: For payments
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
```

### Client Configuration (`.env`)

```env
VITE_API_URL=http://localhost:3001
VITE_RAZORPAY_KEY_ID=rzp_test_xxxx
```

---

## 🌱 Step 3: Seed the Database

```bash
npm run seed
```

This creates:
- ✅ 220 paint products
- ✅ 210 hardware products
- ✅ 1 admin user
- ✅ Sample orders

---

## 🎯 Step 4: Start the Application

### Option A: Start Both Servers

```bash
npm start
```

This runs both backend and frontend concurrently.

### Option B: Start Separately

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend (in new terminal)
npm run dev
```

---

## 🌐 Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

---

## 🔐 Login Credentials

### Admin Account
```
Email: manashshinde@gmail.com
Password: Manas@06
```

### Test User
Create a new account through the signup page!

---

## ✨ What You Can Do Now

### 1. Browse Products
- 220 paints across 10 categories
- 210 hardware items across 13 categories
- Search, filter, and sort

### 2. Shopping Experience
- Add items to cart
- Apply coupon codes
- Multi-step checkout
- Multiple payment options

### 3. Authentication
- Register with OTP verification
- Login with 2FA
- Secure JWT tokens

### 4. Admin Features
- Manage products
- View orders
- Track inventory
- Analytics dashboard

---

## 🎨 Key Features to Test

### OTP Authentication
1. Go to signup page
2. Fill in details
3. Check email for OTP
4. Enter OTP to complete registration

### Shopping Cart
1. Browse paints or hardware
2. Add items to cart
3. Proceed to checkout
4. Enter delivery address
5. Choose payment method
6. Complete order

### Coupon System
1. Add items to cart
2. Enter coupon code (create one in admin)
3. See discount applied
4. Complete checkout

### Payment Gateway
1. Add items to cart
2. Proceed to checkout
3. Select "Online Payment"
4. Razorpay modal opens
5. Complete test payment

---

## 🛠️ Optional: Enable Email & Payments

### Enable OTP Emails

1. Go to https://myaccount.google.com/apppasswords
2. Generate an app password
3. Update `EMAIL_USER` and `EMAIL_PASS` in `server/.env`
4. Restart server

### Enable Razorpay Payments

1. Sign up at https://dashboard.razorpay.com
2. Get test keys from https://dashboard.razorpay.com/app/keys
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in both `.env` files
4. Restart servers

---

## 📊 Database Overview

After seeding, your MongoDB will have:

```
Collections:
- users (1 admin)
- paints (220 products)
- hardwares (210 products)
- orders (1 sample)
- otps (empty, auto-populated on auth)
- reviews (empty, ready for use)
- wishlists (empty, ready for use)
- coupons (empty, create via admin)
```

---

## 🔍 Troubleshooting

### Server won't start?
```bash
# Check if MongoDB is running
mongosh

# Check if port 3001 is available
netstat -ano | findstr :3001
```

### Frontend won't start?
```bash
# Check if port 5173 is available
netstat -ano | findstr :5173

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection failed?
```bash
# Verify MongoDB is running
mongosh

# Check MONGO_URI in server/.env
# Default: mongodb://127.0.0.1:27017/mayurpaints
```

### OTP emails not sending?
- Verify EMAIL_USER and EMAIL_PASS in server/.env
- Use Gmail app password, not regular password
- Check server logs for detailed error messages
- OTP will still work without email (check server console)

### Payment not working?
- Verify Razorpay keys are correct
- Check browser console for errors
- Ensure Razorpay script is loaded in index.html
- Use test mode keys for development

---

## 📱 Test Accounts

### Create Test Users
1. Go to http://localhost:5173/signup
2. Fill in details
3. Use any email (OTP will be logged in server console if email not configured)
4. Complete registration

### Test Coupon Codes
Create coupons via admin dashboard:
- Code: WELCOME10
- Type: Percent
- Value: 10
- Min Order: 500

---

## 🎯 Next Steps

1. **Explore the Admin Dashboard**
   - Login as admin
   - View analytics
   - Manage products
   - Track orders

2. **Test the Shopping Flow**
   - Browse products
   - Add to cart
   - Apply coupons
   - Complete checkout

3. **Customize the Platform**
   - Update brand colors in tailwind.config.js
   - Add your logo
   - Modify email templates
   - Add more products

4. **Deploy to Production**
   - Set up production MongoDB
   - Configure production email
   - Set up Razorpay production keys
   - Deploy to Vercel/Netlify (frontend) and Heroku/Railway (backend)

---

## 📚 Documentation

- **ENHANCEMENTS.md** - Detailed feature documentation
- **IMPLEMENTATION_SUMMARY.md** - Complete implementation details
- **README.md** - Project overview

---

## 🎉 You're All Set!

Your Mayur Paints e-commerce platform is now running with:

✅ 430+ products
✅ OTP authentication
✅ Payment gateway
✅ Multi-step checkout
✅ Coupon system
✅ Admin dashboard
✅ Email notifications
✅ Professional UI/UX

Happy coding! 🚀

---

## 💡 Pro Tips

1. **Use the admin account** to explore all features
2. **Check server console** for OTP codes if email not configured
3. **Use browser DevTools** to inspect API calls
4. **Test on mobile** - the UI is fully responsive
5. **Create test orders** to see the full flow

---

## 📞 Need Help?

- Check the troubleshooting section above
- Review server logs for backend errors
- Check browser console for frontend errors
- Verify all environment variables are set

---

© 2026 Mayur Paints Limited. All rights reserved.
