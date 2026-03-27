import { Request, Response } from 'express';
import Analytics from '../models/Analytics';
import Project from '../models/Project';
import Post from '../models/Post';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalViews = await Analytics.countDocuments();
    const projectViews = await Analytics.countDocuments({ type: 'project_view' });
    const postViews = await Analytics.countDocuments({ type: 'post_view' });
    const contactForms = await Analytics.countDocuments({ type: 'contact_form' });

    const topProjects = await Project.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title views imageUrl');

    const recentActivity = await Analytics.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('itemId', 'title');

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const viewsByDay = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      totalViews,
      projectViews,
      postViews,
      contactForms,
      topProjects,
      recentActivity,
      viewsByDay
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
