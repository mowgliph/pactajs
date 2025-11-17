import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import contractRoutes from './routes/contracts.js';
import dashboardRoutes from './routes/dashboard.js';
import notificationRoutes from './routes/notifications.js';
import supplementRoutes from './routes/supplements.js';
import { startScheduler } from './scheduler.js';
import { apiLimiter, authLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
app.use('/auth', authLimiter);
app.use('/api', apiLimiter); // Assuming routes are under /api, but adjust as needed

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pacta';

mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
  startScheduler(); // Start the notification scheduler
}).catch(err => console.error(err));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/contracts', contractRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/notifications', notificationRoutes);
app.use('/supplements', supplementRoutes);

app.get('/', (req, res) => res.send('PACTA Backend'));

// Global error handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;