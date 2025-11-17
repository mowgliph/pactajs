import express from 'express';
import {
  authenticate,
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  subscribeToPush,
  unsubscribeFromPush,
  getVapidKey
} from '../controllers/notifications.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getNotifications);
router.get('/preferences', getNotificationPreferences);
router.put('/preferences', updateNotificationPreferences);
router.post('/subscribe', subscribeToPush);
router.post('/unsubscribe', unsubscribeFromPush);
router.get('/vapid-key', getVapidKey);
router.get('/:id', getNotification);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);
router.post('/mark-all-read', markAllAsRead);

export default router;