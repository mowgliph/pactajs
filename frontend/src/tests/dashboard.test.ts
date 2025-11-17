import { dashboardAPI } from '../services/api';

// Mock axios
jest.mock('axios');
import axios from 'axios';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Dashboard API', () => {
  it('should fetch dashboard data', async () => {
    const mockData = {
      totalContracts: 10,
      statusCounts: [{ _id: 'active', count: 7 }],
      typeCounts: [{ _id: 'service', count: 5 }],
      upcomingExpirations: [],
      recentActivities: [],
      avgAmount: 1000,
      contractsPerMonth: [],
      partiesDistribution: []
    };

    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await dashboardAPI.getDashboardData();
    expect(result.data).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/dashboard');
  });
});