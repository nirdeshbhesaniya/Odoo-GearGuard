import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';

const typeColors = {
  Corrective: 'bg-orange-100 text-orange-800',
  Preventive: 'bg-purple-100 text-purple-800',
};

const KanbanCard = ({ request, isDragDisabled = false, onDragStart, isDragging = false }) => {
  // Check if request is overdue
  const isOverdue = request.scheduledDate &&
    new Date(request.scheduledDate) < new Date() &&
    request.status !== 'Repaired' &&
    request.status !== 'Scrap';

  const handleDragStart = (e) => {
    if (!isDragDisabled && onDragStart) {
      onDragStart(e, request._id);
    }
  };

  return (
    <div
      draggable={!isDragDisabled}
      onDragStart={handleDragStart}
      className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow select-none ${isDragDisabled ? 'cursor-default' : 'cursor-move'
        } ${isDragging ? 'opacity-50 shadow-lg ring-2 ring-blue-500' : ''
        } ${isOverdue ? 'border-red-500 border-2' : 'border-gray-200'}`}
    >
      {/* Overdue Badge */}
      {isOverdue && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
            🚨 Overdue
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link
            to={`/requests/${request._id}`}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 block mb-1"
          >
            {request.requestNumber}
          </Link>
          <h4 className="text-gray-900 font-medium line-clamp-2">
            {request.subject}
          </h4>
        </div>
        <span
          className={`ml-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${typeColors[request.requestType] || 'bg-gray-100 text-gray-800'
            }`}
        >
          {request.requestType}
        </span>
      </div>

      {/* Description */}
      {request.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {request.description}
        </p>
      )}

      {/* Equipment Info */}
      {request.equipment && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500">Equipment</p>
          <p className="text-sm font-medium text-gray-800">
            {request.equipment.name}
          </p>
          {request.equipment.serialNumber && (
            <p className="text-xs text-gray-500">
              SN: {request.equipment.serialNumber}
            </p>
          )}
        </div>
      )}

      {/* Team & Duration */}
      <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
        {request.maintenanceTeam && (
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{request.maintenanceTeam.teamName}</span>
          </div>
        )}
        {request.durationHours && (
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{request.durationHours}h</span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {/* Assigned Technician */}
        {request.assignedTechnician ? (
          <div className="flex items-center gap-2">
            <Avatar
              user={request.assignedTechnician}
              size="sm"
            />
            <span className="text-sm text-gray-700">
              {request.assignedTechnician.name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Unassigned</span>
        )}

        {/* Date */}
        {request.scheduledDate && (
          <div className="text-xs text-gray-500">
            📅 {new Date(request.scheduledDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;