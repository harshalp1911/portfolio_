import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import Message from '../models/Message';
import Settings from '../models/Settings';
import Analytics from '../models/Analytics';

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (text: string): string => (
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
);

// Best-effort notification; the message is already saved, so failures are only logged.
const sendNotificationEmail = async (name: string, email: string, message: string): Promise<void> => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log('Contact email skipped: EMAIL_USER / EMAIL_PASS not configured');
    return;
  }

  const settings = await Settings.findOne();
  const recipient = settings?.email || EMAIL_USER;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${EMAIL_USER}>`,
    to: recipient,
    replyTo: email,
    subject: `Portfolio Contact: Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `,
  });
};

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = String(req.body.name ?? '').trim();
    const email = String(req.body.email ?? '').trim();
    const message = String(req.body.message ?? '').trim();

    if (!name || !email || !message) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (!EMAIL_REGEX.test(email) || email.length > MAX_EMAIL_LENGTH) {
      res.status(400).json({ message: 'Please enter a valid email address' });
      return;
    }

    if (name.length > MAX_NAME_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({ message: `Name must be under ${MAX_NAME_LENGTH} characters and message under ${MAX_MESSAGE_LENGTH}` });
      return;
    }

    await Message.create({ name, email, message });
    await Analytics.create({
      type: 'contact_form',
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });

    res.status(201).json({ message: 'Message received successfully!' });

    sendNotificationEmail(name, email, message).catch((error) => {
      console.error('Contact email failed:', error.message);
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: Boolean(req.body.read) },
      { new: true }
    );

    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
