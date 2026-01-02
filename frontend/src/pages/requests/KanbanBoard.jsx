import { useState, useEffect } from 'react';
import KanbanColumn from '../../components/kanban/KanbanColumn';
import Spinner from '../../components/common/Spinner';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import api from '../../services/api';
import { showSuccess, showError, showWarning } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';

const KanbanBoard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState({
    New: [],
    'In Progress': [],
    Repaired: [],
    Scrap: [],
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    requestType: '',
    maintenanceTeam: '',
  });
  const [teams, setTeams] = useState([]);
  const [draggedRequestId, setDraggedRequestId] = useState(null);
  
  // Only admin, manager, and technician can drag and drop
  const canDragAndDrop = user && ['admin', 'manager', 'technician'].includes(user.role?.toLowerCase());

  useEffect(() => {
    fetchRequests();
    fetchTeams();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.requestType) params.requestType = filter.requestType;
      if (filter.maintenanceTeam) params.maintenanceTeam = filter.maintenanceTeam;

      const response = await api.get('/requests/kanban', { params });

      if (response.data.status === 'success') {
        const kanbanData = response.data.data?.kanban || {};
        // Transform backend response into the expected format
        const groupedRequests = {
          New: kanbanData.New?.requests || [],
          'In Progress': kanbanData['In Progress']?.requests || [],
          Repaired: kanbanData.Repaired?.requests || [],
          Scrap: kanbanData.Scrap?.requests || [],
        };

        setRequests(groupedRequests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      showError('Failed to load Kanban board');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      if (response.data.status === 'success') {
        const teamsData = response.data.data?.docs || response.data.data || [];
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeams([]); // Set to empty array on error
    }
  };

  const handleDragStart = (e, requestId) => {
    if (!canDragAndDrop) {
      e.preventDefault();
      showWarning('You do not have permission to move requests');
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('requestId', requestId);
    setDraggedRequestId(requestId);
  };

  const handleDrop = async (requestId, newStatus) => {
    setDraggedRequestId(null);
    
    if (!canDragAndDrop) {
      showWarning('You do not have permission to move requests');
      return;
    }

    // Find the request and its current status
    let currentStatus = null;
    let request = null;
    
    for (const [status, statusRequests] of Object.entries(requests)) {
      const found = statusRequests.find(r => r._id === requestId);
      if (found) {
        currentStatus = status;
        request = found;
        break;
      }
    }

    if (!request || currentStatus === newStatus) return;

    // Define valid status transitions
    const validTransitions = {
      'New': ['In Progress'],
      'In Progress': ['Repaired', 'Scrap'],
      'Repaired': ['In Progress'],
      'Scrap': [],
    };

    // Check if transition is valid (skip for admin)
    const userRole = user?.role?.toLowerCase();
    const allowedStatuses = validTransitions[currentStatus] || [];
    
    if (userRole !== 'admin' && !allowedStatuses.includes(newStatus)) {
      showError(`Cannot move from ${currentStatus} to ${newStatus}. Allowed: ${allowedStatuses.join(', ') || 'None'}`);
      return;
    }

    // Optimistic update
    const newRequests = { ...requests };
    newRequests[currentStatus] = newRequests[currentStatus].filter(r => r._id !== requestId);
    newRequests[newStatus] = [...newRequests[newStatus], request];
    setRequests(newRequests);

    // Update on server
    try {
      await api.patch(`/requests/${requestId}/kanban-status`, {
        status: newStatus,
      });

      showSuccess(`Request moved to ${newStatus}`);
      
      // Mark equipment as unusable if moved to Scrap
      if (newStatus === 'Scrap' && request.equipment) {
        showWarning(`Equipment "${request.equipment.name}" should be marked as unusable`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update request status';
      showError(errorMessage);
      // Revert optimistic update
      fetchRequests();
    }
  };

  if (loading) {
    return <LoadingOverlay message="Loading Kanban board..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Board</h1>
        <button
          onClick={fetchRequests}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex gap-4">
          <div className="flex-1">
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

          <div className="flex-1">
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
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.entries(requests).map(([status, statusRequests]) => (
          <KanbanColumn
            key={status}
            status={status}
            requests={statusRequests}
            count={statusRequests.length}
            isDragDisabled={!canDragAndDrop}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            draggedRequestId={draggedRequestId}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
