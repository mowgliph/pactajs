import express from 'express';
import {
  authenticate,
  getContracts,
  getContract,
  createContract,
  updateContract,
  deleteContract,
  searchContracts
} from '../controllers/contracts.js';
import {
  uploadDocument,
  listDocuments,
  downloadDocument,
  deleteDocument
} from '../controllers/repository.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getContracts);
router.get('/search', searchContracts);
router.get('/:id', getContract);
router.post('/', createContract);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);

// Document routes
router.post('/:contractId/documents', uploadDocument);
router.get('/:contractId/documents', listDocuments);
router.get('/:contractId/documents/:documentId/download', downloadDocument);
router.delete('/:contractId/documents/:documentId', deleteDocument);

export default router;