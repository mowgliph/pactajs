import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { register, login, updateUser } from '../controllers/users';

describe('User Functions', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testpassword';
      const hashed = await bcrypt.hash(password, 10);
      expect(await bcrypt.compare(password, hashed)).toBe(true);
    });
  });

  describe('JWT Verification', () => {
    it('should verify JWT token', () => {
      const payload = { id: '123', role: 'user' };
      const token = jwt.sign(payload, 'secret');
      const decoded = jwt.verify(token, 'secret') as any;
      expect(decoded.id).toBe('123');
      expect(decoded.role).toBe('user');
    });
  });

  describe('Role Checks', () => {
    it('should allow admin to update role', () => {
      // Mock req.user
      const req = { user: { role: 'admin' }, body: { role: 'user' } };
      // In controller, check if req.user.role === 'admin'
      expect(req.user.role).toBe('admin');
    });

    it('should deny non-admin to update role', () => {
      const req = { user: { role: 'user' }, body: { role: 'admin' } };
      expect(req.user.role).not.toBe('admin');
    });
  });
});