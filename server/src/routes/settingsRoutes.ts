import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', getSettings);
router.put('/', authMiddleware, adminMiddleware, updateSettings);

export default router;
