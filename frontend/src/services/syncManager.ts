import { syncContracts, syncSupplements, getQueuedUploads, removeQueuedUpload } from '../db/indexedDB';
import { contractAPI, repositoryAPI } from './api';

class SyncManager {
  private syncInProgress = false;

  async syncAll() {
    if (this.syncInProgress) return;
    this.syncInProgress = true;

    try {
      // Sync contracts and supplements
      await syncContracts();
      await syncSupplements();

      // Process queued uploads
      const queued = await getQueuedUploads();
      for (const item of queued) {
        try {
          await repositoryAPI.uploadDocument(item.contractId, item.file);
          await removeQueuedUpload(item.id!);
        } catch (error) {
          console.error('Failed to upload queued document', error);
        }
      }

      console.log('Sync completed');
    } catch (error) {
      console.error('Sync failed', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  async registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('background-sync');
    }
  }

  startPeriodicSync(intervalMs = 30000) { // 30 seconds
    setInterval(() => {
      if (navigator.onLine) {
        this.syncAll();
      }
    }, intervalMs);
  }

  listenForOnline() {
    window.addEventListener('online', () => {
      this.syncAll();
    });
  }
}

export const syncManager = new SyncManager();