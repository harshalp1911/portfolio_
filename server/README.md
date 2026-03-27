# Portfolio Backend Server

Backend API for the portfolio website built with Node.js, Express, TypeScript, and MongoDB.

## Features

- RESTful API for portfolio management
- JWT authentication for admin access
- Image upload with Cloudinary integration
- Analytics tracking for projects and posts
- Blog/Posts management with comments and likes
- Skills, Education, and Experience management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Posts
- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/comment` - Add comment to post

### Skills
- `GET /api/skills` - Get all skills (grouped by category)
- `POST /api/skills` - Create skill (admin only)
- `PUT /api/skills/:id` - Update skill (admin only)
- `DELETE /api/skills/:id` - Delete skill (admin only)

### Upload
- `POST /api/upload` - Upload image to Cloudinary (admin only)
- `DELETE /api/upload` - Delete image from Cloudinary (admin only)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics (admin only)
- `POST /api/analytics/track` - Track event

## Technologies

- Node.js & Express
- TypeScript
- MongoDB & Mongoose
- JWT for authentication
- Cloudinary for image storage
- Bcrypt for password hashing
