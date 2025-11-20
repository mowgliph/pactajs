import { Request, Response } from 'express';
import { AppDataSource } from '../data-source.js';
import { Notification, NotificationType } from '../entities/Notification.js';
import { User } from '../entities/User.js';
import jwt from 'jsonwebtoken';
import { sendPushNotification, addPushSubscription, removePushSubscription, getVapidPublicKey } from '../services/webPush.js';

interface AuthRequest extends Request {
  user?: { id: string };
}

// Middleware to verify JWT
export const authenticate = (req: AuthRequest, res: Response, next: Function) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

// Get all notifications for the user
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const { read, limit = 50, skip = 0 } = req.query;
    const notificationRepository = AppDataSource.getRepository(Notification);
    
    const query: any = { userId: req.user?.id };
    if (read !== undefined) query.read = read === 'true';
    
    const notifications = await notificationRepository.find({
      where: query,
      relations: ['contract'],
      order: { createdAt: 'DESC' },
      take: Number(limit),
      skip: Number(skip)
    });
    
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Error fetching notifications');
  }
};

// Get a single notification
export const getNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notificationRepository = AppDataSource.getRepository(Notification);
    const notification = await notificationRepository.findOne({
      where: {
        id: req.params.id,
        userId: req.user?.id
      },
      relations: ['contract']
    });
    
    if (!notification) return res.status(404).send('Notification not found');
    res.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).send('Error fetching notification');
  }
};

// Mark notification as read/unread
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { read } = req.body;
    const notificationRepository = AppDataSource.getRepository(Notification);
    
    const notification = await notificationRepository.findOne({
      where: { id: req.params.id, userId: req.user?.id }
    });
    
    if (!notification) return res.status(404).send('Notification not found');
    
    notification.read = read;
    await notificationRepository.save(notification);
    
    res.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(400).send('Error updating notification');
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const notificationRepository = AppDataSource.getRepository(Notification);
    
    await notificationRepository.update(
      { userId: req.user?.id, read: false },
      { read: true }
    );
    
    res.send('All notifications marked as read');
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).send('Error updating notifications');
  }
};

// Create a notification (internal use, not exposed via API)
export const createNotification = async (
  userId: string,
  contractId: string,
  type: string,
  title: string,
  message: string
) => {
  try {
    const notificationRepository = AppDataSource.getRepository(Notification);
    const userRepository = AppDataSource.getRepository(User);
    
    // Map string type to enum if possible, or default to OTHER
    let notificationType = NotificationType.OTHER;
    if (Object.values(NotificationType).includes(type as NotificationType)) {
      notificationType = type as NotificationType;
    }

    const notification = notificationRepository.create({
      userId,
      contractId,
      type: notificationType,
      title,
      message
    });
    
    await notificationRepository.save(notification);

    // Send push notification if user has browser notifications enabled
    const user = await userRepository.findOne({ where: { id: userId } });
    if (user?.enableBrowserNotifications) {
      await sendPushNotification(userId, {
        title,
        body: message,
        data: { contractId, notificationId: notification.id }
      });
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notificationRepository = AppDataSource.getRepository(Notification);
    const result = await notificationRepository.delete({
      id: req.params.id,
      userId: req.user?.id
    });
    
    if (result.affected === 0) return res.status(404).send('Notification not found');
    res.send('Notification deleted');
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).send('Error deleting notification');
  }
};

// Get notification preferences
export const getNotificationPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.user?.id } });
    
    if (!user) return res.status(404).send('User not found');

    res.json({
      expirationWarningDays: user.expirationWarningDays,
      enableBrowserNotifications: user.enableBrowserNotifications,
      enableEmailNotifications: user.enableEmailNotifications
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).send('Error fetching preferences');
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const { expirationWarningDays, enableBrowserNotifications, enableEmailNotifications } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    
    const user = await userRepository.findOne({ where: { id: req.user?.id } });
    if (!user) return res.status(404).send('User not found');
    
    if (expirationWarningDays !== undefined) user.expirationWarningDays = expirationWarningDays;
    if (enableBrowserNotifications !== undefined) user.enableBrowserNotifications = enableBrowserNotifications;
    if (enableEmailNotifications !== undefined) user.enableEmailNotifications = enableEmailNotifications;
    
    await userRepository.save(user);
    
    res.json({
      expirationWarningDays: user.expirationWarningDays,
      enableBrowserNotifications: user.enableBrowserNotifications,
      enableEmailNotifications: user.enableEmailNotifications
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(400).send('Error updating preferences');
  }
};

// Subscribe to push notifications
export const subscribeToPush = async (req: AuthRequest, res: Response) => {
  try {
    const { subscription } = req.body;
    await addPushSubscription(req.user?.id!, subscription);
    res.send('Subscription added');
  } catch (error) {
    console.error('Error adding subscription:', error);
    res.status(400).send('Error adding subscription');
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async (req: AuthRequest, res: Response) => {
  try {
    const { endpoint } = req.body;
    await removePushSubscription(req.user?.id!, endpoint);
    res.send('Subscription removed');
  } catch (error) {
    console.error('Error removing subscription:', error);
    res.status(400).send('Error removing subscription');
  }
};

// Get VAPID public key
export const getVapidKey = async (req: AuthRequest, res: Response) => {
  res.json({ publicKey: getVapidPublicKey() });
};