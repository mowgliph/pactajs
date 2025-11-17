import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import Contract from '../models/Contract';
import User from '../models/User';

describe('Supplements API', () => {
  let token: string;
  let contractId: string;
  let userId: string;

  beforeAll(async () => {
    // Create test user
    const user = new User({
      email: 'test@example.com',
      password: 'hashedpassword'
    });
    await user.save();
    userId = user._id.toString();

    // Create test contract
    const contract = new Contract({
      title: 'Test Contract',
      parties: ['Party A', 'Party B'],
      object: 'Test object',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      amount: 1000,
      type: 'service',
      createdBy: userId,
      supplements: []
    });
    await contract.save();
    contractId = contract._id.toString();

    // Mock JWT token
    token = 'mock-jwt-token';
  });

  afterAll(async () => {
    await Contract.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /supplements/:contractId', () => {
    it('should create a supplement', async () => {
      const supplementData = {
        modifiedFields: [
          { field: 'amount', oldValue: 1000, newValue: 1500 }
        ],
        effectiveDate: new Date().toISOString(),
        reason: 'Price increase'
      };

      const response = await request(app)
        .post(`/supplements/${contractId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(supplementData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.modifiedFields).toEqual(supplementData.modifiedFields);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post(`/supplements/${contractId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /supplements/:contractId', () => {
    it('should get supplements for a contract', async () => {
      const response = await request(app)
        .get(`/supplements/${contractId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /supplements', () => {
    it('should search supplements', async () => {
      const response = await request(app)
        .get('/supplements')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});