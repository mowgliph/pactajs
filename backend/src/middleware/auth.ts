import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

interface AuthRequest extends Request {
  user?: User;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: decoded.id });
    
    if (!user) return res.status(401).send('Invalid token');

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send('Invalid token');
  }
};

export const requireRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).send('Insufficient permissions');
    }
    next();
  };
};

export const requireAdmin = requireRole('admin');