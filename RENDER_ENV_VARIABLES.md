# Render Environment Variables

## Copy these EXACT values to Render Dashboard

Go to: **Render Dashboard → Your Service → Environment Tab**

Click **Add Environment Variable** for each:

---

### 1. MONGO_URI
```
mongodb+srv://manashshinde_db_user:4o2X1KZ6NUzSGXcP@cluster0.5kyrnmk.mongodb.net/mayurpaints?retryWrites=true&w=majority&appName=Cluster0
```

### 2. JWT_SECRET
```
mayurpaints_super_secret_key_2024
```

### 3. NODE_ENV
```
production
```

### 4. PORT
```
3001
```

### 5. UPI_ID
```
your_upi_id@bank
```
(Replace with your actual UPI ID like: `9876543210@paytm`)

### 6. ADMIN_EMAIL
```
admin@mayurpaints.com
```

### 7. ADMIN_PASSWORD
```
admin123
```

---

## After Adding Variables

1. Click **Save Changes**
2. Render will automatically redeploy (takes 2-3 minutes)
3. Check logs for: `✅ MongoDB Connected: cluster0.5kyrnmk.mongodb.net`

## Test Deployment

Once deployed, visit:
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

## Seed Database

After successful deployment:

1. Go to Render Dashboard → Your Service → **Shell** tab
2. Run:
   ```bash
   node seed-professional.js
   ```
3. Wait for: `✅ Database seeded successfully!`

## Important Notes

- ⚠️ Never commit `.env` file to GitHub (already in `.gitignore`)
- ✅ Render reads environment variables from dashboard, not from `.env` file
- 🔒 Keep your MongoDB password secure
- 📝 Database name is `mayurpaints` (already in the URI)

## Next Steps

1. ✅ Add environment variables to Render
2. ✅ Wait for deployment to complete
3. ✅ Test `/api/health` endpoint
4. ✅ Seed database via Shell
5. ✅ Deploy frontend (Vercel/Netlify)
6. ✅ Update frontend API URL to Render backend
7. ✅ Add frontend URL to CORS in `server/index.js`
