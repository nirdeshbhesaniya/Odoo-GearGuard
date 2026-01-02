import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';

const EquipmentCard = ({ equipment }) => {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link
            to={`/equipment/${equipment._id}`}
            className="text-lg font-semibold text-blue-600 hover:text-blue-800 block mb-1"
          >
            {equipment.name}
          </Link>
          {equipment.serialNumber && (
            <p className="text-sm text-gray-500">SN: {equipment.serialNumber}</p>
          )}
        </div>

        {/* Scrapped Badge */}
        {equipment.isScrapped && (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
            🗑️ Scrapped
          </span>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {equipment.department && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Department</p>
            <p className="text-sm font-medium text-gray-900">{equipment.department}</p>
          </div>
        )}

        {equipment.location && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Location</p>
            <p className="text-sm font-medium text-gray-900">{equipment.location}</p>
          </div>
        )}
      </div>

      {/* Description */}
      {equipment.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {equipment.description}
        </p>
      )}

      {/* Team & Technician */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        {/* Maintenance Team */}
        {equipment.maintenanceTeam && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">👥 Team:</span>
            <span className="text-sm font-medium text-gray-900">
              {equipment.maintenanceTeam.teamName}
            </span>
          </div>
        )}

        {/* Default Technician */}
        {equipment.defaultTechnician && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">🔧 Technician:</span>
            <div className="flex items-center gap-2">
              <Avatar user={equipment.defaultTechnician} size="xs" />
              <span className="text-sm font-medium text-gray-900">
                {equipment.defaultTechnician.name}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <Link
          to={`/equipment/${equipment._id}`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details →
        </Link>
        <Link
          to={`/equipment/${equipment._id}/history`}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          📜 History
        </Link>
      </div>
    </div>
  );
};

export default EquipmentCard;
