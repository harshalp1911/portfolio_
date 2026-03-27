import express from 'express';
import { getResume, uploadResume, deleteResume } from '../controllers/resumeController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', getResume);
router.post('/', authMiddleware, adminMiddleware, uploadResume);
router.delete('/:id', authMiddleware, adminMiddleware, deleteResume);

export default router;
