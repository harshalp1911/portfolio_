import { Request, Response } from 'express';
import Analytics from '../models/Analytics';
import Project from '../models/Project';
import Post from '../models/Post';
import Message from '../models/Message';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectCount = await Project.countDocuments();
    const postCount = await Post.countDocuments();
    const messageCount = await Message.countDocuments();

    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title imageUrl');

    res.json({
      projectCount,
      postCount,
      messageCount,
      recentProjects
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const trackEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, itemId } = req.body;

    await Analytics.create({
      type,
      itemId,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });

    res.status(201).json({ message: 'Event tracked' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
