import express from 'express';
import Content from '../models/Content';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Get content by type (hero or about)
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['hero', 'about'].includes(type)) {
      return res.status(400).json({ message: 'Invalid content type' });
    }

    let content = await Content.findOne({ type });
    
    // Create default content if it doesn't exist
    if (!content) {
      const defaultContent = {
        type,
        hero: type === 'hero' ? {
          tagline: 'GET EVERY SINGLE SOLUTIONS',
          title: "I'm Full Stack Developer\nHarshal Patil",
          description: 'Passionate about building scalable web applications and optimizing user experiences. Skilled in MERN stack, backend development, and real-time collaboration tools. Strong foundation in data structures, algorithms, and system design.',
          primaryButtonText: 'View Work',
          primaryButtonLink: '/projects',
          secondaryButtonText: 'Hire Me',
          secondaryButtonLink: '/contact',
        } : undefined,
        about: type === 'about' ? {
          title: 'Designing With Passion While\nExploring The World.',
          description1: 'Full Stack Developer with expertise in MERN stack, backend development, and real-time collaboration tools. I specialize in building scalable web applications that deliver exceptional user experiences.',
          description2: 'With a strong foundation in data structures, algorithms, and system design, I approach every project with a problem-solving mindset and attention to detail.',
          contactTitle: 'Any Type Of Query\n& Discussion.',
          contactSubtitle: 'Late talk with me',
          email: 'harshalp0602@gmail.com',
        } : undefined,
      };
      
      content = await Content.create(defaultContent);
    }

    // Return data in the format expected by frontend
    const responseData = type === 'hero' ? { hero: content.hero } : { about: content.about };
    res.json({ success: true, data: responseData });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update content (admin only)
router.put('/:type', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['hero', 'about'].includes(type)) {
      return res.status(400).json({ message: 'Invalid content type' });
    }

    const content = await Content.findOneAndUpdate(
      { type },
      { type, [type]: req.body },
      { new: true, upsert: true }
    );

    // Return data in the format expected by frontend
    const responseData = type === 'hero' ? { hero: content.hero } : { about: content.about };
    res.json({ success: true, data: responseData });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
