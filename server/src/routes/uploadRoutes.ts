import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, upload.single('image'), uploadImage);
router.delete('/', authMiddleware, adminMiddleware, deleteImage);

export default router;
