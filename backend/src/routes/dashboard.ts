import express from 'express';
import { getDashboardData } from '../controllers/dashboard';
import { authenticate } from '../controllers/contracts';

const router = express.Router();

// GET /dashboard - Get dashboard data
router.get('/', authenticate, getDashboardData);

export default router;