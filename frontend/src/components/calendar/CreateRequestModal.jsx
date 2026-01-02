import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { equipmentService, requestService } from '../../services';

const CreateRequestModal = ({ selectedDate, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    equipment: '',
    scheduledDate: selectedDate ? selectedDate.toISOString().slice(0, 16) : '',
    durationHours: 2,
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await equipmentService.getEquipment();
      console.log('Equipment response:', response);
      // Response structure after pagination fix: { status: 'success', data: { docs: [...], totalPages, totalDocs } }
      const equipmentList = response.data?.data?.docs || response.data?.docs || response.data?.equipment || response.data || [];
      console.log('Equipment list:', equipmentList);
      setEquipment(Array.isArray(equipmentList) ? equipmentList.filter(e => !e.isScrapped) : []); // Only show active equipment
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment list');
      setEquipment([]); // Set to empty array on error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.subject || formData.subject.length < 5) {
      toast.error('Subject must be at least 5 characters');
      return;
    }

    if (!formData.equipment) {
      toast.error('Please select equipment');
      return;
    }

    if (!formData.scheduledDate) {
      toast.error('Please select a scheduled date');
      return;
    }

    // Check if date is in the future
    const scheduledDate = new Date(formData.scheduledDate);
    if (scheduledDate <= new Date()) {
      toast.error('Scheduled date must be in the future');
      return;
    }

    if (formData.durationHours < 0.5 || formData.durationHours > 24) {
      toast.error('Duration must be between 0.5 and 24 hours');
      return;
    }

    try {
      setLoading(true);

      // Create Preventive maintenance request with proper backend field names
      const requestData = {
        subject: formData.subject,
        description: formData.description,
        equipment: formData.equipment,
        scheduledDate: formData.scheduledDate,
        durationHours: parseFloat(formData.durationHours),
        requestType: 'Preventive',
      };

      const response = await requestService.createPreventiveRequest(requestData);

      toast.success('Preventive maintenance scheduled successfully');
      onSuccess(response);
      onClose();
    } catch (error) {
      console.error('Error creating request:', error);
      const message = error.response?.data?.message || error.message || 'Failed to schedule maintenance';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Schedule Preventive Maintenance
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Create a new preventive maintenance request
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Monthly inspection of hydraulic system"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={5}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                5-200 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of maintenance work..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment <span className="text-red-500">*</span>
              </label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select equipment...</option>
                {equipment.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} {item.serialNumber && `(${item.serialNumber})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheduled Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (hours) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleChange}
                  min="0.5"
                  max="24"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-2">
                <span className="text-blue-600">ℹ️</span>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Preventive Maintenance</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Maintenance team and technician will be auto-assigned based on equipment</li>
                    <li>Scheduled date must be in the future</li>
                    <li>Only managers can create preventive maintenance</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </span>
                ) : (
                  '📅 Schedule Maintenance'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestModal;
