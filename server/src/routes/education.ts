import express from 'express';
import Education from '../models/Education';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all education
router.get('/', async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1 });
    res.json({ success: true, data: education });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create education (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json({ success: true, data: education });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update education (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    res.json({ success: true, data: education });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete education (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    res.json({ success: true, message: 'Education deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
