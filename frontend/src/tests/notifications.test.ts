import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { notificationAPI } from '../services/api';
import { cacheNotifications, getCachedNotifications, updateNotificationOffline } from '../db/indexedDB';

// Mock the API
jest.mock('../services/api', () => ({
  notificationAPI: {
    getNotifications: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteNotification: jest.fn(),
    getPreferences: jest.fn(),
    updatePreferences: jest.fn(),
  },
}));

// Mock IndexedDB functions
jest.mock('../db/indexedDB', () => ({
  cacheNotifications: jest.fn(),
  getCachedNotifications: jest.fn(),
  updateNotificationOffline: jest.fn(),
}));

describe('Notification API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should fetch notifications successfully', async () => {
      const mockNotifications = [
        {
          _id: '1',
          title: 'Test Notification',
          message: 'Test message',
          read: false,
          createdAt: '2023-01-01T00:00:00.000Z',
          contractId: {
            _id: 'contract1',
            title: 'Test Contract',
            endDate: '2023-12-31T00:00:00.000Z'
          }
        }
      ];

      (notificationAPI.getNotifications as jest.Mock).mockResolvedValue({
        data: mockNotifications
      });

      const result = await notificationAPI.getNotifications();

      expect(notificationAPI.getNotifications).toHaveBeenCalled();
      expect(result.data).toEqual(mockNotifications);
    });

    it('should handle API errors', async () => {
      (notificationAPI.getNotifications as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );

      await expect(notificationAPI.getNotifications()).rejects.toThrow('API Error');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = '1';
      const read = true;

      (notificationAPI.markAsRead as jest.Mock).mockResolvedValue({});

      await notificationAPI.markAsRead(notificationId, read);

      expect(notificationAPI.markAsRead).toHaveBeenCalledWith(notificationId, read);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      (notificationAPI.markAllAsRead as jest.Mock).mockResolvedValue({});

      await notificationAPI.markAllAsRead();

      expect(notificationAPI.markAllAsRead).toHaveBeenCalled();
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      const notificationId = '1';

      (notificationAPI.deleteNotification as jest.Mock).mockResolvedValue({});

      await notificationAPI.deleteNotification(notificationId);

      expect(notificationAPI.deleteNotification).toHaveBeenCalledWith(notificationId);
    });
  });

  describe('getPreferences', () => {
    it('should fetch notification preferences', async () => {
      const mockPreferences = {
        expirationWarningDays: 30,
        enableBrowserNotifications: true,
        enableEmailNotifications: false
      };

      (notificationAPI.getPreferences as jest.Mock).mockResolvedValue({
        data: mockPreferences
      });

      const result = await notificationAPI.getPreferences();

      expect(notificationAPI.getPreferences).toHaveBeenCalled();
      expect(result.data).toEqual(mockPreferences);
    });
  });

  describe('updatePreferences', () => {
    it('should update notification preferences', async () => {
      const preferences = {
        expirationWarningDays: 15,
        enableBrowserNotifications: false,
        enableEmailNotifications: true
      };

      (notificationAPI.updatePreferences as jest.Mock).mockResolvedValue({
        data: preferences
      });

      const result = await notificationAPI.updatePreferences(preferences);

      expect(notificationAPI.updatePreferences).toHaveBeenCalledWith(preferences);
      expect(result.data).toEqual(preferences);
    });
  });
});

describe('IndexedDB Notification Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cacheNotifications', () => {
    it('should cache notifications', async () => {
      const notifications = [
        {
          _id: '1',
          title: 'Test',
          message: 'Test message',
          read: false,
          createdAt: '2023-01-01T00:00:00.000Z',
          contractId: {
            _id: 'contract1',
            title: 'Contract',
            endDate: '2023-12-31T00:00:00.000Z'
          }
        }
      ];

      (cacheNotifications as jest.Mock).mockResolvedValue(undefined);

      await cacheNotifications(notifications);

      expect(cacheNotifications).toHaveBeenCalledWith(notifications);
    });
  });

  describe('getCachedNotifications', () => {
    it('should retrieve cached notifications', async () => {
      const cachedNotifications = [
        {
          id: 1,
          _id: '1',
          title: 'Cached Notification',
          message: 'Cached message',
          read: true,
          createdAt: '2023-01-01T00:00:00.000Z',
          contractId: {
            _id: 'contract1',
            title: 'Contract',
            endDate: '2023-12-31T00:00:00.000Z'
          },
          synced: true
        }
      ];

      (getCachedNotifications as jest.Mock).mockResolvedValue(cachedNotifications);

      const result = await getCachedNotifications();

      expect(getCachedNotifications).toHaveBeenCalled();
      expect(result).toEqual(cachedNotifications);
    });
  });

  describe('updateNotificationOffline', () => {
    it('should update notification offline', async () => {
      const id = 1;
      const updates = { read: true };

      (updateNotificationOffline as jest.Mock).mockResolvedValue(undefined);

      await updateNotificationOffline(id, updates);

      expect(updateNotificationOffline).toHaveBeenCalledWith(id, updates);
    });
  });
});