import express from 'express';
import {
  createSupplement,
  getSupplements,
  searchSupplements
} from '../controllers/supplements.js';
import { authenticate } from '../controllers/contracts.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/:contractId', createSupplement);
router.get('/:contractId', getSupplements);
router.get('/', searchSupplements);

export default router;