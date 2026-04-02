# Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- Render account (render.com)
- MongoDB Atlas database
- Cloudinary account (for image uploads)

## Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Deploy Backend on Render

1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: portfolio-backend
   - **Environment**: Node
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_random_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_app_password
   ```

## Step 3: Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: portfolio-frontend
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
   - **Instance Type**: Free

4. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://portfolio-backend.onrender.com
   ```

## Step 4: Update CORS Settings

1. Get your frontend URL from Render dashboard (e.g., `https://portfolio-frontend.onrender.com`)
2. Go to your backend service on Render
3. Add environment variable:
   ```
   FRONTEND_URL=https://portfolio-frontend.onrender.com
   ```
4. Redeploy the backend

## Step 5: Verify Deployment

1. Check both services are running
2. Test frontend loads correctly
3. Test API endpoints are accessible
4. Test forms and file uploads work

## Important Notes

- **Free Tier Limitations**: Render free tier spins down after 15 minutes of inactivity, causing cold starts (~30 seconds)
- **MongoDB**: Use MongoDB Atlas free tier for database
- **Environment Variables**: Never commit sensitive data to Git
- **Build Process**: Backend builds frontend automatically due to `postbuild` script

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure FRONTEND_URL is set correctly in backend
2. **Database Connection**: Verify MONGODB_URI is correct and network access is allowed
3. **Build Failures**: Check logs for missing dependencies or build errors
4. **API 404s**: Verify REACT_APP_API_URL is correct in frontend

### Debug Commands:
```bash
# Check backend logs
# In Render dashboard: Logs → Service

# Test API directly
curl https://your-backend-url.onrender.com/api/projects

# Check frontend build
# In Render dashboard: Logs → Build
```

## Post-Deployment

1. Update any hardcoded URLs in your code
2. Set up custom domains if needed
3. Configure monitoring and alerts
4. Test all features thoroughly
