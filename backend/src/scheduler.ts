import cron from 'node-cron';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { AppDataSource } from './data-source';
import { Contract, ContractStatus } from './entities/Contract';
import { User } from './entities/User';
import { Notification, NotificationType } from './entities/Notification';
import { createNotification } from './controllers/notifications';
import { LessThan, Between, Not, MoreThanOrEqual } from 'typeorm';

// Function to check for expiring contracts and create notifications
export const checkExpiringContracts = async () => {
  try {
    console.log('Checking for expiring contracts...');

    const now = new Date();
    const userRepository = AppDataSource.getRepository(User);
    const contractRepository = AppDataSource.getRepository(Contract);
    const notificationRepository = AppDataSource.getRepository(Notification);

    // Get all users
    const users = await userRepository.find();

    for (const user of users) {
      const warningDays = user.expirationWarningDays || 30;
      const warningDate = new Date(now.getTime() + warningDays * 24 * 60 * 60 * 1000);

      // Find contracts for this user expiring within their warning period
      const expiringContracts = await contractRepository.find({
        where: {
          createdById: user.id,
          endDate: Between(now, warningDate),
          status: Not(ContractStatus.EXPIRED)
        }
      });

      for (const contract of expiringContracts) {
        const daysUntilExpiry = Math.ceil((contract.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        const notificationType = daysUntilExpiry <= 1 ? NotificationType.EXPIRATION_DUE : NotificationType.EXPIRATION_WARNING;

        // Check if notification already exists for this contract and user
        const existingNotification = await notificationRepository.findOne({
          where: {
            userId: user.id,
            contractId: contract.id,
            type: notificationType,
            createdAt: MoreThanOrEqual(new Date(now.getTime() - 24 * 60 * 60 * 1000)) // Within last 24 hours
          }
        });

        if (!existingNotification) {
          const title = notificationType === NotificationType.EXPIRATION_DUE ? 'Contract Expires Today' : `Contract Expires in ${daysUntilExpiry} Days`;
          const message = `Contract "${contract.title}" is expiring on ${contract.endDate.toLocaleDateString()}. Please review and take necessary action.`;

          await createNotification(
            user.id,
            contract.id,
            notificationType,
            title,
            message
          );

          console.log(`Notification created for user ${user.email}, contract: ${contract.title}`);
        }
      }
    }

    console.log('Finished checking expiring contracts');
  } catch (error) {
    console.error('Error checking expiring contracts:', error);
  }
};

// Function to mark expired contracts
const markExpiredContracts = async () => {
  try {
    console.log('Marking expired contracts...');

    const now = new Date();
    const contractRepository = AppDataSource.getRepository(Contract);
    
    const expiredContracts = await contractRepository.find({
      where: {
        endDate: LessThan(now),
        status: Not(ContractStatus.EXPIRED)
      }
    });

    if (expiredContracts.length > 0) {
      for (const contract of expiredContracts) {
        contract.status = ContractStatus.EXPIRED;
        await contractRepository.save(contract);
      }
      console.log(`Marked ${expiredContracts.length} contracts as expired`);
    }
  } catch (error) {
    console.error('Error marking expired contracts:', error);
  }
};

// Function to backup the repository
const backupRepository = async () => {
  try {
    console.log('Starting repository backup...');

    const uploadsDir = path.join(process.cwd(), 'uploads');
    const backupsDir = path.join(process.cwd(), 'backups');

    // Ensure backups directory exists
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.log('No uploads directory to backup');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupsDir, `repository-backup-${timestamp}.zip`);

    const output = fs.createWriteStream(backupFile);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Repository backup completed: ${archive.pointer()} bytes written to ${backupFile}`);
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(uploadsDir, 'uploads');
    await archive.finalize();

    // Optionally, create a notification for admins
    // For now, just log
  } catch (error) {
    console.error('Error backing up repository:', error);
  }
};

// Schedule tasks
export const startScheduler = () => {
  // Check for expiring contracts every hour
  cron.schedule('0 * * * *', () => {
    checkExpiringContracts();
  });

  // Mark expired contracts daily at midnight
  cron.schedule('0 0 * * *', () => {
    markExpiredContracts();
  });

  // Backup repository daily at 2 AM
  cron.schedule('0 2 * * *', () => {
    backupRepository();
  });

  console.log('Scheduler started: checking contracts hourly, marking expired daily, and backing up repository daily');
};

// For manual testing
export const runManualCheck = async () => {
  await checkExpiringContracts();
  await markExpiredContracts();
  await backupRepository();
};