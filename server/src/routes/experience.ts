import express from 'express';
import Experience from '../models/Experience';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1 });
    res.json({ success: true, data: experiences });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create experience (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({ success: true, data: experience });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update experience (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json({ success: true, data: experience });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete experience (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json({ success: true, message: 'Experience deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
