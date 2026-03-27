import express from 'express';
import { getDashboardStats, trackEvent } from '../controllers/analyticsController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);
router.post('/track', trackEvent);

export default router;
