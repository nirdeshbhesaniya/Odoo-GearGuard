import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiEdit, FiCalendar, FiClock, FiTool, FiUsers, FiUser,
  FiFileText, FiCheckCircle, FiAlertCircle, FiPlay, FiCheck, FiX,
} from 'react-icons/fi';
import { requestService } from '../../services';
import { showSuccess, showError } from '../../utils/toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [actualHours, setActualHours] = useState('');

  useEffect(() => {
    fetchRequestDetail();
  }, [id]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const response = await requestService.getRequestById(id);
      console.log('Request detail response:', response);
      console.log('Request data:', response.data);
      const requestData = response.data?.request || response.data?.data?.request || response.data?.data || response.data;
      console.log('Setting request to:', requestData);
      setRequest(requestData);
    } catch (error) {
      showError('Failed to load request details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async () => {
    try {
      setActionLoading(true);
      await requestService.updateRequest(id, {
        assignedTechnician: user._id,
      });
      showSuccess('Successfully assigned to you');
      fetchRequestDetail();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to assign request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      await requestService.updateRequest(id, { status: newStatus });
      showSuccess(`Request moved to ${newStatus}`);
      fetchRequestDetail();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!actualHours || actualHours <= 0) {
      showError('Please enter actual hours spent');
      return;
    }

    try {
      setActionLoading(true);
      await requestService.updateRequest(id, {
        status: 'Repaired',
        durationHours: parseFloat(actualHours),
        completedAt: new Date().toISOString(),
      });
      showSuccess('Request marked as completed');
      setShowCompleteModal(false);
      fetchRequestDetail();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to complete request');
    } finally {
      setActionLoading(false);
    }
  };

  const canAssign = user && ['admin', 'manager', 'technician'].includes(user.role);
  const canUpdateStatus = user && ['admin', 'manager', 'technician'].includes(user.role);
  const isAssignedToMe = request?.assignedTechnician?._id === user?._id;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Request not found</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      New: 'yellow',
      'In Progress': 'blue',
      Repaired: 'green',
      Scrap: 'red',
    };
    return colors[status] || 'gray';
  };

  const getTypeColor = (type) => (type === 'Corrective' ? 'red' : 'green');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/requests')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{request.requestNumber}</h1>
            <p className="text-gray-600 mt-1">{request.subject}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={getStatusColor(request.status)}>{request.status}</Badge>
          <Badge variant={getTypeColor(request.requestType)}>{request.requestType}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Details */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiFileText className="w-5 h-5 mr-2 text-blue-600" />
              Request Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Subject</label>
                <p className="text-gray-900 font-medium">{request.subject}</p>
              </div>
              {request.description && (
                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <p className="text-gray-900">{request.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Request Type</label>
                  <p className="text-gray-900 font-medium">{request.requestType}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <p className="text-gray-900 font-medium">{request.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Details */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiTool className="w-5 h-5 mr-2 text-blue-600" />
              Equipment
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Equipment Name</label>
                <p className="text-gray-900 font-medium">{request.equipment?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Serial Number</label>
                <p className="text-gray-900 font-medium">{request.equipment?.serialNumber || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Department</label>
                  <p className="text-gray-900">{request.equipment?.department || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <p className="text-gray-900">{request.equipment?.location || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiCalendar className="w-5 h-5 mr-2 text-blue-600" />
              Timeline
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-gray-600">Created At</label>
                  <p className="text-gray-900">{new Date(request.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-gray-600">Scheduled Date</label>
                  <p className="text-gray-900 font-medium">{new Date(request.scheduledDate).toLocaleString()}</p>
                </div>
              </div>
              {request.completedAt && (
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm text-gray-600">Completed At</label>
                    <p className="text-gray-900">{new Date(request.completedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <label className="text-sm text-gray-600">Duration</label>
                  <p className="text-gray-900 font-medium">
                    {request.durationHours || 0} hours
                    {request.status === 'Repaired' ? ' (Actual)' : ' (Estimated)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          {canUpdateStatus && request.status !== 'Repaired' && request.status !== 'Scrap' && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                {/* Assign to Me */}
                {canAssign && !isAssignedToMe && request.status === 'New' && (
                  <button
                    onClick={handleAssignToMe}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <FiUser className="w-4 h-4 mr-2" />
                    Assign to Me
                  </button>
                )}

                {/* Start Work */}
                {request.status === 'New' && isAssignedToMe && (
                  <button
                    onClick={() => handleStatusChange('In Progress')}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FiPlay className="w-4 h-4 mr-2" />
                    Start Work
                  </button>
                )}

                {/* Complete */}
                {request.status === 'In Progress' && isAssignedToMe && (
                  <button
                    onClick={() => setShowCompleteModal(true)}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FiCheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </button>
                )}

                {/* Move to Scrap */}
                {request.status === 'In Progress' && isAssignedToMe && (
                  <button
                    onClick={() => handleStatusChange('Scrap')}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Mark as Scrap
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Assignment */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiUsers className="w-5 h-5 mr-2 text-blue-600" />
              Assignment
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Maintenance Team</label>
                <p className="text-gray-900 font-medium">
                  {request.maintenanceTeam?.teamName || 'Not Assigned'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Assigned Technician</label>
                <p className="text-gray-900 font-medium">
                  {request.assignedTechnician?.name || 'Not Assigned'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Created By</label>
                <p className="text-gray-900">{request.createdBy?.name || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Complete Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Hours Spent *
              </label>
              <input
                type="number"
                value={actualHours}
                onChange={(e) => setActualHours(e.target.value)}
                min="0.5"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter actual hours spent"
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-1">
                Estimated: {request.durationHours || 0} hours
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={actionLoading || !actualHours}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Completing...' : 'Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetail;
