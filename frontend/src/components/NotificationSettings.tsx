import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';

interface NotificationPreferences {
  expirationWarningDays: number;
  enableBrowserNotifications: boolean;
  enableEmailNotifications: boolean;
}

const NotificationSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    expirationWarningDays: 30,
    enableBrowserNotifications: true,
    enableEmailNotifications: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await notificationAPI.getPreferences();
      setPreferences(response.data);
    } catch (error) {
      console.error('Failed to fetch preferences', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async () => {
    setSaving(true);
    try {
      await notificationAPI.updatePreferences(preferences);
      alert('Preferences updated successfully');
    } catch (error) {
      console.error('Failed to update preferences', error);
      alert('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Register service worker for push notifications
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered');

            // Get VAPID key and subscribe
            const vapidResponse = await notificationAPI.getVapidKey();
            const vapidKey = vapidResponse.data.publicKey;

            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidKey)
            });

            await notificationAPI.subscribe(subscription);
            alert('Push notifications enabled');
          } catch (error) {
            console.error('Service Worker registration failed', error);
          }
        }
      } else {
        alert('Notification permission denied');
      }
    } else {
      alert('This browser does not support notifications');
    }
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (loading) return <div className="p-4">Loading settings...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Notification Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Days before expiration to warn:
          </label>
          <input
            type="number"
            min="1"
            max="365"
            value={preferences.expirationWarningDays}
            onChange={(e) => setPreferences({
              ...preferences,
              expirationWarningDays: parseInt(e.target.value) || 30
            })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.enableBrowserNotifications}
              onChange={(e) => setPreferences({
                ...preferences,
                enableBrowserNotifications: e.target.checked
              })}
              className="mr-2"
            />
            Enable browser notifications
          </label>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.enableEmailNotifications}
              onChange={(e) => setPreferences({
                ...preferences,
                enableEmailNotifications: e.target.checked
              })}
              className="mr-2"
            />
            Enable email notifications (future feature)
          </label>
        </div>

        <div className="pt-4">
          <button
            onClick={requestNotificationPermission}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-4"
          >
            Enable Push Notifications
          </button>

          <button
            onClick={updatePreferences}
            disabled={saving}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;