# 🚀 Complete Deployment Guide - Mayur Paints

## Step 1: Setup MongoDB Atlas (Free Cloud Database)

### 1.1 Create MongoDB Atlas Account
```
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email
3. Choose FREE tier (M0 Sandbox)
4. Select Provider: AWS
5. Region: Mumbai (ap-south-1) - Closest to India
6. Cluster Name: mayur-paints
7. Click "Create Cluster" (takes 3-5 minutes)
```

### 1.2 Create Database User
```
1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Authentication Method: Password
4. Username: mayurpaints
5. Password: Generate secure password (SAVE THIS!)
   Example: MayurPaints2026@Secure
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"
```

### 1.3 Whitelist IP Addresses
```
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   (Required for Render to connect)
4. Click "Confirm"
```

### 1.4 Get Connection String
```
1. Click "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js
5. Version: 5.5 or later
6. Copy the connection string:
   
   mongodb+srv://mayurpaints:<password>@mayur-paints.xxxxx.mongodb.net/?retryWrites=true&w=majority

7. Replace <password> with your actual password
8. Add database name before the "?":
   
   mongodb+srv://mayurpaints:MayurPaints2026@Secure@mayur-paints.xxxxx.mongodb.net/mayurpaints?retryWrites=true&w=majority
```

---

## Step 2: Prepare Backend for Deployment

### 2.1 Update server/.env for Production
```env
# Production MongoDB Atlas
MONGODB_URI=mongodb+srv://mayurpaints:YOUR_PASSWORD@mayur-paints.xxxxx.mongodb.net/mayurpaints?retryWrites=true&w=majority

# JWT Secret (generate a strong one)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2026

# Server Config
PORT=3001
NODE_ENV=production

# UPI Payment
UPI_ID=mayurpaints@upi

# Admin Credentials
ADMIN_EMAIL=admin@mayurpaints.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin
ADMIN_PHONE=+91 9876543210
```

### 2.2 Create render.yaml (Optional but Recommended)
```yaml
services:
  - type: web
    name: mayur-paints-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: UPI_ID
        value: mayurpaints@upi
```

### 2.3 Update package.json (if needed)
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Render Account
```
1. Go to: https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories
```

### 3.2 Create New Web Service
```
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: manasshinde369/Mayur-Paints
3. Configure:
   - Name: mayur-paints-backend
   - Region: Singapore (closest to India)
   - Branch: main
   - Root Directory: server
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
   - Instance Type: Free
```

### 3.3 Add Environment Variables
```
Click "Advanced" → "Add Environment Variable"

Add these variables:

1. MONGODB_URI
   Value: mongodb+srv://mayurpaints:YOUR_PASSWORD@mayur-paints.xxxxx.mongodb.net/mayurpaints?retryWrites=true&w=majority

2. JWT_SECRET
   Value: your_super_secret_jwt_key_change_this_in_production_2026

3. NODE_ENV
   Value: production

4. PORT
   Value: 3001

5. UPI_ID
   Value: mayurpaints@upi

6. ADMIN_EMAIL
   Value: admin@mayurpaints.com

7. ADMIN_PASSWORD
   Value: admin123

8. ADMIN_NAME
   Value: Admin

9. ADMIN_PHONE
   Value: +91 9876543210
```

### 3.4 Deploy
```
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Check logs for any errors
4. Once deployed, you'll get a URL like:
   https://mayur-paints-backend.onrender.com
```

---

## Step 4: Seed Database (One-time)

### 4.1 Create Seed Script for Production
Create `server/seed-production.js`:
```javascript
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// Your existing seed script content
// ... (copy from seed-professional.js)

// Run seed
seedDatabase()
```

### 4.2 Run Seed via Render Shell
```
1. Go to your Render service
2. Click "Shell" tab
3. Run: node seed-production.js
4. Wait for completion
5. Verify in MongoDB Atlas:
   - Go to "Browse Collections"
   - Check data is there
```

---

## Step 5: Deploy Frontend to Vercel/Netlify

### Option A: Vercel (Recommended)

#### 5.1 Install Vercel CLI
```powershell
npm install -g vercel
```

#### 5.2 Update Frontend API URL
Update `src/api.js`:
```javascript
const API_BASE = (import.meta.env.VITE_API_URL || 'https://mayur-paints-backend.onrender.com') + '/api'
```

#### 5.3 Create .env.production
```env
VITE_API_URL=https://mayur-paints-backend.onrender.com
```

#### 5.4 Deploy
```powershell
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts:
# - Setup and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? mayur-paints
# - Directory? ./
# - Override settings? No
```

### Option B: Netlify

#### 5.1 Create netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://mayur-paints-backend.onrender.com"
```

#### 5.2 Deploy
```
1. Go to: https://app.netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub → Select repository
5. Configure:
   - Branch: main
   - Build command: npm run build
   - Publish directory: dist
6. Add environment variable:
   - VITE_API_URL: https://mayur-paints-backend.onrender.com
7. Click "Deploy site"
```

---

## Step 6: Update CORS in Backend

Update `server/index.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://mayur-paints.vercel.app', // Your Vercel URL
    'https://your-netlify-site.netlify.app' // Your Netlify URL
  ],
  credentials: true
}))
```

Redeploy backend after this change.

---

## Step 7: Test Production Deployment

### 7.1 Test Backend
```
1. Go to: https://mayur-paints-backend.onrender.com/api/health
2. Should return: {"status":"ok","db":"connected","timestamp":"..."}
```

### 7.2 Test Frontend
```
1. Go to your Vercel/Netlify URL
2. Try to login
3. Add products to cart
4. Test payment flow
5. Test admin dashboard
```

---

## 🔧 Troubleshooting

### Backend Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Check MONGODB_URI in Render environment variables
2. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
3. Check database user password is correct
4. Ensure connection string has database name
```

#### Port Issues
```
Error: Port 3001 already in use

Solution:
Update server/index.js:
const PORT = process.env.PORT || 3001
```

#### Environment Variables Not Loading
```
Solution:
1. Check all variables are set in Render dashboard
2. Redeploy after adding variables
3. Check logs for "injected env" message
```

### Frontend Issues

#### API Connection Failed
```
Error: Failed to fetch

Solution:
1. Check VITE_API_URL is correct
2. Verify CORS is configured in backend
3. Check backend is running (visit /api/health)
4. Check browser console for exact error
```

#### Build Failed
```
Solution:
1. Check all dependencies are in package.json
2. Run "npm run build" locally first
3. Check build logs for specific error
4. Ensure Node version matches (18+)
```

---

## 📊 Deployment Checklist

### Before Deployment
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] .env files configured
- [ ] .gitignore includes .env files
- [ ] Code pushed to GitHub

### Backend Deployment
- [ ] Render account created
- [ ] Web service created
- [ ] Environment variables added
- [ ] Build successful
- [ ] Health check passes
- [ ] Database connected
- [ ] Seed data loaded

### Frontend Deployment
- [ ] API URL updated
- [ ] Build successful locally
- [ ] Deployed to Vercel/Netlify
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Can login
- [ ] Can make purchases

### Post-Deployment
- [ ] Test all features
- [ ] Check payment flow
- [ ] Test admin dashboard
- [ ] Monitor logs
- [ ] Set up error tracking
- [ ] Configure custom domain (optional)

---

## 🎯 Quick Commands Reference

### Local Development
```powershell
# Backend
cd server
npm run dev

# Frontend
npm run dev:client
```

### Production Build
```powershell
# Frontend build
npm run build

# Test production build locally
npm run preview
```

### Deployment
```powershell
# Deploy to Vercel
vercel --prod

# Check Render logs
# Go to Render dashboard → Logs tab
```

---

## 💰 Cost Breakdown

### Free Tier (Current Setup)
- MongoDB Atlas: Free (M0 - 512MB)
- Render Backend: Free (750 hours/month)
- Vercel Frontend: Free (100GB bandwidth)
- **Total: ₹0/month**

### Limitations
- Render free tier sleeps after 15 min inactivity
- First request after sleep takes 30-60 seconds
- MongoDB Atlas M0 has 512MB storage limit

### Paid Tier (For Production)
- MongoDB Atlas M10: $57/month (~₹4,750)
- Render Starter: $7/month (~₹580)
- Vercel Pro: $20/month (~₹1,660)
- **Total: ~₹7,000/month**

---

## 🎉 Success!

Once deployed, your URLs will be:
```
Frontend: https://mayur-paints.vercel.app
Backend:  https://mayur-paints-backend.onrender.com
Database: MongoDB Atlas (cloud)
```

**Your app is now live!** 🚀

---

## 📞 Support

If you face issues:
1. Check Render logs
2. Check MongoDB Atlas metrics
3. Check browser console
4. Verify environment variables
5. Test API endpoints directly

**Good luck with deployment!** 🎨✨
