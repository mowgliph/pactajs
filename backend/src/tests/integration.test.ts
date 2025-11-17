import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server'; // Assuming server exports the app
import User from '../models/User';
import Contract from '../models/Contract';

describe('Integration Tests', () => {
  let token: string;
  let userId: string;
  let contractId: string;

  beforeAll(async () => {
    // Connect to test DB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pacta-test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Contract.deleteMany({});

    // Create test user
    const user = new User({
      email: 'test@example.com',
      password: await require('bcryptjs').hash('password', 10),
      name: 'Test User',
      role: 'user'
    });
    await user.save();
    userId = user._id.toString();

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
    contractId = createRes.body._id;

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
    contractId = createRes.body._id;

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
    // Create admin user
    const admin = new User({
      email: 'admin@example.com',
      password: await require('bcryptjs').hash('password', 10),
      name: 'Admin User',
      role: 'admin'
    });
    await admin.save();

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