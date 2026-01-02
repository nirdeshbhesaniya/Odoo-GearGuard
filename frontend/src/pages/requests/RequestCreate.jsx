import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiCalendar, FiClock, FiTool, FiUsers, FiUser, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { requestService, equipmentService, teamService, userService } from '../../services';
import { showSuccess, showError } from '../../utils/toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const RequestCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [teams, setTeams] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    requestType: 'Corrective',
    equipment: '',
    maintenanceTeam: '',
    assignedTechnician: '',
    scheduledDate: '',
    durationHours: 1,
  });

  useEffect(() => {
    fetchEquipment();
    fetchTeams();
    fetchTechnicians();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await equipmentService.getEquipment();
      const equipment = response.data?.docs || response.data || [];
      setEquipmentList(Array.isArray(equipment) ? equipment : []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

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

    if (!formData.equipment || !formData.scheduledDate) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const endpoint = formData.requestType === 'Corrective'
        ? requestService.createCorrectiveRequest
        : requestService.createPreventiveRequest;

      await endpoint(formData);
      showSuccess('Request created successfully');
      navigate('/requests');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Request</h1>
          <p className="text-gray-600 mt-1">Fill in the details to create a maintenance request</p>
        </div>
        <button
          onClick={() => navigate('/requests')}
          className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FiX className="w-5 h-5 mr-2" />
          Cancel
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300">
                <input
                  type="radio"
                  name="requestType"
                  value="Corrective"
                  checked={formData.requestType === 'Corrective'}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Corrective</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Fix broken or malfunctioning equipment</p>
                </div>
              </label>
              <label className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300">
                <input
                  type="radio"
                  name="requestType"
                  value="Preventive"
                  checked={formData.requestType === 'Preventive'}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="flex items-center">
                    <FiCalendar className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Preventive</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Scheduled maintenance to prevent issues</p>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject */}
            <div className="md:col-span-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Brief description of the maintenance need"
                  required
                />
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 mb-2">
                Equipment *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiTool className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="equipment"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Equipment</option>
                  {equipmentList.map((eq) => (
                    <option key={eq._id} value={eq._id}>
                      {eq.name} - {eq.serialNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scheduled Date */}
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

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

            {/* Assigned Technician */}
            <div>
              <label htmlFor="assignedTechnician" className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Technician
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="assignedTechnician"
                  name="assignedTechnician"
                  value={formData.assignedTechnician}
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

            {/* Duration Hours */}
            <div>
              <label htmlFor="durationHours" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Hours)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiClock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="durationHours"
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Provide detailed information about the maintenance request..."
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={() => navigate('/requests')}
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
                Create Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestCreate;
