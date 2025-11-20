import request from 'supertest';
import app from '../server';
import { AppDataSource } from '../data-source';
import { Contract, ContractStatus, ContractType } from '../entities/Contract';
import { User, UserRole } from '../entities/User';

describe('Supplements API', () => {
  let token: string;
  let contractId: string;
  let userId: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Create test user
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({
      email: 'test@example.com',
      password: 'hashedpassword',
      name: 'Test User',
      role: UserRole.USER
    });
    await userRepository.save(user);
    userId = user.id;

    // Create test contract
    const contractRepository = AppDataSource.getRepository(Contract);
    const contract = contractRepository.create({
      title: 'Test Contract',
      parties: ['Party A', 'Party B'],
      object: 'Test object',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      amount: 1000,
      type: ContractType.SERVICE,
      createdBy: user,
      status: ContractStatus.ACTIVE
    });
    await contractRepository.save(contract);
    contractId = contract.id;

    // Mock JWT token
    token = 'mock-jwt-token';
  });

  afterAll(async () => {
    const contractRepository = AppDataSource.getRepository(Contract);
    const userRepository = AppDataSource.getRepository(User);
    
    await contractRepository.delete({});
    await userRepository.delete({});
    
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
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