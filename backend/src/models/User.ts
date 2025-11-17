import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  pushSubscriptions: Array<{
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }>;
  notificationPreferences: {
    expirationWarningDays: number;
    enableBrowserNotifications: boolean;
    enableEmailNotifications: boolean;
  };
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  pushSubscriptions: [{
    endpoint: { type: String, required: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true }
    }
  }],
  notificationPreferences: {
    expirationWarningDays: { type: Number, default: 30 },
    enableBrowserNotifications: { type: Boolean, default: true },
    enableEmailNotifications: { type: Boolean, default: false }
  }
});

export default mongoose.model<IUser>('User', userSchema);