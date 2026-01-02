const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const Team = require('../models/Team');

// @desc    Get dashboard overview
// @route   GET /api/dashboard/overview
// @access  Private
exports.getOverview = async (req, res, next) => {
  try {
    const [
      totalRequests,
      newRequests,
      inProgressRequests,
      repairedRequests,
      totalEquipment,
      operationalEquipment,
      totalUsers,
      totalTeams,
    ] = await Promise.all([
      MaintenanceRequest.countDocuments(),
      MaintenanceRequest.countDocuments({ status: 'New' }),
      MaintenanceRequest.countDocuments({ status: 'In Progress' }),
      MaintenanceRequest.countDocuments({ status: 'Repaired' }),
      Equipment.countDocuments(),
      Equipment.countDocuments({ status: 'operational' }),
      User.countDocuments({ isActive: true }),
      Team.countDocuments({ isActive: true }),
    ]);

    res.json({
      status: 'success',
      data: {
        requests: {
          total: totalRequests,
          new: newRequests,
          inProgress: inProgressRequests,
          repaired: repairedRequests,
        },
        equipment: {
          total: totalEquipment,
          operational: operationalEquipment,
        },
        users: totalUsers,
        teams: totalTeams,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chart data
// @route   GET /api/dashboard/charts
// @access  Private
exports.getChartData = async (req, res, next) => {
  try {
    const requestsByMonth = await MaintenanceRequest.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const requestsByPriority = await MaintenanceRequest.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const requestsByType = await MaintenanceRequest.aggregate([
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
        requestsByMonth,
        requestsByPriority,
        requestsByType,
      },
    });
  } catch (error) {
    next(error);
  }
};
