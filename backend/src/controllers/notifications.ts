import { Request, Response } from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
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
    const query: any = { userId: req.user?.id };
    if (read !== undefined) query.read = read === 'true';
    const notifications = await Notification.find(query)
      .populate('contractId', 'title endDate')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));
    res.json(notifications);
  } catch (error) {
    res.status(500).send('Error fetching notifications');
  }
};

// Get a single notification
export const getNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user?.id
    }).populate('contractId', 'title endDate');
    if (!notification) return res.status(404).send('Notification not found');
    res.json(notification);
  } catch (error) {
    res.status(500).send('Error fetching notification');
  }
};

// Mark notification as read/unread
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { read } = req.body;
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { read },
      { new: true }
    );
    if (!notification) return res.status(404).send('Notification not found');
    res.json(notification);
  } catch (error) {
    res.status(400).send('Error updating notification');
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { userId: req.user?.id, read: false },
      { read: true }
    );
    res.send('All notifications marked as read');
  } catch (error) {
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
    const notification = new Notification({
      userId,
      contractId,
      type,
      title,
      message
    });
    await notification.save();

    // Send push notification if user has browser notifications enabled
    const user = await User.findById(userId);
    if (user?.notificationPreferences?.enableBrowserNotifications) {
      await sendPushNotification(userId, {
        title,
        body: message,
        data: { contractId, notificationId: notification._id }
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
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id
    });
    if (!notification) return res.status(404).send('Notification not found');
    res.send('Notification deleted');
  } catch (error) {
    res.status(500).send('Error deleting notification');
  }
};

// Get notification preferences
export const getNotificationPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).send('User not found');

    res.json(user.notificationPreferences || {
      expirationWarningDays: 30,
      enableBrowserNotifications: true,
      enableEmailNotifications: false
    });
  } catch (error) {
    res.status(500).send('Error fetching preferences');
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const { expirationWarningDays, enableBrowserNotifications, enableEmailNotifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        notificationPreferences: {
          expirationWarningDays: expirationWarningDays || 30,
          enableBrowserNotifications: enableBrowserNotifications !== false,
          enableEmailNotifications: enableEmailNotifications || false
        }
      },
      { new: true }
    );
    if (!user) return res.status(404).send('User not found');
    res.json(user.notificationPreferences);
  } catch (error) {
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
    res.status(400).send('Error removing subscription');
  }
};

// Get VAPID public key
export const getVapidKey = async (req: AuthRequest, res: Response) => {
  res.json({ publicKey: getVapidPublicKey() });
};