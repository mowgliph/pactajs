import mongoose, { Document } from 'mongoose';

interface IContract extends Document {
  title: string;
  parties: string[];
  object: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: 'active' | 'expired' | 'terminated';
  type: 'service' | 'sales' | 'lease' | 'other';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  history: { date: Date; action: string; details: string }[];
  supplements: {
    id: string;
    modifiedFields: { field: string; oldValue: any; newValue: any }[];
    effectiveDate: Date;
    createdAt: Date;
    reason: string;
  }[];
  documents: {
    id: string;
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
  }[];
}

const contractSchema = new mongoose.Schema<IContract>({
  title: { type: String, required: true },
  parties: [{ type: String, required: true }],
  object: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'expired', 'terminated'], default: 'active' },
  type: { type: String, enum: ['service', 'sales', 'lease', 'other'], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  history: [{
    date: { type: Date, default: Date.now },
    action: { type: String, required: true },
    details: { type: String, required: true }
  }],
  supplements: [{
    id: { type: String, required: true },
    modifiedFields: [{
      field: { type: String, required: true },
      oldValue: { type: mongoose.Schema.Types.Mixed },
      newValue: { type: mongoose.Schema.Types.Mixed, required: true }
    }],
    effectiveDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    reason: { type: String, required: true }
  }],
  documents: [{
    id: { type: String, required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IContract>('Contract', contractSchema);