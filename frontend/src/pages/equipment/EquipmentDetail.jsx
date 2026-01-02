import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';
import StatusBadge from '../../components/common/StatusBadge';
import { equipmentService, requestService } from '../../services';
import { toast } from 'react-hot-toast';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [maintenanceStats, setMaintenanceStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  useEffect(() => {
    fetchEquipmentDetails();
    fetchMaintenanceStats();
    fetchRecentRequests();
  }, [id]);

  const fetchEquipmentDetails = async () => {
    try {
      const response = await equipmentService.getEquipmentById(id);
      setEquipment(response.data?.equipment || response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaintenanceStats = async () => {
    try {
      const response = await requestService.getEquipmentStats(id);
      setMaintenanceStats(response.data || response);
    } catch (error) {
      console.error('Error fetching maintenance stats:', error);
    }
  };

  const fetchRecentRequests = async () => {
    try {
      const response = await requestService.getRequests({ equipment: id, limit: 5 });
      setRecentRequests(response.data?.requests || response.data || []);
    } catch (error) {
      console.error('Error fetching recent requests:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="card p-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Equipment Not Found</h2>
        <p className="text-gray-600 mb-4">The equipment you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/equipment')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Equipment List
        </button>
      </div>
    );
  }

  const openRequests = maintenanceStats?.openRequests || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{equipment.name}</h1>
          {equipment.serialNumber && (
            <p className="text-sm text-gray-500 mt-1">SN: {equipment.serialNumber}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/equipment/${id}/edit`)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          {equipment.isScrapped && (
            <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">
              🗑️ Scrapped
            </span>
          )}
        </div>
      </div>

      {/* Smart Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Maintenance Button */}
        <button
          onClick={() => navigate(`/requests?equipment=${id}`)}
          className="card p-6 hover:shadow-lg transition-shadow cursor-pointer text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Maintenance Requests</p>
              <p className="text-3xl font-bold text-blue-600 group-hover:text-blue-700">
                {maintenanceStats?.totalRequests || 0}
              </p>
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                🔧
              </div>
              {openRequests > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {openRequests}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{openRequests} open requests</p>
        </button>

        {/* Completed Repairs */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Completed Repairs</p>
              <p className="text-3xl font-bold text-green-600">
                {maintenanceStats?.repairedRequests || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
        </div>

        {/* Preventive Maintenance */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Preventive Maintenance</p>
              <p className="text-3xl font-bold text-purple-600">
                {maintenanceStats?.preventiveRequests || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
              📅
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Equipment Name</dt>
              <dd className="text-base font-medium text-gray-900">{equipment.name}</dd>
            </div>
            {equipment.serialNumber && (
              <div>
                <dt className="text-sm text-gray-500">Serial Number</dt>
                <dd className="text-base font-medium text-gray-900">{equipment.serialNumber}</dd>
              </div>
            )}
            {equipment.department && (
              <div>
                <dt className="text-sm text-gray-500">Department</dt>
                <dd className="text-base font-medium text-gray-900">{equipment.department}</dd>
              </div>
            )}
            {equipment.location && (
              <div>
                <dt className="text-sm text-gray-500">Location</dt>
                <dd className="text-base font-medium text-gray-900">{equipment.location}</dd>
              </div>
            )}
            {equipment.description && (
              <div>
                <dt className="text-sm text-gray-500">Description</dt>
                <dd className="text-base text-gray-900">{equipment.description}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Maintenance Team */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Assignment</h2>
          <div className="space-y-4">
            {equipment.maintenanceTeam && (
              <div>
                <dt className="text-sm text-gray-500 mb-2">Maintenance Team</dt>
                <Link
                  to={`/teams/${equipment.maintenanceTeam._id}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <span className="text-xl">👥</span>
                  <span className="font-medium">{equipment.maintenanceTeam.teamName}</span>
                </Link>
              </div>
            )}
            {equipment.defaultTechnician && (
              <div>
                <dt className="text-sm text-gray-500 mb-2">Default Technician</dt>
                <Link
                  to={`/users/${equipment.defaultTechnician._id}`}
                  className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <Avatar user={equipment.defaultTechnician} size="md" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {equipment.defaultTechnician.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {equipment.defaultTechnician.email}
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Maintenance Requests */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Maintenance Requests</h2>
          <Link
            to={`/requests?equipment=${id}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </Link>
        </div>

        {recentRequests.length > 0 ? (
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <Link
                key={request._id}
                to={`/requests/${request._id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-blue-600">
                      {request.requestNumber}
                    </span>
                    <StatusBadge status={request.status} showIcon={false} />
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${request.requestType === 'Corrective'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-purple-100 text-purple-800'
                        }`}
                    >
                      {request.requestType}
                    </span>
                  </div>
                  {request.scheduledDate && (
                    <span className="text-xs text-gray-500">
                      📅 {new Date(request.scheduledDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-gray-900 font-medium">{request.subject}</p>
                {request.assignedTechnician && (
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar user={request.assignedTechnician} size="xs" />
                    <span className="text-sm text-gray-600">
                      {request.assignedTechnician.name}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No maintenance requests yet</p>
            <Link
              to="/requests/new"
              className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
            >
              Create First Request →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentDetail;
