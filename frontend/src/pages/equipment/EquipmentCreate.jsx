import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiTool, FiHash, FiMapPin, FiCalendar, FiUsers, FiUser, FiFileText, FiBriefcase } from 'react-icons/fi';
import { equipmentService, teamService, userService } from '../../services';
import { showSuccess, showError } from '../../utils/toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EquipmentCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    department: '',
    location: '',
    purchaseDate: '',
    warrantyExpiry: '',
    maintenanceTeam: '',
    defaultTechnician: '',
    notes: '',
  });

  useEffect(() => {
    fetchTeams();
    fetchTechnicians();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamService.getTeams();
      const teamsData = response.data?.docs || response.data || [];
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await userService.getUsers({ role: 'technician' });
      const users = response.data?.docs || response.data || [];
      setTechnicians(Array.isArray(users) ? users : []);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await equipmentService.createEquipment(formData);
      showSuccess('Equipment added successfully');
      navigate('/equipment');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to add equipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Equipment</h1>
          <p className="text-gray-600 mt-1">Register new equipment in the system</p>
        </div>
        <button
          onClick={() => navigate('/equipment')}
          className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FiX className="w-5 h-5 mr-2" />
          Cancel
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Equipment Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiTool className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., CNC Machine, Hydraulic Press"
                    required
                  />
                </div>
              </div>

              {/* Serial Number */}
              <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                    placeholder="e.g., EQ-2024-001"
                    required
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBriefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Production, Maintenance"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Building A, Floor 2, Bay 3"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Purchase & Warranty */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Purchase & Warranty Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Purchase Date */}
              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Warranty Expiry */}
              <div>
                <label htmlFor="warrantyExpiry" className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Expiry *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="warrantyExpiry"
                    name="warrantyExpiry"
                    value={formData.warrantyExpiry}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Assignment (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Maintenance Team */}
              <div>
                <label htmlFor="maintenanceTeam" className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Team
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="maintenanceTeam"
                    name="maintenanceTeam"
                    value={formData.maintenanceTeam}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Team (Optional)</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.teamName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Default Technician */}
              <div>
                <label htmlFor="defaultTechnician" className="block text-sm font-medium text-gray-700 mb-2">
                  Default Technician
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="defaultTechnician"
                    name="defaultTechnician"
                    value={formData.defaultTechnician}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Technician (Optional)</option>
                    {technicians.map((tech) => (
                      <option key={tech._id} value={tech._id}>
                        {tech.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Additional Information
            </h3>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                  <FiFileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Any additional information about the equipment..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={() => navigate('/equipment')}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <FiSave className="w-5 h-5 mr-2" />
                Add Equipment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentCreate;
