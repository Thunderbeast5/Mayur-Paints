# MongoDB Atlas Setup for Render Deployment

## Quick Setup Steps

### 1. Create MongoDB Atlas Account
- Go to: https://www.mongodb.com/cloud/atlas/register
- Sign up (FREE tier - M0 Sandbox)
- Choose AWS, Mumbai region
- Cluster name: `mayurpaints-cluster`

### 2. Create Database User
- **Database Access** → **Add New Database User**
- Username: `mayurpaints_admin`
- Password: [Generate strong password - SAVE IT!]
- Privileges: **Read and write to any database**

### 3. Whitelist IP
- **Network Access** → **Add IP Address**
- Click **Allow Access from Anywhere** (0.0.0.0/0)

### 4. Get Connection String
- **Database** → **Connect** → **Connect your application**
- Driver: Node.js 5.5+
- Copy connection string:
  ```
  mongodb+srv://mayurpaints_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Replace `<password>` with your actual password
- Add database name: `/mayurpaints` after `.net`

**Final format:**
```
mongodb+srv://mayurpaints_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mayurpaints?retryWrites=true&w=majority
```

### 5. Update Render Environment Variables

Go to Render Dashboard → Your Service → **Environment** tab

Add these variables:

```env
MONGO_URI=mongodb+srv://mayurpaints_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mayurpaints?retryWrites=true&w=majority
JWT_SECRET=mayurpaints_super_secret_key_2024
NODE_ENV=production
PORT=3001
UPI_ID=your_upi_id@bank
ADMIN_EMAIL=admin@mayurpaints.com
ADMIN_PASSWORD=admin123
```

Click **Save Changes** - Render will auto-redeploy.

### 6. Seed Database

After successful deployment:

1. Render Dashboard → Your Service → **Shell** tab
2. Run:
   ```bash
   cd server
   node seed-professional.js
   ```

### 7. Verify Deployment

Check health endpoint:
```
https://your-render-url.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2026-04-17T..."
}
```

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:27017"
- ❌ You're using local MongoDB URI
- ✅ Update `MONGO_URI` in Render to Atlas connection string

### Error: "Authentication failed"
- Check username/password in connection string
- Verify database user exists in Atlas

### Error: "IP not whitelisted"
- Add 0.0.0.0/0 to Network Access in Atlas

### Error: "Cannot connect to cluster"
- Check connection string format
- Ensure database name is included: `/mayurpaints`
- Verify cluster is running in Atlas

## Next Steps After Backend Deployment

1. **Test Backend APIs**: Use Postman or browser to test endpoints
2. **Deploy Frontend**: Vercel or Netlify
3. **Update Frontend API URL**: Point to Render backend URL
4. **Update CORS**: Add production frontend URL to `allowedOrigins` in `server/index.js`
5. **Test Full Flow**: Register, login, browse products, add to cart, payment

## Important Notes

- MongoDB Atlas FREE tier: 512MB storage (enough for your project)
- Connection string contains password - keep it secret!
- Never commit `.env` files to GitHub
- Render automatically uses environment variables from dashboard
- Database seeding only needs to be done once

## MongoDB Atlas Dashboard

Monitor your database:
- **Collections**: View products, users, orders
- **Metrics**: Database size, connections, operations
- **Logs**: Connection logs, slow queries

Access: https://cloud.mongodb.com/
