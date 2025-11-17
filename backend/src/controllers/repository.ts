import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Contract from '../models/Contract.js';

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
      const contract = await Contract.findOne({ _id: contractId, createdBy: req.user?.role === 'admin' ? { $exists: true } : req.user?.id });
      if (!contract) return res.status(404).send('Contract not found');

      if (!req.file) return res.status(400).send('No file uploaded');

      const document = {
        id: uuidv4(),
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimeType: req.file.mimetype,
        uploadedAt: new Date()
      };

      contract.documents.push(document);
      await contract.save();

      res.status(201).json(document);
    } catch (error) {
      res.status(500).send('Error uploading document');
    }
  }
];

// List documents for contract
export const listDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId } = req.params as { contractId: string };
    const contract = await Contract.findOne({ _id: contractId, createdBy: req.user?.role === 'admin' ? { $exists: true } : req.user?.id });
    if (!contract) return res.status(404).send('Contract not found');

    res.json(contract.documents);
  } catch (error) {
    res.status(500).send('Error fetching documents');
  }
};

// Download document
export const downloadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId, documentId } = req.params as { contractId: string; documentId: string };
    const contract = await Contract.findOne({ _id: contractId, createdBy: req.user?.role === 'admin' ? { $exists: true } : req.user?.id });
    if (!contract) return res.status(404).send('Contract not found');

    const document = contract.documents.find(doc => doc.id === documentId);
    if (!document) return res.status(404).send('Document not found');

    res.download(document.path, document.originalName);
  } catch (error) {
    res.status(500).send('Error downloading document');
  }
};

// Delete document
export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId, documentId } = req.params as { contractId: string; documentId: string };
    const contract = await Contract.findOne({ _id: contractId, createdBy: req.user?.role === 'admin' ? { $exists: true } : req.user?.id });
    if (!contract) return res.status(404).send('Contract not found');

    const docIndex = contract.documents.findIndex(doc => doc.id === documentId);
    if (docIndex === -1) return res.status(404).send('Document not found');

    const document = contract.documents[docIndex];

    // Remove file from filesystem
    fs.unlinkSync(document.path);

    // Remove from array
    contract.documents.splice(docIndex, 1);
    await contract.save();

    res.send('Document deleted');
  } catch (error) {
    res.status(500).send('Error deleting document');
  }
};