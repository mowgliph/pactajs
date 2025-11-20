import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { createNotification } from '../controllers/notifications';
import { checkExpiringContracts, runManualCheck } from '../scheduler';
import { AppDataSource } from '../data-source';
import { Notification, NotificationType } from '../entities/Notification';
import { User } from '../entities/User';
import { Contract, ContractStatus } from '../entities/Contract';

// Mock AppDataSource
jest.mock('../data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('Notification Controller', () => {
  let mockNotificationRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNotificationRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockNotificationRepository);
  });

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const mockNotification = {
        id: 'notification1',
        userId: 'user1',
        contractId: 'contract1',
        type: NotificationType.EXPIRATION_WARNING,
        title: 'Contract Expiring Soon',
        message: 'Your contract is expiring in 30 days',
        read: false,
      };

      mockNotificationRepository.create.mockReturnValue(mockNotification);
      mockNotificationRepository.save.mockResolvedValue(mockNotification);

      const result = await createNotification(
        'user1',
        'contract1',
        NotificationType.EXPIRATION_WARNING,
        'Contract Expiring Soon',
        'Your contract is expiring in 30 days'
      );

      expect(mockNotificationRepository.create).toHaveBeenCalledWith({
        userId: 'user1',
        contractId: 'contract1',
        type: NotificationType.EXPIRATION_WARNING,
        title: 'Contract Expiring Soon',
        message: 'Your contract is expiring in 30 days',
      });
      expect(mockNotificationRepository.save).toHaveBeenCalledWith(mockNotification);
      expect(result).toEqual(mockNotification);
    });

    it('should handle creation errors', async () => {
      mockNotificationRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(createNotification(
        'user1',
        'contract1',
        NotificationType.EXPIRATION_WARNING,
        'Title',
        'Message'
      )).rejects.toThrow('Database error');
    });
  });
});

describe('Notification Scheduler', () => {
  let mockUserRepository: any;
  let mockContractRepository: any;
  let mockNotificationRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepository = {
      find: jest.fn(),
    };
    mockContractRepository = {
      find: jest.fn(),
      save: jest.fn(),
    };
    mockNotificationRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === User) return mockUserRepository;
      if (entity === Contract) return mockContractRepository;
      if (entity === Notification) return mockNotificationRepository;
      return {};
    });
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
          id: 'user1',
          expirationWarningDays: 30,
          enableBrowserNotifications: true,
        },
      ];

      const mockContracts = [
        {
          id: 'contract1',
          createdById: 'user1',
          title: 'Test Contract',
          endDate: new Date('2023-01-15T00:00:00.000Z'), // 14 days from now
          status: ContractStatus.ACTIVE,
        },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);
      mockContractRepository.find.mockResolvedValue(mockContracts);
      mockNotificationRepository.findOne.mockResolvedValue(null);
      mockNotificationRepository.create.mockReturnValue({});
      mockNotificationRepository.save.mockResolvedValue({});

      await checkExpiringContracts();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(mockContractRepository.find).toHaveBeenCalled();
      expect(mockNotificationRepository.save).toHaveBeenCalled();
    });

    it('should not create duplicate notifications', async () => {
      jest.useFakeTimers();
      const mockDate = new Date('2023-01-01T00:00:00.000Z');
      jest.setSystemTime(mockDate);

      const mockUsers = [
        {
          id: 'user1',
          expirationWarningDays: 30,
        },
      ];

      const mockContracts = [
        {
          id: 'contract1',
          createdById: 'user1',
          title: 'Test Contract',
          endDate: new Date('2023-01-15T00:00:00.000Z'),
          status: ContractStatus.ACTIVE,
        },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);
      mockContractRepository.find.mockResolvedValue(mockContracts);
      mockNotificationRepository.findOne.mockResolvedValue({
        id: 'existing_notification',
      });

      await checkExpiringContracts();

      expect(mockNotificationRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('runManualCheck', () => {
    it('should run manual check for expiring contracts and expired contracts', async () => {
      const mockContracts = [
        {
          id: 'contract1',
          endDate: new Date('2022-01-01'),
          status: ContractStatus.ACTIVE
        }
      ];

      mockContractRepository.find.mockResolvedValue(mockContracts);
      mockUserRepository.find.mockResolvedValue([]);

      await runManualCheck();

      expect(mockContractRepository.find).toHaveBeenCalled();
      expect(mockContractRepository.save).toHaveBeenCalled();
    });
  });
});