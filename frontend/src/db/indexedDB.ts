import Dexie, { Table } from 'dexie';

export interface Contract {
  id?: number;
  _id?: string; // MongoDB ID
  title: string;
  parties: string[];
  object: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'active' | 'expired' | 'terminated';
  type: 'service' | 'sales' | 'lease' | 'other';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  history: { date: string; action: string; details: string }[];
  supplements: {
    id: string;
    modifiedFields: { field: string; oldValue: any; newValue: any }[];
    effectiveDate: string;
    createdAt: string;
    reason: string;
  }[];
  synced?: boolean; // Flag for sync status
}

export interface DashboardData {
  id?: number;
  totalContracts: number;
  statusCounts: { _id: string; count: number }[];
  typeCounts: { _id: string; count: number }[];
  upcomingExpirations: any[];
  recentActivities: any[];
  avgAmount: number;
  contractsPerMonth: any[];
  partiesDistribution: { _id: string; count: number }[];
  cachedAt: string;
}

export interface Notification {
  id?: number;
  _id?: string; // MongoDB ID
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
  synced?: boolean; // Flag for sync status
}

export interface UserProfile {
  id?: number;
  _id: string;
  name: string;
  email: string;
  role: string;
  cachedAt: string;
}

export interface CachedDocument {
  id?: number;
  contractId: string;
  documentId: string;
  filename: string;
  blob: Blob;
  cachedAt: string;
}

export interface UploadQueue {
  id?: number;
  contractId: string;
  file: File;
  queuedAt: string;
}

export class PACTADatabase extends Dexie {
  contracts!: Table<Contract>;
  dashboard!: Table<DashboardData>;
  notifications!: Table<Notification>;
  userProfile!: Table<UserProfile>;
  cachedDocuments!: Table<CachedDocument>;
  uploadQueue!: Table<UploadQueue>;

  constructor() {
    super('PACTA_DB');
    this.version(6).stores({
      contracts: '++id, _id, title, status, type, synced',
      dashboard: '++id, cachedAt',
      notifications: '++id, _id, read, synced',
      userProfile: '++id, _id, cachedAt',
      cachedDocuments: '++id, contractId, documentId, cachedAt',
      uploadQueue: '++id, contractId, queuedAt'
    });
  }
}

export const db = new PACTADatabase();

// Sync functions
export const syncContracts = async () => {
  // Push unsynced changes to server
  const unsynced = await db.contracts.where('synced').equals(false).toArray();
  for (const contract of unsynced) {
    try {
      if (contract._id) {
        // Update existing
        await fetch(`http://localhost:5000/contracts/${contract._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(contract)
        });
      } else {
        // Create new
        const response = await fetch('http://localhost:5000/contracts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(contract)
        });
        const data = await response.json();
        contract._id = data._id;
      }
      contract.synced = true;
      await db.contracts.put(contract);
    } catch (error) {
      console.error('Sync failed for contract', contract);
    }
  }

  // Fetch latest from server and update IndexedDB
  try {
    const response = await fetch('http://localhost:5000/contracts', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const serverContracts = await response.json();
    for (const serverContract of serverContracts) {
      const local = await db.contracts.where('_id').equals(serverContract._id).first();
      if (!local || local.updatedAt < serverContract.updatedAt) {
        await db.contracts.put({ ...serverContract, synced: true });
      }
    }
  } catch (error) {
    console.error('Failed to fetch from server');
  }
};

// Sync supplements
export const syncSupplements = async () => {
  // For now, supplements are synced with contracts
  // In future, could have separate sync for pending supplements
};

export const addContractOffline = async (contract: Contract) => {
  contract.synced = false;
  await db.contracts.add(contract);
};

export const updateContractOffline = async (id: number, updates: Partial<Contract>) => {
  await db.contracts.update(id, { ...updates, synced: false });
};

export const getContractsOffline = async () => {
  return await db.contracts.toArray();
};

// Dashboard offline functions
export const cacheDashboardData = async (data: DashboardData) => {
  data.cachedAt = new Date().toISOString();
  await db.dashboard.clear(); // Keep only latest
  await db.dashboard.add(data);
};

export const getCachedDashboardData = async () => {
  const cached = await db.dashboard.orderBy('cachedAt').reverse().first();
  return cached;
};

// Notification offline functions
export const cacheNotifications = async (notifications: Notification[]) => {
  await db.notifications.clear(); // Keep only latest
  for (const notification of notifications) {
    await db.notifications.add({ ...notification, synced: true });
  }
};

export const getCachedNotifications = async (limit = 50) => {
  return await db.notifications.orderBy('createdAt').reverse().limit(limit).toArray();
};

export const addNotificationOffline = async (notification: Notification) => {
  notification.synced = false;
  await db.notifications.add(notification);
};

export const updateNotificationOffline = async (id: number, updates: Partial<Notification>) => {
  await db.notifications.update(id, { ...updates, synced: false });
};

export const getNotificationOffline = async (id: string) => {
  return await db.notifications.where('_id').equals(id).first();
};

// Supplement offline functions
export const addSupplementOffline = async (contractId: string, supplement: any) => {
  const contract = await db.contracts.where('_id').equals(contractId).first();
  if (contract) {
    contract.supplements = contract.supplements || [];
    contract.supplements.push(supplement);
    contract.synced = false;
    await db.contracts.put(contract);
  }
};

export const getSupplementsOffline = async (contractId: string) => {
  const contract = await db.contracts.where('_id').equals(contractId).first();
  return contract?.supplements || [];
};

// User profile offline functions
export const cacheUserProfile = async (profile: UserProfile) => {
  profile.cachedAt = new Date().toISOString();
  await db.userProfile.clear(); // Keep only latest
  await db.userProfile.add(profile);
};

export const getCachedUserProfile = async () => {
  const cached = await db.userProfile.orderBy('cachedAt').reverse().first();
  return cached;
};

// Document offline functions
export const cacheDocument = async (contractId: string, documentId: string, filename: string, blob: Blob) => {
  const cached: CachedDocument = {
    contractId,
    documentId,
    filename,
    blob,
    cachedAt: new Date().toISOString()
  };
  await db.cachedDocuments.put(cached);
};

export const getCachedDocument = async (contractId: string, documentId: string) => {
  return await db.cachedDocuments.where('[contractId+documentId]').equals([contractId, documentId]).first();
};

export const queueDocumentUpload = async (contractId: string, file: File) => {
  const queued: UploadQueue = {
    contractId,
    file,
    queuedAt: new Date().toISOString()
  };
  await db.uploadQueue.add(queued);
};

export const getQueuedUploads = async () => {
  return await db.uploadQueue.orderBy('queuedAt').toArray();
};

export const removeQueuedUpload = async (id: number) => {
  await db.uploadQueue.delete(id);
};