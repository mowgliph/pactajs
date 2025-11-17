import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import Notification from '../models/Notification.js';
import { createNotification, checkExpiringContracts } from '../controllers/notifications.js';
import { runManualCheck } from '../scheduler.js';

// Mock the Notification model
jest.mock('../models/Notification.js', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    updateMany: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  },
}));

// Mock the Contract model
jest.mock('../models/Contract.js', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    updateMany: jest.fn(),
  },
}));

// Mock the User model
jest.mock('../models/User.js', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}));

describe('Notification Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const mockNotification = {
        _id: 'notification1',
        userId: 'user1',
        contractId: 'contract1',
        type: 'expiration_warning',
        title: 'Contract Expiring Soon',
        message: 'Your contract is expiring in 30 days',
        read: false,
        save: jest.fn().mockResolvedValue({
          _id: 'notification1',
          userId: 'user1',
          contractId: 'contract1',
          type: 'expiration_warning',
          title: 'Contract Expiring Soon',
          message: 'Your contract is expiring in 30 days',
          read: false,
        }),
      };

      (Notification as any).create = jest.fn().mockResolvedValue(mockNotification);

      const result = await createNotification(
        'user1',
        'contract1',
        'expiration_warning',
        'Contract Expiring Soon',
        'Your contract is expiring in 30 days'
      );

      expect(Notification.create).toHaveBeenCalledWith({
        userId: 'user1',
        contractId: 'contract1',
        type: 'expiration_warning',
        title: 'Contract Expiring Soon',
        message: 'Your contract is expiring in 30 days',
      });
      expect(result).toEqual(mockNotification);
    });

    it('should handle creation errors', async () => {
      (Notification as any).create = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(createNotification(
        'user1',
        'contract1',
        'expiration_warning',
        'Title',
        'Message'
      )).rejects.toThrow('Database error');
    });
  });
});

describe('Notification Scheduler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('checkExpiringContracts', () => {
    it('should check for expiring contracts and create notifications', async () => {
      jest.useFakeTimers();
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      jest.setSystemTime(mockDate);

      const mockUsers = [
        {
          _id: 'user1',
          notificationPreferences: {
            expirationWarningDays: 30,
            enableBrowserNotifications: true,
          },
        },
      ];

      const mockContracts = [
        {
          _id: 'contract1',
          createdBy: 'user1',
          title: 'Test Contract',
          endDate: new Date('2023-01-15T00:00:00.000Z'), // 14 days from now
          status: 'active',
        },
      ];

      // Mock User.find
      const User = require('../models/User.js').default;
      User.find = jest.fn().mockResolvedValue(mockUsers);

      // Mock Contract.find
      const Contract = require('../models/Contract.js').default;
      Contract.find = jest.fn().mockResolvedValue(mockContracts);

      // Mock Notification.findOne to return null (no existing notification)
      Notification.findOne = jest.fn().mockResolvedValue(null);

      // Mock createNotification
      const { createNotification } = require('../controllers/notifications.js');
      createNotification.mockResolvedValue({});

      await checkExpiringContracts();

      expect(User.find).toHaveBeenCalled();
      expect(Contract.find).toHaveBeenCalledWith({
        createdBy: 'user1',
        endDate: {
          $gte: mockDate,
          $lte: new Date('2023-01-31T00:00:00.000Z'), // 30 days from now
        },
        status: { $ne: 'expired' },
      });
      expect(createNotification).toHaveBeenCalledWith(
        'user1',
        'contract1',
        'expiration_warning',
        'Contract Expires in 14 Days',
        expect.stringContaining('Test Contract')
      );
    });

    it('should not create duplicate notifications', async () => {
      jest.useFakeTimers();
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      jest.setSystemTime(mockDate);

      const mockUsers = [
        {
          _id: 'user1',
          notificationPreferences: { expirationWarningDays: 30 },
        },
      ];

      const mockContracts = [
        {
          _id: 'contract1',
          createdBy: 'user1',
          title: 'Test Contract',
          endDate: new Date('2023-01-15T00:00:00.000Z'),
          status: 'active',
        },
      ];

      // Mock models
      const User = require('../models/User.js').default;
      User.find = jest.fn().mockResolvedValue(mockUsers);

      const Contract = require('../models/Contract.js').default;
      Contract.find = jest.fn().mockResolvedValue(mockContracts);

      // Mock existing notification
      Notification.findOne = jest.fn().mockResolvedValue({
        _id: 'existing_notification',
      });

      const { createNotification } = require('../controllers/notifications.js');
      createNotification.mockResolvedValue({});

      await checkExpiringContracts();

      expect(createNotification).not.toHaveBeenCalled();
    });
  });

  describe('runManualCheck', () => {
    it('should run manual check for expiring contracts and expired contracts', async () => {
      const { checkExpiringContracts } = require('../scheduler.js');
      checkExpiringContracts.mockResolvedValue(undefined);

      const Contract = require('../models/Contract.js').default;
      Contract.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 1 });

      await runManualCheck();

      expect(checkExpiringContracts).toHaveBeenCalled();
      expect(Contract.updateMany).toHaveBeenCalledWith(
        {
          endDate: { $lt: expect.any(Date) },
          status: { $ne: 'expired' }
        },
        { status: 'expired' }
      );
    });
  });
});