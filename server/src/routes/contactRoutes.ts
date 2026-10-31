import express from 'express';
import { submitContact, getMessages, updateMessage, deleteMessage } from '../controllers/contactController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', submitContact);
router.get('/', authMiddleware, adminMiddleware, getMessages);
router.patch('/:id', authMiddleware, adminMiddleware, updateMessage);
router.delete('/:id', authMiddleware, adminMiddleware, deleteMessage);

export default router;
