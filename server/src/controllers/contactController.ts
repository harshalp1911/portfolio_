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

    // Log contact form submission
    console.log('='.repeat(60));
    console.log('📧 NEW CONTACT FORM SUBMISSION');
    console.log('='.repeat(60));
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log('='.repeat(60));
    
    // TODO: Install nodemailer package to enable email functionality
    // Run: npm install nodemailer @types/nodemailer
    // Then uncomment the email code below
    
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'harshalp0602@gmail.com',
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'harshalp0602@gmail.com',
      to: 'harshalp0602@gmail.com',
      replyTo: email,
      subject: `Portfolio Contact: Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    */
    
    res.status(200).json({ message: 'Message received successfully!' });
    
  } catch (error: any) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};
