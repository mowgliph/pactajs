import webpush from 'web-push';
import User from '../models/User.js';

// Configure VAPID keys (in production, these should be environment variables)
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'BDefaultPublicKeyForDevelopmentOnly',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'DefaultPrivateKeyForDevelopmentOnly'
};

webpush.setVapidDetails(
  'mailto:example@pacta.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Send push notification to a user
export const sendPushNotification = async (userId: string, notification: { title: string; body: string; icon?: string; data?: any }) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
      return; // No subscriptions to send to
    }

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || '/favicon.ico',
      data: notification.data || {}
    });

    // Send to all user's subscriptions
    const promises = user.pushSubscriptions.map(subscription =>
      webpush.sendNotification(subscription, payload).catch(error => {
        console.error('Error sending push notification:', error);
        // If subscription is invalid, remove it
        if (error.statusCode === 410) {
          removePushSubscription(userId, subscription.endpoint);
        }
      })
    );

    await Promise.all(promises);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

// Add a push subscription for a user
export const addPushSubscription = async (userId: string, subscription: { endpoint: string; keys: { p256dh: string; auth: string } }) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { pushSubscriptions: subscription }
    });
  } catch (error) {
    console.error('Error adding push subscription:', error);
    throw error;
  }
};

// Remove a push subscription for a user
export const removePushSubscription = async (userId: string, endpoint: string) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { pushSubscriptions: { endpoint } }
    });
  } catch (error) {
    console.error('Error removing push subscription:', error);
  }
};

// Get VAPID public key for client-side registration
export const getVapidPublicKey = () => {
  return vapidKeys.publicKey;
};