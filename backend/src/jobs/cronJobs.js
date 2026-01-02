const cron = require('node-cron');
const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const { createNotification } = require('../services/notificationService');
const { NOTIFICATION_TYPES, REQUEST_TYPES, REQUEST_PRIORITY } = require('../config/constants');

/**
 * Check for upcoming preventive maintenance
 * Runs daily at 8:00 AM
 */
const checkUpcomingMaintenance = cron.schedule('0 8 * * *', async () => {
  try {
    console.log('Running: Check upcoming maintenance...');

    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const equipmentDue = await Equipment.find({
      nextMaintenanceDate: {
        $gte: today,
        $lte: sevenDaysFromNow,
      },
      status: 'operational',
    }).populate('assignedTo');

    for (const equipment of equipmentDue) {
      // Create preventive maintenance request if not exists
      const existingRequest = await MaintenanceRequest.findOne({
        equipment: equipment._id,
        type: REQUEST_TYPES.PREVENTIVE,
        status: { $in: ['pending', 'in_progress'] },
      });

      if (!existingRequest && equipment.assignedTo) {
        const request = await MaintenanceRequest.create({
          title: `Preventive Maintenance - ${equipment.name}`,
          description: 'Scheduled preventive maintenance',
          type: REQUEST_TYPES.PREVENTIVE,
          priority: REQUEST_PRIORITY.MEDIUM,
          equipment: equipment._id,
          assignedTeam: equipment.assignedTo._id,
          scheduledDate: equipment.nextMaintenanceDate,
          createdBy: equipment.createdBy,
        });

        // Notify team members
        if (equipment.assignedTo.members) {
          for (const memberId of equipment.assignedTo.members) {
            await createNotification({
              recipient: memberId,
              type: NOTIFICATION_TYPES.MAINTENANCE_DUE,
              title: 'Preventive Maintenance Due',
              message: `Equipment "${equipment.name}" requires maintenance`,
              relatedRequest: request._id,
              relatedEquipment: equipment._id,
            });
          }
        }
      }
    }

    console.log(`Checked ${equipmentDue.length} equipment for upcoming maintenance`);
  } catch (error) {
    console.error('Error in checkUpcomingMaintenance:', error);
  }
}, {
  scheduled: false,
});

/**
 * Check for overdue requests
 * Runs every hour
 */
const checkOverdueRequests = cron.schedule('0 * * * *', async () => {
  try {
    console.log('Running: Check overdue requests...');

    const overdueRequests = await MaintenanceRequest.find({
      dueDate: { $lt: new Date() },
      status: { $in: ['pending', 'in_progress'] },
    }).populate('assignedTechnicians');

    for (const request of overdueRequests) {
      if (request.assignedTechnicians && request.assignedTechnicians.length > 0) {
        for (const tech of request.assignedTechnicians) {
          await createNotification({
            recipient: tech._id,
            type: NOTIFICATION_TYPES.REQUEST_STATUS_CHANGED,
            title: 'Request Overdue',
            message: `Request ${request.requestNumber} is overdue`,
            relatedRequest: request._id,
          });
        }
      }
    }

    console.log(`Found ${overdueRequests.length} overdue requests`);
  } catch (error) {
    console.error('Error in checkOverdueRequests:', error);
  }
}, {
  scheduled: false,
});

/**
 * Start all cron jobs
 */
exports.startCronJobs = () => {
  console.log('🕐 Starting cron jobs...');
  checkUpcomingMaintenance.start();
  checkOverdueRequests.start();
};

/**
 * Stop all cron jobs
 */
exports.stopCronJobs = () => {
  console.log('Stopping cron jobs...');
  checkUpcomingMaintenance.stop();
  checkOverdueRequests.stop();
};
