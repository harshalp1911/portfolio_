import { Request, Response } from 'express';
import Resume from '../models/Resume';

export const getResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne().sort({ uploadedAt: -1 });
    if (!resume) {
      res.status(404).json({ message: 'No resume found' });
      return;
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const uploadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileUrl, fileName } = req.body;
    
    if (!fileUrl || !fileName) {
      res.status(400).json({ message: 'Missing required fields: fileUrl, fileName' });
      return;
    }

    const resume = new Resume({ fileUrl, fileName });
    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
