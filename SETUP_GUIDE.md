# Portfolio MERN Stack Setup Guide

Complete guide to set up and run your portfolio website.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account (for image uploads)
- Git

## Project Structure

```
portfolio_/
├── client/          # React frontend
├── server/          # Node.js backend
├── css/            # Old static site assets (backup)
├── js/             # Old static site assets (backup)
├── img/            # Old static site assets (backup)
└── index.html      # Old static site (backup)
```

## Backend Setup

### 1. Navigate to server directory
```bash
cd server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

### 4. Get MongoDB Atlas URI
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name (e.g., `portfolio`)

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

### 5. Get Cloudinary Credentials
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Go to Dashboard
4. Copy Cloud Name, API Key, and API Secret

### 6. Run the backend server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

Server will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to client directory
```bash
cd client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install additional packages
```bash
npm install axios react-router-dom react-query
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4. Configure environment variables
Create a `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Run the frontend
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## First Time Setup - Create Admin User

After both servers are running:

1. Use Postman or curl to create admin user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "your-email@example.com",
    "password": "your-secure-password"
  }'
```

2. Save the returned JWT token
3. Use this token to access admin panel

## Development Workflow

1. Start backend server: `cd server && npm run dev`
2. Start frontend server: `cd client && npm start`
3. Access frontend: `http://localhost:3000`
4. Access backend API: `http://localhost:5000/api`

## Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables in dashboard
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Set environment variable: `REACT_APP_API_URL=your-backend-url`
6. Deploy

## Troubleshooting

### MongoDB Connection Issues
- Check if IP address is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure database user has correct permissions

### Cloudinary Upload Issues
- Verify credentials are correct
- Check upload folder permissions
- Ensure file size is within limits (5MB default)

### CORS Issues
- Verify frontend URL is allowed in backend CORS config
- Check API URL in frontend .env file

## Next Steps

1. ✅ Backend API is ready
2. ⏳ Configure frontend with Tailwind CSS
3. ⏳ Build React components
4. ⏳ Create admin panel
5. ⏳ Add blog section
6. ⏳ Implement analytics dashboard
7. ⏳ Deploy to production

## Support

For issues or questions, refer to:
- Backend README: `server/README.md`
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Cloudinary Docs: https://cloudinary.com/documentation
