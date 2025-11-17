import express from 'express';
import { register, login, getUsers, getUser, updateUser, deleteUser } from '../controllers/users.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/', authenticate, requireAdmin, getUsers);
router.get('/:id', authenticate, getUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, requireAdmin, deleteUser);

export default router;