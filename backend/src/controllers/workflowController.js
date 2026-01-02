const MaintenanceRequest = require('../models/MaintenanceRequest');
const { REQUEST_STATUS, SLA_LIMITS } = require('../config/constants');

// @desc    Get workflow statistics
// @route   GET /api/workflows/statistics
// @access  Private
exports.getStatistics = async (req, res, next) => {
  try {
    const totalRequests = await MaintenanceRequest.countDocuments();
    const statusCounts = await MaintenanceRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityCounts = await MaintenanceRequest.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const typeCounts = await MaintenanceRequest.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      status: 'success',
      data: {
        totalRequests,
        statusCounts,
        priorityCounts,
        typeCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get SLA status
// @route   GET /api/workflows/sla-status
// @access  Private
exports.getSLAStatus = async (req, res, next) => {
  try {
    const requests = await MaintenanceRequest.find({
      status: { $in: [REQUEST_STATUS.PENDING, REQUEST_STATUS.IN_PROGRESS] },
    }).populate('equipment');

    const slaStatus = requests.map((request) => {
      const slaLimit = SLA_LIMITS[request.priority] || 72;
      const hoursElapsed = (Date.now() - request.createdAt) / (1000 * 60 * 60);
      const breached = hoursElapsed > slaLimit;

      return {
        requestNumber: request.requestNumber,
        priority: request.priority,
        hoursElapsed: Math.round(hoursElapsed),
        slaLimit,
        breached,
        remainingHours: breached ? 0 : Math.round(slaLimit - hoursElapsed),
      };
    });

    res.json({
      status: 'success',
      data: { slaStatus },
    });
  } catch (error) {
    next(error);
  }
};
