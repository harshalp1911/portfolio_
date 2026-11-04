import { Request, Response } from 'express';
import Resume from '../models/Resume';
import cloudinary from '../config/cloudinary';

const getResumeDownloadUrl = (publicId: string): string => (
  cloudinary.utils.private_download_url(publicId, 'pdf', {
    resource_type: 'raw',
    type: 'upload',
  })
);

export const getResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne().sort({ uploadedAt: -1 });
    if (!resume) {
      res.status(404).json({ message: 'No resume found' });
      return;
    }

    const response = resume.toObject();
    if (resume.publicId) {
      response.fileUrl = getResumeDownloadUrl(resume.publicId);
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const uploadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileUrl, fileName, publicId } = req.body;
    
    if (!fileUrl || !fileName) {
      res.status(400).json({ message: 'Missing required fields: fileUrl, fileName' });
      return;
    }

    const resume = new Resume({ fileUrl, fileName, publicId });
    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    if (resume.publicId) {
      await cloudinary.uploader.destroy(resume.publicId, { resource_type: 'raw' });
    }

    await resume.deleteOne();
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
