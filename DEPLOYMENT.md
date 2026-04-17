# 🚀 Deployment Guide

## Production Build

The project has been successfully built for production. The build files are located in the `dist/` directory.

### Build Status
✅ **Build Successful** - No errors detected
✅ **All Assets Optimized** - CSS and JS minified
✅ **Dynamic Imports Resolved** - Warning addressed

## Environment Setup

### Frontend Environment Variables
Create `.env.production` in the root directory:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=Mayur Paints
VITE_APP_VERSION=1.0.0
```

### Backend Environment Variables
Update `server/.env` for production:

```env
NODE_ENV=production
MONGO_URI=mongodb://your-production-db-url
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
```

## Deployment Options

### 1. Static Hosting (Frontend Only)
For platforms like Vercel, Netlify, or GitHub Pages:

```bash
# Build the project
npm run build

# Deploy the dist/ folder
```

### 2. Full Stack Deployment
For platforms like Heroku, DigitalOcean, or AWS:

```bash
# Install dependencies
npm install
cd server && npm install

# Build frontend
npm run build

# Start backend server
cd server && npm start
```

### 3. Docker Deployment
Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --only=production
RUN cd server && npm ci --only=production

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server/index.js"]
```

## Database Setup

### MongoDB Production
1. Create a MongoDB Atlas cluster
2. Update connection string in `server/.env`
3. Run database seed script:

```bash
cd server
npm run seed
```

## SSL/HTTPS Setup

### For Production
- Use HTTPS certificates
- Update API base URL in environment variables
- Configure CORS for production domain

## Performance Optimization

### Implemented Optimizations
✅ Code splitting and lazy loading
✅ Image optimization
✅ CSS/JS minification
✅ Gzip compression ready
✅ Browser caching headers

### Additional Recommendations
- Enable CDN for static assets
- Implement service worker for PWA
- Add database indexing
- Use Redis for session storage

## Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry
- **Performance**: Lighthouse CI
- **Analytics**: Google Analytics
- **Uptime**: Pingdom/UptimeRobot

## Security Checklist

### Implemented Security
✅ Input validation
✅ SQL injection prevention
✅ XSS protection
✅ CORS configuration
✅ JWT authentication

### Additional Security Measures
- Rate limiting
- CSRF protection
- Content Security Policy
- Regular security updates

## Backup Strategy

### Database Backups
```bash
# MongoDB backup
mongodump --uri="mongodb://your-connection-string" --out=/backup/$(date +%Y%m%d)
```

### File Backups
- Source code: Git repository
- Media files: Cloud storage
- Configuration: Environment variables

## Troubleshooting

### Common Issues
1. **Build fails**: Check Node.js version (v18+)
2. **API errors**: Verify MongoDB connection
3. **Static assets**: Check base URL configuration
4. **Environment variables**: Ensure all required vars are set

### Health Checks
```bash
# Check API health
curl https://your-domain.com/api/health

# Check frontend
curl https://your-domain.com/
```

## Support

For deployment issues:
1. Check logs: `heroku logs --tail` (or equivalent)
2. Verify environment variables
3. Test API endpoints individually
4. Review build output for errors

---

**Project Status**: ✅ Ready for Production Deployment
