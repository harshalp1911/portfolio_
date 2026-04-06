// Fix SSL certificate issue for Cloudinary
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import postRoutes from './routes/postRoutes';
import skillRoutes from './routes/skillRoutes';
import uploadRoutes from './routes/uploadRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import resumeRoutes from './routes/resumeRoutes';
import settingsRoutes from './routes/settingsRoutes';
import contactRoutes from './routes/contactRoutes';
import contentRoutes from './routes/content';
import experienceRoutes from './routes/experience';
import educationRoutes from './routes/education';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

connectDB();

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Portfolio API Server Running' });
});

app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
