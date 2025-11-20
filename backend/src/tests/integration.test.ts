import request from 'supertest';
import app from '../server';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { Contract } from '../entities/Contract';
import bcrypt from 'bcryptjs';

describe('Integration Tests', () => {
  let token: string;
  let userId: string;
  let contractId: string;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
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

  beforeEach(async () => {
    const contractRepository = AppDataSource.getRepository(Contract);
    const userRepository = AppDataSource.getRepository(User);

    // Clear collections
    await contractRepository.delete({});
    await userRepository.delete({});

    // Create test user
    const user = userRepository.create({
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
      name: 'Test User',
      role: UserRole.USER
    });
    await userRepository.save(user);
    userId = user.id;

    // Login to get token
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    token = res.body.token;
  });

  it('should create and retrieve a contract', async () => {
    const contractData = {
      title: 'Test Contract',
      parties: ['Party A', 'Party B'],
      object: 'Test Object',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      amount: 10000,
      type: 'service'
    };

    // Create contract
    const createRes = await request(app)
      .post('/contracts')
      .set('Authorization', `Bearer ${token}`)
      .send(contractData);
    expect(createRes.status).toBe(201);
    contractId = createRes.body.id;

    // Retrieve contract
    const getRes = await request(app)
      .get(`/contracts/${contractId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.title).toBe('Test Contract');
  });

  it('should create a supplement and trigger notification', async () => {
    // First create a contract
    const contractData = {
      title: 'Test Contract',
      parties: ['Party A', 'Party B'],
      object: 'Test Object',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      amount: 10000,
      type: 'service'
    };

    const createRes = await request(app)
      .post('/contracts')
      .set('Authorization', `Bearer ${token}`)
      .send(contractData);
    contractId = createRes.body.id;

    // Create supplement
    const supplementData = {
      modifiedFields: [{ field: 'amount', oldValue: 10000, newValue: 15000 }],
      effectiveDate: '2023-06-01',
      reason: 'Price increase'
    };

    const suppRes = await request(app)
      .post(`/supplements/${contractId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(supplementData);
    expect(suppRes.status).toBe(201);

    // Check if notification was created
    const notifRes = await request(app)
      .get('/notifications')
      .set('Authorization', `Bearer ${token}`);
    expect(notifRes.status).toBe(200);
    expect(notifRes.body.length).toBeGreaterThan(0);
  });

  it('should enforce role-based access', async () => {
    const userRepository = AppDataSource.getRepository(User);
    
    // Create admin user
    const admin = userRepository.create({
      email: 'admin@example.com',
      password: await bcrypt.hash('password', 10),
      name: 'Admin User',
      role: UserRole.ADMIN
    });
    await userRepository.save(admin);

    const adminLogin = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });
    const adminToken = adminLogin.body.token;

    // Admin can get all users
    const usersRes = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(usersRes.status).toBe(200);

    // Regular user cannot
    const userUsersRes = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(userUsersRes.status).toBe(403);
  });
});