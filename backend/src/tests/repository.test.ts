import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import Contract from '../models/Contract';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

describe('Repository API', () => {
  let token: string;
  let userId: string;
  let contractId: string;

  beforeAll(async () => {
    // Create test user
    const user = new User({
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'Test User',
      role: 'user'
    });
    await user.save();
    userId = user._id.toString();
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret');

    // Create test contract
    const contract = new Contract({
      title: 'Test Contract',
      parties: ['Party A', 'Party B'],
      object: 'Test object',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      amount: 1000,
      type: 'service',
      createdBy: userId
    });
    await contract.save();
    contractId = contract._id.toString();
  });

  afterAll(async () => {
    await Contract.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();

    // Clean up uploads
    const uploadDir = path.join(process.cwd(), 'uploads', contractId);
    if (fs.existsSync(uploadDir)) {
      fs.rmSync(uploadDir, { recursive: true, force: true });
    }
  });

  describe('POST /contracts/:contractId/documents', () => {
    it('should upload a document', async () => {
      const response = await request(app)
        .post(`/contracts/${contractId}/documents`)
        .set('Authorization', `Bearer ${token}`)
        .attach('document', Buffer.from('test file content'), 'test.pdf');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.filename).toMatch(/^[a-f0-9-]+\.pdf$/);
    });

    it('should reject invalid file type', async () => {
      const response = await request(app)
        .post(`/contracts/${contractId}/documents`)
        .set('Authorization', `Bearer ${token}`)
        .attach('document', Buffer.from('test'), 'test.exe');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /contracts/:contractId/documents', () => {
    it('should list documents', async () => {
      const response = await request(app)
        .get(`/contracts/${contractId}/documents`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /contracts/:contractId/documents/:documentId/download', () => {
    let documentId: string;

    beforeAll(async () => {
      // Upload a document first
      const uploadResponse = await request(app)
        .post(`/contracts/${contractId}/documents`)
        .set('Authorization', `Bearer ${token}`)
        .attach('document', Buffer.from('test content'), 'download.pdf');

      documentId = uploadResponse.body.id;
    });

    it('should download a document', async () => {
      const response = await request(app)
        .get(`/contracts/${contractId}/documents/${documentId}/download`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');
    });
  });

  describe('DELETE /contracts/:contractId/documents/:documentId', () => {
    let documentId: string;

    beforeAll(async () => {
      // Upload a document first
      const uploadResponse = await request(app)
        .post(`/contracts/${contractId}/documents`)
        .set('Authorization', `Bearer ${token}`)
        .attach('document', Buffer.from('test content'), 'delete.pdf');

      documentId = uploadResponse.body.id;
    });

    it('should delete a document', async () => {
      const response = await request(app)
        .delete(`/contracts/${contractId}/documents/${documentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe('Document deleted');
    });
  });
});