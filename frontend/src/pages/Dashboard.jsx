import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiTrendingDown, FiTool, FiClipboard, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { dashboardService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, chartsRes] = await Promise.all([
        dashboardService.getOverview(),
        dashboardService.getCharts(),
      ]);
      setOverview(overviewRes.data);
      setCharts(chartsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const stats = [
    {
      title: 'Total Requests',
      value: overview?.requests?.total || 0,
      icon: FiClipboard,
      color: 'bg-blue-500',
      link: '/requests',
    },
    {
      title: 'New',
      value: overview?.requests?.new || 0,
      icon: FiTrendingUp,
      color: 'bg-yellow-500',
      link: '/requests?status=New',
    },
    {
      title: 'In Progress',
      value: overview?.requests?.inProgress || 0,
      icon: FiTrendingDown,
      color: 'bg-orange-500',
      link: '/requests?status=In Progress',
    },
    {
      title: 'Repaired',
      value: overview?.requests?.repaired || 0,
      icon: FiCheckCircle,
      color: 'bg-green-500',
      link: '/requests?status=Repaired',
    },
    {
      title: 'Equipment',
      value: overview?.equipment?.total || 0,
      icon: FiTool,
      color: 'bg-purple-500',
      link: '/equipment',
    },
    {
      title: 'Teams',
      value: overview?.teams || 0,
      icon: FiUsers,
      color: 'bg-indigo-500',
      link: '/teams',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/requests/new" className="btn btn-primary">
          + New Request
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      {charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Requests by Priority</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.requestsByPriority || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, percent }) => `${_id}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                >
                  {Array.isArray(charts.requestsByPriority) && charts.requestsByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Type Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Requests by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.requestsByType || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
