import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../data-source.js';
import { Contract } from '../entities/Contract.js';
import { ContractDocument } from '../entities/ContractDocument.js';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
  file?: Express.Multer.File;
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const contractId = req.params.contractId;
    const uploadPath = path.join('uploads', contractId);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload document to contract
export const uploadDocument = [
  upload.single('document'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { contractId } = req.params as { contractId: string };
      const contractRepository = AppDataSource.getRepository(Contract);
      const documentRepository = AppDataSource.getRepository(ContractDocument);

      const query: any = { id: contractId };
      if (req.user?.role !== 'admin') {
        query.createdById = req.user?.id;
      }

      const contract = await contractRepository.findOne({ where: query });
      if (!contract) return res.status(404).send('Contract not found');

      if (!req.file) return res.status(400).send('No file uploaded');

      const document = documentRepository.create({
        contractId: contract.id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimeType: req.file.mimetype
      });

      await documentRepository.save(document);

      res.status(201).json(document);
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).send('Error uploading document');
    }
  }
];

// List documents for contract
export const listDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId } = req.params as { contractId: string };
    const contractRepository = AppDataSource.getRepository(Contract);
    const documentRepository = AppDataSource.getRepository(ContractDocument);

    const query: any = { id: contractId };
    if (req.user?.role !== 'admin') {
      query.createdById = req.user?.id;
    }

    const contract = await contractRepository.findOne({ where: query });
    if (!contract) return res.status(404).send('Contract not found');

    const documents = await documentRepository.find({
      where: { contractId },
      order: { uploadedAt: 'DESC' }
    });

    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).send('Error fetching documents');
  }
};

// Download document
export const downloadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId, documentId } = req.params as { contractId: string; documentId: string };
    const contractRepository = AppDataSource.getRepository(Contract);
    const documentRepository = AppDataSource.getRepository(ContractDocument);

    const query: any = { id: contractId };
    if (req.user?.role !== 'admin') {
      query.createdById = req.user?.id;
    }

    const contract = await contractRepository.findOne({ where: query });
    if (!contract) return res.status(404).send('Contract not found');

    const document = await documentRepository.findOne({
      where: { id: documentId, contractId }
    });

    if (!document) return res.status(404).send('Document not found');

    res.download(document.path, document.originalName);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).send('Error downloading document');
  }
};

// Delete document
export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId, documentId } = req.params as { contractId: string; documentId: string };
    const contractRepository = AppDataSource.getRepository(Contract);
    const documentRepository = AppDataSource.getRepository(ContractDocument);

    const query: any = { id: contractId };
    if (req.user?.role !== 'admin') {
      query.createdById = req.user?.id;
    }

    const contract = await contractRepository.findOne({ where: query });
    if (!contract) return res.status(404).send('Contract not found');

    const document = await documentRepository.findOne({
      where: { id: documentId, contractId }
    });

    if (!document) return res.status(404).send('Document not found');

    // Remove file from filesystem
    try {
      if (fs.existsSync(document.path)) {
        fs.unlinkSync(document.path);
      }
    } catch (err) {
      console.error('Error deleting file from filesystem:', err);
    }

    await documentRepository.remove(document);

    res.send('Document deleted');
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).send('Error deleting document');
  }
};