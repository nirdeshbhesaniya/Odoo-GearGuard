const MaintenanceRequest = require('../models/MaintenanceRequest');
const { REQUEST_STATUS } = require('../config/constants');

// @desc    Get calendar events (mainly for Preventive Maintenance)
// @route   GET /api/calendar/events
// @access  Private
exports.getCalendarEvents = async (req, res, next) => {
  try {
    const { start, end, requestType } = req.query;

    const filter = {};

    // Filter by date range if provided
    if (start && end) {
      filter.scheduledDate = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    // Filter by request type if specified (typically Preventive for calendar)
    if (requestType) {
      filter.requestType = requestType;
    } else {
      // Default to showing Preventive Maintenance in calendar
      filter.requestType = 'Preventive';
    }

    const events = await MaintenanceRequest.find(filter)
      .populate('equipment', 'name serialNumber')
      .populate('maintenanceTeam', 'teamName')
      .populate('assignedTechnician', 'name')
      .select('subject description scheduledDate status requestType equipment durationHours requestNumber assignedTechnician maintenanceTeam')
      .sort('scheduledDate');

    const formattedEvents = events.map((event) => {
      const startDate = new Date(event.scheduledDate);
      const endDate = new Date(startDate);

      // Add duration to calculate end time
      if (event.durationHours) {
        endDate.setHours(endDate.getHours() + event.durationHours);
      } else {
        endDate.setHours(endDate.getHours() + 2); // Default 2 hours
      }

      return {
        _id: event._id,
        title: `${event.requestNumber} - ${event.subject}`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        status: event.status,
        requestType: event.requestType,
        equipment: event.equipment ? {
          name: event.equipment.name,
          serialNumber: event.equipment.serialNumber,
        } : null,
        maintenanceTeam: event.maintenanceTeam,
        assignedTechnician: event.assignedTechnician,
        description: event.description,
        durationHours: event.durationHours,
        allDay: false,
        color: getEventColor(event.status),
      };
    });

    res.json(formattedEvents);
  } catch (error) {
    next(error);
  }
};

// Helper function to get event color based on status
function getEventColor(status) {
  const colors = {
    [REQUEST_STATUS.NEW]: '#3b82f6', // Blue
    [REQUEST_STATUS.IN_PROGRESS]: '#f59e0b', // Orange
    [REQUEST_STATUS.REPAIRED]: '#10b981', // Green
    [REQUEST_STATUS.SCRAP]: '#ef4444', // Red
  };
  return colors[status] || '#6b7280'; // Gray default
}

// @desc    Get team availability
// @route   GET /api/calendar/availability
// @access  Private
exports.getTeamAvailability = async (req, res, next) => {
  try {
    const { start, end, teamId } = req.query;

    const filter = {
      scheduledDate: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
      status: { $in: ['pending', 'in_progress'] },
    };

    if (teamId) {
      filter.maintenanceTeam = teamId;
    }

    const assignments = await MaintenanceRequest.find(filter)
      .populate('maintenanceTeam assignedTechnician');

    res.json({
      status: 'success',
      data: { assignments },
    });
  } catch (error) {
    next(error);
  }
};
