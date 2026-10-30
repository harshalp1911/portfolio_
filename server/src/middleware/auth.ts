import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No authentication token, access denied' });
      return;
    }

    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;

    // Re-check the account so deleting a user revokes their token immediately
    const user = await User.findById(decoded.userId).select('role');
    if (!user) {
      res.status(401).json({ message: 'Token is not valid' });
      return;
    }

    req.user = { userId: String(user._id), role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admin only.' });
    return;
  }
  next();
};
