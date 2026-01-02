import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { requestService } from '../services';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { toast } from 'react-hot-toast';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Analytics = () => {
  const [teamData, setTeamData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const [teamResult, equipmentResult] = await Promise.all([
        requestService.getRequestsByTeam(params),
        requestService.getBreakdownsByEquipment({ ...params, limit: 10 }),
      ]);

      const teams = teamResult.data || [];
      const equipment = equipmentResult.data || [];

      setTeamData(Array.isArray(teams) ? teams : []);
      setEquipmentData(Array.isArray(equipment) ? equipment : []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
      setTeamData([]);
      setEquipmentData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Prepare data for team workload pie chart
  const teamWorkloadData = teamData.map((team) => ({
    name: team.teamName,
    value: team.totalRequests,
  }));

  // Prepare data for equipment breakdown comparison
  const topEquipmentBreakdowns = equipmentData.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
      </div>

      {/* Date Range Filter */}
      <div className="card p-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {(dateRange.startDate || dateRange.endDate) && (
            <button
              onClick={() => setDateRange({ startDate: '', endDate: '' })}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <h3 className="text-sm text-gray-500 mb-1">Total Teams</h3>
          <p className="text-3xl font-bold text-blue-600">{teamData.length}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm text-gray-500 mb-1">Total Requests</h3>
          <p className="text-3xl font-bold text-green-600">
            {teamData.reduce((sum, team) => sum + team.totalRequests, 0)}
          </p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm text-gray-500 mb-1">Equipment with Issues</h3>
          <p className="text-3xl font-bold text-orange-600">{equipmentData.length}</p>
        </div>
        <div className="card p-4">
          <h3 className="text-sm text-gray-500 mb-1">Total Breakdowns</h3>
          <p className="text-3xl font-bold text-red-600">
            {equipmentData.reduce((sum, eq) => sum + eq.breakdownCount, 0)}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests per Team - Bar Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Requests per Maintenance Team
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="teamName"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalRequests" fill="#3B82F6" name="Total Requests" />
              <Bar dataKey="inProgressRequests" fill="#F59E0B" name="In Progress" />
              <Bar dataKey="repairedRequests" fill="#10B981" name="Repaired" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team Workload Distribution - Pie Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Team Workload Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={teamWorkloadData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {teamWorkloadData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdowns per Equipment - Bar Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top 10 Equipment by Breakdowns
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEquipmentBreakdowns} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="equipmentName"
                type="category"
                width={120}
                fontSize={12}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="breakdownCount" fill="#EF4444" name="Total Breakdowns" />
              <Bar
                dataKey="repairedBreakdowns"
                fill="#10B981"
                name="Repaired"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Request Type Distribution by Team */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Request Type Distribution by Team
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="teamName"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="correctiveRequests" fill="#F59E0B" name="Corrective" stackId="a" />
              <Bar dataKey="preventiveRequests" fill="#8B5CF6" name="Preventive" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Team Performance Table */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Detailed Team Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Team
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  New
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  In Progress
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Repaired
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Scrapped
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Corrective
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Preventive
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teamData.map((team) => (
                <tr key={team.teamId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    <Link
                      to={`/teams/${team.teamId}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {team.teamName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                    {team.totalRequests}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600">
                    {team.newRequests}
                  </td>
                  <td className="px-4 py-3 text-sm text-yellow-600">
                    {team.inProgressRequests}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600">
                    {team.repairedRequests}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600">
                    {team.scrappedRequests}
                  </td>
                  <td className="px-4 py-3 text-sm text-orange-600">
                    {team.correctiveRequests}
                  </td>
                  <td className="px-4 py-3 text-sm text-purple-600">
                    {team.preventiveRequests}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Breakdown Details Table */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Equipment Breakdown Details (Top 10)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Equipment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Serial Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Breakdowns
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  In Progress
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Repaired
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Breakdown
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipmentData.map((equipment) => (
                <tr key={equipment.equipmentId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    <Link
                      to={`/equipment/${equipment.equipmentId}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {equipment.equipmentName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {equipment.serialNumber || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {equipment.location || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-600">
                    {equipment.breakdownCount}
                  </td>
                  <td className="px-4 py-3 text-sm text-yellow-600">
                    {equipment.inProgressBreakdowns}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600">
                    {equipment.repairedBreakdowns}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {equipment.lastBreakdown
                      ? new Date(equipment.lastBreakdown).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {equipment.isScrapped ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Scrapped
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
