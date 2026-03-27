import express from 'express';
import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill
} from '../controllers/skillController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllSkills);
router.post('/', authMiddleware, adminMiddleware, createSkill);
router.put('/:id', authMiddleware, adminMiddleware, updateSkill);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSkill);

export default router;
