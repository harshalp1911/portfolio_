import { Request, Response } from 'express';
// import nodemailer from 'nodemailer';
import Settings from '../models/Settings';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // For now, just log the contact form submission
    console.log('Contact form submission:', { name, email, message });
    
    // TODO: Add nodemailer functionality once package is properly installed
    res.status(200).json({ message: 'Message received successfully!' });
    
  } catch (error: any) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};
