import { Request, Response } from 'express';
import Contract from '../models/Contract';

interface AuthRequest extends Request {
  user?: any;
}

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const matchFilter = req.user?.role === 'admin' ? {} : { createdBy: req.user?.id };

    // Total contracts
    const totalContracts = await Contract.countDocuments(matchFilter);

    // Contracts by status
    const statusCounts = await Contract.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Contracts by type
    const typeCounts = await Contract.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Upcoming expirations (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingExpirations = await Contract.find({
      ...matchFilter,
      endDate: { $gte: now, $lte: thirtyDaysFromNow }
    }).sort({ endDate: 1 }).limit(10);

    // Recent activities (last 10 history entries)
    const recentActivities = await Contract.aggregate([
      { $match: matchFilter },
      { $unwind: '$history' },
      { $sort: { 'history.date': -1 } },
      { $limit: 10 },
      {
        $project: {
          title: 1,
          action: '$history.action',
          details: '$history.details',
          date: '$history.date'
        }
      }
    ]);

    // Average contract amount
    const avgAmountResult = await Contract.aggregate([
      { $match: matchFilter },
      { $group: { _id: null, avgAmount: { $avg: '$amount' } } }
    ]);
    const avgAmount = avgAmountResult.length > 0 ? avgAmountResult[0].avgAmount : 0;

    // Contracts created per month (last 12 months)
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
    const contractsPerMonth = await Contract.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo }, ...matchFilter } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Distribution by parties (count occurrences of each party)
    const partiesDistribution = await Contract.aggregate([
      { $match: matchFilter },
      { $unwind: '$parties' },
      { $group: { _id: '$parties', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 } // Top 10 parties
    ]);

    res.json({
      totalContracts,
      statusCounts,
      typeCounts,
      upcomingExpirations,
      recentActivities,
      avgAmount,
      contractsPerMonth,
      partiesDistribution
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
};