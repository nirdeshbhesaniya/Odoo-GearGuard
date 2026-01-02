import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { teamService, requestService } from '../services';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    requestType: '',
    status: '',
    maintenanceTeam: '',
  });
  const [teams, setTeams] = useState([]);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamService.getTeams();
      const teamsData = response.data?.docs || response.data || [];
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeams([]);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);

      const params = {};
      Object.entries(filter).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const response = await requestService.getRequests(params);
      const requests = response.data?.docs || response.data?.requests || [];

      // Ensure requests is an array
      if (!Array.isArray(requests)) {
        setReportData({ requests: [], stats: { total: 0, byType: {}, byStatus: {}, avgDuration: 0 } });
        return;
      }

      // Calculate statistics
      const stats = {
        total: requests.length,
        byType: requests.reduce((acc, req) => {
          acc[req.requestType] = (acc[req.requestType] || 0) + 1;
          return acc;
        }, {}),
        byStatus: requests.reduce((acc, req) => {
          acc[req.status] = (acc[req.status] || 0) + 1;
          return acc;
        }, {}),
        avgDuration: requests.reduce((sum, req) => sum + (req.durationHours || 0), 0) / requests.length || 0,
      };

      setReportData({ requests, stats });
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData || !Array.isArray(reportData.requests) || reportData.requests.length === 0) return;

    const headers = ['Request Number', 'Type', 'Status', 'Subject', 'Equipment', 'Team', 'Technician', 'Scheduled Date', 'Duration (hrs)'];
    const rows = reportData.requests.map(req => [
      req.requestNumber,
      req.requestType,
      req.status,
      req.subject,
      req.equipment?.name || '',
      req.maintenanceTeam?.teamName || '',
      req.assignedTechnician?.name || '',
      req.scheduledDate ? new Date(req.scheduledDate).toLocaleDateString() : '',
      req.durationHours || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maintenance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filter.endDate}
              onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Type
            </label>
            <select
              value={filter.requestType}
              onChange={(e) => setFilter({ ...filter, requestType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="Corrective">Corrective</option>
              <option value="Preventive">Preventive</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Repaired">Repaired</option>
              <option value="Scrap">Scrap</option>
            </select>
          </div>

          {/* Team */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maintenance Team
            </label>
            <select
              value={filter.maintenanceTeam}
              onChange={(e) => setFilter({ ...filter, maintenanceTeam: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Teams</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={generateReport}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>

          {reportData && (
            <>
              <button
                onClick={exportToCSV}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📥 Export CSV
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                🖨️ Print
              </button>
            </>
          )}
        </div>
      </div>

      {/* Report Results */}
      {loading && (
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {reportData && !loading && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <h3 className="text-sm text-gray-500 mb-1">Total Requests</h3>
              <p className="text-3xl font-bold text-blue-600">{reportData.stats.total}</p>
            </div>

            <div className="card p-4">
              <h3 className="text-sm text-gray-500 mb-1">Corrective</h3>
              <p className="text-3xl font-bold text-orange-600">
                {reportData.stats.byType.Corrective || 0}
              </p>
            </div>

            <div className="card p-4">
              <h3 className="text-sm text-gray-500 mb-1">Preventive</h3>
              <p className="text-3xl font-bold text-purple-600">
                {reportData.stats.byType.Preventive || 0}
              </p>
            </div>

            <div className="card p-4">
              <h3 className="text-sm text-gray-500 mb-1">Avg Duration</h3>
              <p className="text-3xl font-bold text-green-600">
                {reportData.stats.avgDuration.toFixed(1)}h
              </p>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(reportData.stats.byStatus).map(([status, count]) => (
                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600">{status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Requests Table */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Detailed Report ({reportData.requests.length} requests)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Request #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Equipment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Team
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <Link
                          to={`/requests/${request._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {request.requestNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${request.requestType === 'Corrective'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-purple-100 text-purple-800'
                            }`}
                        >
                          {request.requestType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${request.status === 'New'
                            ? 'bg-blue-100 text-blue-800'
                            : request.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'Repaired'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {request.subject}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {request.equipment?.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {request.maintenanceTeam?.teamName || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {request.durationHours ? `${request.durationHours}h` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!reportData && !loading && (
        <div className="card p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Report Generated
          </h3>
          <p className="text-gray-600">
            Select filters and click "Generate Report" to view maintenance data
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
