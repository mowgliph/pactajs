import express from 'express';
import { getDashboardData } from '../controllers/dashboard.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /dashboard - Get dashboard data
router.get('/', authenticate, getDashboardData);

export default router;