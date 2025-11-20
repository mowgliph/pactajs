import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Contract } from '../entities/Contract';

interface AuthRequest extends Request {
  user?: any;
}

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const contractRepository = AppDataSource.getRepository(Contract);
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    // Base query builder to reuse
    const createBaseQuery = () => {
      const qb = contractRepository.createQueryBuilder('contract');
      if (!isAdmin) {
        qb.where('contract.createdById = :userId', { userId });
      }
      return qb;
    };

    // Total contracts
    const totalContracts = await createBaseQuery().getCount();

    // Contracts by status
    const statusCounts = await createBaseQuery()
      .select('contract.status', '_id')
      .addSelect('COUNT(contract.id)', 'count')
      .groupBy('contract.status')
      .getRawMany();

    // Contracts by type
    const typeCounts = await createBaseQuery()
      .select('contract.type', '_id')
      .addSelect('COUNT(contract.id)', 'count')
      .groupBy('contract.type')
      .getRawMany();

    // Upcoming expirations (next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const upcomingExpirations = await createBaseQuery()
      .andWhere('contract.endDate >= :now', { now })
      .andWhere('contract.endDate <= :thirtyDaysFromNow', { thirtyDaysFromNow })
      .orderBy('contract.endDate', 'ASC')
      .limit(10)
      .getMany();

    // Recent activities (last 10 history entries)
    // We need to join with history table
    const recentActivities = await createBaseQuery()
      .leftJoinAndSelect('contract.history', 'history')
      .select([
        'contract.title',
        'history.action',
        'history.details',
        'history.date'
      ])
      .where('history.id IS NOT NULL') // Ensure there is history
      .orderBy('history.date', 'DESC')
      .limit(10)
      .getRawMany()
      .then((results: any[]) => results.map((r: any) => ({
        title: r.contract_title,
        action: r.history_action,
        details: r.history_details,
        date: r.history_date
      })));

    // Average contract amount
    const avgAmountResult = await createBaseQuery()
      .select('AVG(contract.amount)', 'avgAmount')
      .getRawOne();
    const avgAmount = avgAmountResult ? parseFloat(avgAmountResult.avgAmount) : 0;

    // Contracts created per month (last 12 months)
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
    
    // Note: Date extraction functions are database specific. 
    // Assuming MariaDB/MySQL: YEAR() and MONTH()
    const contractsPerMonth = await createBaseQuery()
      .select('YEAR(contract.createdAt)', 'year')
      .addSelect('MONTH(contract.createdAt)', 'month')
      .addSelect('COUNT(contract.id)', 'count')
      .where('contract.createdAt >= :twelveMonthsAgo', { twelveMonthsAgo })
      .groupBy('year, month')
      .orderBy('year', 'ASC')
      .addOrderBy('month', 'ASC')
      .getRawMany()
      .then((results: any[]) => results.map((r: any) => ({
        _id: { year: r.year, month: r.month },
        count: parseInt(r.count)
      })));

    // Distribution by parties
    // Since parties is a JSON array, this is tricky in SQL without specific JSON functions.
    // Let's fetch all parties and aggregate in memory for simplicity and compatibility.
    
    const allParties = await createBaseQuery()
      .select('contract.parties')
      .getMany();

    const partyCounts: Record<string, number> = {};
    allParties.forEach((c: Contract) => {
      if (Array.isArray(c.parties)) {
        c.parties.forEach((p: string) => {
          partyCounts[p] = (partyCounts[p] || 0) + 1;
        });
      }
    });

    const partiesDistribution = Object.entries(partyCounts)
      .map(([party, count]) => ({ _id: party, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

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
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
};