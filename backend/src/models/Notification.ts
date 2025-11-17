import mongoose, { Document } from 'mongoose';

interface INotification extends Document {
  userId: mongoose.Types.ObjectId; // Recipient user
  contractId: mongoose.Types.ObjectId; // Related contract
  type: 'expiration_warning' | 'expiration_due' | 'contract_created' | 'contract_updated' | 'other';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  type: { type: String, enum: ['expiration_warning', 'expiration_due', 'contract_created', 'contract_updated', 'other'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', notificationSchema);