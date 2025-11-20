import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';

interface AuthRequest extends Request {
  user?: User;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Only admins can assign roles
    const authReq = req as AuthRequest;
    const userRole = role && authReq.user?.role === UserRole.ADMIN ? role : UserRole.USER;

    const userRepository = AppDataSource.getRepository(User);
    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.name = name;
    user.role = userRole;

    await userRepository.save(user);
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== UserRole.ADMIN) return res.status(403).send('Admin access required');
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt']
    });
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== UserRole.ADMIN && req.user?.id !== req.params.id) return res.status(403).send('Access denied');
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req.params.id },
      select: ['id', 'email', 'name', 'role', 'createdAt', 'updatedAt', 'expirationWarningDays', 'enableBrowserNotifications', 'enableEmailNotifications']
    });
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (error) {
    res.status(500).send('Error fetching user');
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== UserRole.ADMIN && req.user?.id !== req.params.id) return res.status(403).send('Access denied');
    const { name, email, role, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: req.params.id });
    
    if (!user) return res.status(404).send('User not found');

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (role && req.user?.role === UserRole.ADMIN) {
      user.role = role;
    }

    await userRepository.save(user);
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).send('Error updating user');
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== UserRole.ADMIN && req.user?.id !== req.params.id) return res.status(403).send('Access denied');
    const userRepository = AppDataSource.getRepository(User);
    const result = await userRepository.delete(req.params.id);
    if (result.affected === 0) return res.status(404).send('User not found');
    res.send('User deleted');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
};