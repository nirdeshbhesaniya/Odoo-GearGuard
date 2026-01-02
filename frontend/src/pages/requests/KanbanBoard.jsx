import { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import KanbanColumn from '../../components/kanban/KanbanColumn';
import Spinner from '../../components/common/Spinner';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import api from '../../services/api';
import { showSuccess, showError, showWarning } from '../../utils/toast';

const KanbanBoard = () => {
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // No movement
    if (source.droppableId === destination.droppableId &&
      source.index === destination.index) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    // Optimistic update
    const newRequests = { ...requests };
    const [movedRequest] = newRequests[sourceColumn].splice(source.index, 1);
    newRequests[destColumn].splice(destination.index, 0, movedRequest);
    setRequests(newRequests);

    // Update on server
    try {
      await api.patch(`/requests/${draggableId}/kanban-status`, {
        status: destColumn,
      });

      showSuccess(`Request moved to ${destColumn}`);
    } catch (error) {
      console.error('Error updating status:', error);
      showError('Failed to update request status. Changes reverted.');
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Object.entries(requests).map(([status, statusRequests]) => (
            <KanbanColumn
              key={status}
              status={status}
              requests={statusRequests}
              count={statusRequests.length}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
