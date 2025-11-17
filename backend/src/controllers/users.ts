import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

interface AuthRequest extends Request {
  user?: any;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Only admins can assign roles
    const userRole = role && req.user?.role === 'admin' ? role : 'user';

    const user = new User({ email, password: hashedPassword, name, role: userRole });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') return res.status(403).send('Admin access required');
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin' && req.user?.id !== req.params.id) return res.status(403).send('Access denied');
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (error) {
    res.status(500).send('Error fetching user');
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin' && req.user?.id !== req.params.id) return res.status(403).send('Access denied');
    const { name, email, role, password } = req.body;
    const updateData: any = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (role && req.user?.role === 'admin') {
      updateData.role = role;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (error) {
    res.status(400).send('Error updating user');
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin' && req.user?.id !== req.params.id) return res.status(403).send('Access denied');
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send('User deleted');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
};