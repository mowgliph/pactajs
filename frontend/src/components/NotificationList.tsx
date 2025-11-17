import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import { cacheNotifications, getCachedNotifications, updateNotificationOffline } from '../db/indexedDB';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  contractId: {
    _id: string;
    title: string;
    endDate: string;
  };
}

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    fetchNotifications();

    const handleOnline = () => {
      setOffline(false);
      fetchNotifications(); // Refetch on reconnect
    };
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data);
      await cacheNotifications(response.data);
      setOffline(false);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      const cached = await getCachedNotifications();
      if (cached && cached.length > 0) {
        setNotifications(cached);
        setOffline(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, read: boolean) => {
    try {
      await notificationAPI.markAsRead(id, read);
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, read } : n
      ));
    } catch (error) {
      console.error('Failed to update notification', error);
      // Update offline cache
      const notification = notifications.find(n => n._id === id);
      if (notification) {
        await updateNotificationOffline(notification.id!, { read });
        setNotifications(notifications.map(n =>
          n._id === id ? { ...n, read } : n
        ));
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationAPI.deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  if (loading) return <div className="p-4">Loading notifications...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-2">
          {notifications.map(notification => (
            <div
              key={notification._id}
              className={`p-4 border rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Contract: {notification.contractId.title} - Expires: {new Date(notification.contractId.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id, true)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;