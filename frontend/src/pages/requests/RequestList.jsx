import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import StatusBadge from '../../components/common/StatusBadge';
import Avatar from '../../components/common/Avatar';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { showError } from '../../utils/toast';

const RequestList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    requestType: searchParams.get('requestType') || '',
    equipment: searchParams.get('equipment') || '',
    search: searchParams.get('search') || '',
  });
  const [teams, setTeams] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetchRequests();
    fetchTeams();
    fetchEquipment();
  }, [searchParams]);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const params = {
        page: searchParams.get('page') || '1',
        limit: '10',
      };

      if (filters.status) params.status = filters.status;
      if (filters.requestType) params.type = filters.requestType;
      if (filters.equipment) params.equipment = filters.equipment;
      if (filters.search) params.search = filters.search;

      const response = await api.get('/requests', { params });

      if (response.data.status === 'success') {
        const { docs, page, totalPages, totalDocs } = response.data.data;
        setRequests(Array.isArray(docs) ? docs : []);
        setPagination({
          currentPage: page,
          totalPages: totalPages,
          totalDocs: totalDocs,
        });
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      showError('Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      if (response.data.status === 'success') {
        const teamsData = response.data.data.docs || response.data.data || [];
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeams([]);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await api.get('/equipment');
      if (response.data.status === 'success') {
        const equipmentData = response.data.data.docs || response.data.data || [];
        setEquipment(Array.isArray(equipmentData) ? equipmentData : []);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setEquipment([]);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      requestType: '',
      equipment: '',
      search: '',
    });
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
        <Link
          to="/requests/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Request
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Request number, subject..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Repaired">Repaired</option>
              <option value="Scrap">Scrap</option>
            </select>
          </div>

          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.requestType}
              onChange={(e) => handleFilterChange('requestType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="Corrective">Corrective</option>
              <option value="Preventive">Preventive</option>
            </select>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment
            </label>
            <select
              value={filters.equipment}
              onChange={(e) => handleFilterChange('equipment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Equipment</option>
              {equipment.map((eq) => (
                <option key={eq._id} value={eq._id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.status || filters.requestType || filters.equipment || filters.search) && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {requests.length} of {pagination.totalDocs || 0} requests
      </div>

      {/* Requests Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Link
                          to={`/requests/${request._id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {request.requestNumber}
                        </Link>
                        <p className="text-sm text-gray-900">{request.subject}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.equipment?.name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${request.requestType === 'Corrective'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-purple-100 text-purple-800'
                          }`}
                      >
                        {request.requestType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} showIcon={false} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.assignedTechnician ? (
                        <div className="flex items-center gap-2">
                          <Avatar user={request.assignedTechnician} size="xs" />
                          <span className="text-sm text-gray-900">
                            {request.assignedTechnician.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.scheduledDate
                        ? new Date(request.scheduledDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/requests/${request._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <p className="text-lg font-medium mb-2">No requests found</p>
                      <p className="text-sm">
                        Try adjusting your filters or create a new request
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={pagination.totalDocs}
          itemsPerPage={10}
        />
      )}
    </div>
  );
};

export default RequestList;
