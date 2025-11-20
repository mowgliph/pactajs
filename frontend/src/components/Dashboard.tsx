import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { dashboardAPI, notificationAPI } from '../services/api';
import { cacheDashboardData, getCachedDashboardData } from '../db/indexedDB';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface DashboardData {
  totalContracts: number;
  statusCounts: { id: string; count: number }[];
  typeCounts: { id: string; count: number }[];
  upcomingExpirations: any[];
  recentActivities: any[];
  avgAmount: number;
  contractsPerMonth: any[];
  partiesDistribution: { id: string; count: number }[];
}

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  contractId: {
    id: number;
    title: string;
    endDate: string;
  };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardAPI.getDashboardData();
        setData(response.data);
        await cacheDashboardData(response.data);
        setOffline(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        const cached = await getCachedDashboardData();
        if (cached) {
          setData(cached);
          setOffline(true);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await notificationAPI.getNotifications({ limit: 5 });
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchData();
    fetchNotifications();

    const handleOnline = () => {
      setOffline(false);
      fetchData(); // Refetch on reconnect
    };
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!data) return <div className="p-4">No data available</div>;

  const statusPieData = {
    labels: data.statusCounts.map(s => s.id),
    datasets: [{
      data: data.statusCounts.map(s => s.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }],
  };

  const typeBarData = {
    labels: data.typeCounts.map(t => t.id),
    datasets: [{
      label: 'Contracts by Type',
      data: data.typeCounts.map(t => t.count),
      backgroundColor: '#36A2EB',
    }],
  };

  const monthLabels = data.contractsPerMonth.map(m => `${m.id.year}-${m.id.month}`);
  const monthBarData = {
    labels: monthLabels,
    datasets: [{
      label: 'Contracts Created',
      data: data.contractsPerMonth.map(m => m.count),
      backgroundColor: '#FF6384',
    }],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {offline && <div className="bg-yellow-200 p-2 mb-4">Offline mode - showing cached data</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Contracts</h2>
          <p className="text-2xl">{data.totalContracts}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Average Amount</h2>
          <p className="text-2xl">${data.avgAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Active Contracts</h2>
          <p className="text-2xl">{data.statusCounts.find(s => s.id === 'active')?.count || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Upcoming Expirations</h2>
          <p className="text-2xl">{data.upcomingExpirations.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Contract Status Distribution</h2>
          <Pie data={statusPieData} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Contracts by Type</h2>
          <Bar data={typeBarData} />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Contracts Created Over Time</h2>
        <Bar data={monthBarData} />
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No recent notifications</p>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 3).map(notification => (
              <div
                key={notification.id}
                className={`p-3 border rounded ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
              >
                <h3 className="font-semibold text-sm">{notification.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Upcoming Expirations</h2>
          <ul>
            {data.upcomingExpirations.slice(0, 5).map((exp, idx) => (
              <li key={idx} className="mb-2">
                <strong>{exp.title}</strong> - Expires: {new Date(exp.endDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <ul>
            {data.recentActivities.slice(0, 5).map((act, idx) => (
              <li key={idx} className="mb-2">
                <strong>{act.title}</strong>: {act.action} - {new Date(act.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;