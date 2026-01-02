const mongoose = require('mongoose');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');
const Comment = require('../models/Comment');
const { paginate } = require('../utils/pagination');
const { createNotification } = require('../services/notificationService');
const { logAudit } = require('../services/auditService');
const {
  NOTIFICATION_TYPES, AUDIT_ACTIONS, REQUEST_STATUS, USER_ROLES,
} = require('../config/constants');

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private
exports.getRequests = async (req, res, next) => {
  try {
    const {
      page, limit, status, type, priority, assignedTeam, equipment, search,
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (assignedTeam) filter.assignedTeam = assignedTeam;
    if (equipment) filter.equipment = equipment;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { requestNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const result = await paginate(MaintenanceRequest, filter, {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      populate: 'equipment assignedTeam assignedTechnicians createdBy',
      sort: '-createdAt',
    });

    res.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Kanban board data (optimized with aggregation)
// @route   GET /api/requests/kanban
// @access  Private
exports.getKanbanBoard = async (req, res, next) => {
  try {
    const { requestType, maintenanceTeam } = req.query;

    // Build match stage for filtering
    const matchStage = {};
    if (requestType) {
      matchStage.requestType = requestType;
    }
    if (maintenanceTeam) {
      matchStage.maintenanceTeam = maintenanceTeam;
    }

    // Use aggregation pipeline for optimized grouping
    const pipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $lookup: {
          from: 'equipment',
          localField: 'equipment',
          foreignField: '_id',
          as: 'equipment',
        },
      },
      { $unwind: { path: '$equipment', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'maintenanceteams',
          localField: 'maintenanceTeam',
          foreignField: '_id',
          as: 'maintenanceTeam',
        },
      },
      { $unwind: { path: '$maintenanceTeam', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTechnician',
          foreignField: '_id',
          as: 'assignedTechnician',
        },
      },
      { $unwind: { path: '$assignedTechnician', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          requestNumber: 1,
          subject: 1,
          description: 1,
          requestType: 1,
          status: 1,
          scheduledDate: 1,
          durationHours: 1,
          createdAt: 1,
          'equipment._id': 1,
          'equipment.name': 1,
          'equipment.serialNumber': 1,
          'maintenanceTeam._id': 1,
          'maintenanceTeam.teamName': 1,
          'assignedTechnician._id': 1,
          'assignedTechnician.name': 1,
          'assignedTechnician.avatar': 1,
        },
      },
      {
        $group: {
          _id: '$status',
          requests: { $push: '$$ROOT' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const results = await MaintenanceRequest.aggregate(pipeline);

    // Format response with all status columns
    const kanban = {
      New: { requests: [], count: 0 },
      'In Progress': { requests: [], count: 0 },
      Repaired: { requests: [], count: 0 },
      Scrap: { requests: [], count: 0 },
    };

    // Populate with results
    results.forEach((result) => {
      if (kanban[result._id]) {
        kanban[result._id] = {
          requests: result.requests,
          count: result.count,
        };
      }
    });

    res.json({
      status: 'success',
      data: { kanban },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get request by ID
// @route   GET /api/requests/:id
// @access  Private
exports.getRequestById = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('equipment assignedTeam assignedTechnicians createdBy closedBy');

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found',
      });
    }

    res.json({
      status: 'success',
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res, next) => {
  try {
    const requestData = { ...req.body, createdBy: req.user.id };

    // BUSINESS RULE: Only managers can create Preventive Maintenance
    if (requestData.requestType === 'Preventive') {
      if (req.user.role !== USER_ROLES.ADMIN && req.user.role !== USER_ROLES.MANAGER) {
        return res.status(403).json({
          status: 'error',
          message: 'Only managers can create Preventive Maintenance requests',
        });
      }

      // BUSINESS RULE: Preventive Maintenance requires scheduledDate
      if (!requestData.scheduledDate) {
        return res.status(400).json({
          status: 'error',
          message: 'Preventive Maintenance requires a scheduled date',
        });
      }

      // Validate scheduledDate is in the future
      if (new Date(requestData.scheduledDate) <= new Date()) {
        return res.status(400).json({
          status: 'error',
          message: 'Scheduled date must be in the future',
        });
      }
    }

    // BUSINESS RULE: Corrective Maintenance - any user can create
    // Status defaults to "New" (set in schema)

    // Auto-fetch maintenance team and default technician from equipment
    if (requestData.equipment) {
      const equipment = await Equipment.findById(requestData.equipment);

      if (!equipment) {
        return res.status(404).json({
          status: 'error',
          message: 'Equipment not found',
        });
      }

      // Check if equipment is already scrapped
      if (equipment.isScrapped) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot create request for scrapped equipment',
        });
      }

      // Auto-populate team and technician from equipment
      // Normal users cannot override, only admins and managers can
      const canOverride = req.user.role === USER_ROLES.ADMIN || req.user.role === USER_ROLES.MANAGER;

      if (!requestData.maintenanceTeam || !canOverride) {
        requestData.maintenanceTeam = equipment.maintenanceTeam;
      }

      if (!requestData.assignedTechnician || !canOverride) {
        requestData.assignedTechnician = equipment.defaultTechnician;
      }
    }

    // Ensure status starts as "New" for all new requests
    requestData.status = REQUEST_STATUS.NEW;

    const request = await MaintenanceRequest.create(requestData);

    // Populate for response
    await request.populate('equipment maintenanceTeam assignedTechnician createdBy');

    await logAudit({
      user: req.user.id,
      action: AUDIT_ACTIONS.CREATE,
      resource: 'MaintenanceRequest',
      resourceId: request._id,
      description: `Created ${requestData.requestType} maintenance request ${request.requestNumber}`,
    });

    // Notify assigned technician if any
    if (request.assignedTechnician) {
      await createNotification({
        recipient: request.assignedTechnician,
        type: NOTIFICATION_TYPES.REQUEST_ASSIGNED,
        title: 'New Maintenance Request',
        message: `New ${requestData.requestType} request ${request.requestNumber} has been assigned to you`,
        relatedRequest: request._id,
      });
    }

    res.status(201).json({
      status: 'success',
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private
exports.updateRequest = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found',
      });
    }

    await logAudit({
      user: req.user.id,
      action: AUDIT_ACTIONS.UPDATE,
      resource: 'MaintenanceRequest',
      resourceId: request._id,
      description: `Updated maintenance request ${request.requestNumber}`,
    });

    res.json({
      status: 'success',
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update status via Kanban drag & drop
// @route   PATCH /api/requests/:id/kanban-status
// @access  Private (Technician, Manager, Admin)
exports.updateKanbanStatus = async (req, res, next) => {
  try {
    const { status, position } = req.body;

    const request = await MaintenanceRequest.findById(req.params.id).populate('equipment');

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found',
      });
    }

    // Validate status flow: New → In Progress → Repaired → Scrap
    const validTransitions = {
      [REQUEST_STATUS.NEW]: [REQUEST_STATUS.IN_PROGRESS],
      [REQUEST_STATUS.IN_PROGRESS]: [REQUEST_STATUS.REPAIRED, REQUEST_STATUS.SCRAP],
      [REQUEST_STATUS.REPAIRED]: [REQUEST_STATUS.IN_PROGRESS], // Can reopen if needed
      [REQUEST_STATUS.SCRAP]: [], // Terminal state
    };

    const currentStatus = request.status;
    const allowedNextStatuses = validTransitions[currentStatus] || [];

    // Admins can bypass status flow restrictions
    if (req.user.role !== USER_ROLES.ADMIN && !allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot transition from ${currentStatus} to ${status}. Allowed transitions: ${allowedNextStatuses.join(', ') || 'None'}`,
        currentStatus,
        allowedStatuses: allowedNextStatuses,
      });
    }

    // Check if user can mark as Repaired (technicians only)
    if (status === REQUEST_STATUS.REPAIRED) {
      if (req.user.role !== USER_ROLES.ADMIN && req.user.role !== USER_ROLES.TECHNICIAN) {
        return res.status(403).json({
          status: 'error',
          message: 'Only technicians can mark requests as Repaired',
        });
      }
    }

    // Add to status history
    request.statusHistory.push({
      status,
      changedBy: req.user.id,
      changedAt: Date.now(),
      notes: `Status updated via Kanban drag & drop${position ? ` to position ${position}` : ''}`,
    });

    const previousStatus = request.status;
    request.status = status;

    // Update timestamps based on status transitions
    if (status === REQUEST_STATUS.IN_PROGRESS && !request.startedAt) {
      request.startedAt = Date.now();
    }

    if (status === REQUEST_STATUS.REPAIRED || status === REQUEST_STATUS.SCRAP) {
      if (!request.completedAt) {
        request.completedAt = Date.now();
      }
    }

    // If reopening from Repaired to In Progress, clear completed timestamp
    if (previousStatus === REQUEST_STATUS.REPAIRED && status === REQUEST_STATUS.IN_PROGRESS) {
      request.completedAt = null;
    }

    await request.save();

    // If status is Scrap, automatically mark equipment as scrapped
    if (status === REQUEST_STATUS.SCRAP && request.equipment) {
      await Equipment.findByIdAndUpdate(request.equipment._id, {
        isScrapped: true,
      });

      await logAudit({
        user: req.user.id,
        action: AUDIT_ACTIONS.UPDATE,
        resource: 'Equipment',
        resourceId: request.equipment._id,
        description: `Equipment ${request.equipment.name} marked as scrapped due to request ${request.requestNumber}`,
      });
    }

    await logAudit({
      user: req.user.id,
      action: AUDIT_ACTIONS.STATUS_CHANGE,
      resource: 'MaintenanceRequest',
      resourceId: request._id,
      description: `Status changed from ${previousStatus} to ${status} via Kanban`,
    });

    // Create notification for assigned technician
    if (request.assignedTechnician) {
      await createNotification({
        recipient: request.assignedTechnician,
        type: NOTIFICATION_TYPES.REQUEST_STATUS_CHANGED,
        title: 'Request Status Updated',
        message: `Request ${request.requestNumber} status changed to ${status}`,
        relatedRequest: request._id,
      });
    }

    // Return lightweight response for quick UI update
    res.json({
      status: 'success',
      data: {
        request: {
          _id: request._id,
          requestNumber: request.requestNumber,
          status: request.status,
          startedAt: request.startedAt,
          completedAt: request.completedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id/status
// @access  Private
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const request = await MaintenanceRequest.findById(req.params.id).populate('equipment');

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found',
      });
    }

    // Validate status flow: New → In Progress → Repaired → Scrap
    const validTransitions = {
      [REQUEST_STATUS.NEW]: [REQUEST_STATUS.IN_PROGRESS],
      [REQUEST_STATUS.IN_PROGRESS]: [REQUEST_STATUS.REPAIRED, REQUEST_STATUS.SCRAP],
      [REQUEST_STATUS.REPAIRED]: [REQUEST_STATUS.IN_PROGRESS], // Can reopen if needed
      [REQUEST_STATUS.SCRAP]: [], // Terminal state
    };

    const currentStatus = request.status;
    const allowedNextStatuses = validTransitions[currentStatus] || [];

    // Admins can bypass status flow restrictions
    if (req.user.role !== USER_ROLES.ADMIN && !allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot transition from ${currentStatus} to ${status}. Allowed transitions: ${allowedNextStatuses.join(', ') || 'None'}`,
      });
    }

    // Add to status history
    request.statusHistory.push({
      status,
      changedBy: req.user.id,
      notes,
    });

    request.status = status;

    // Update timestamps based on status
    if (status === REQUEST_STATUS.IN_PROGRESS && !request.startedAt) {
      request.startedAt = Date.now();
    }
    if (status === REQUEST_STATUS.REPAIRED || status === REQUEST_STATUS.SCRAP) {
      request.completedAt = Date.now();
    }

    await request.save();

    // If status is Scrap, automatically mark equipment as scrapped
    if (status === REQUEST_STATUS.SCRAP && request.equipment) {
      await Equipment.findByIdAndUpdate(request.equipment._id, {
        isScrapped: true,
      });

      await logAudit({
        user: req.user.id,
        action: AUDIT_ACTIONS.UPDATE,
        resource: 'Equipment',
        resourceId: request.equipment._id,
        description: `Equipment ${request.equipment.name} marked as scrapped due to request ${request.requestNumber}`,
      });
    }

    // Create notification for assigned technician
    if (request.assignedTechnician) {
      await createNotification({
        recipient: request.assignedTechnician,
        type: NOTIFICATION_TYPES.REQUEST_STATUS_CHANGED,
        title: 'Request Status Updated',
        message: `Request ${request.requestNumber} status changed to ${status}`,
        relatedRequest: request._id,
      });
    }

    res.json({
      status: 'success',
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign request
// @route   POST /api/requests/:id/assign
// @access  Private (Admin, Manager)
exports.assignRequest = async (req, res, next) => {
  try {
    const { maintenanceTeam, assignedTechnician } = req.body;

    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      { maintenanceTeam, assignedTechnician },
      { new: true },
    ).populate('maintenanceTeam assignedTechnician');

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found',
      });
    }

    await logAudit({
      user: req.user.id,
      action: AUDIT_ACTIONS.ASSIGNMENT,
      resource: 'MaintenanceRequest',
      resourceId: request._id,
      description: `Assigned request ${request.requestNumber} to technician`,
    });

    // Notify assigned technician
    if (assignedTechnician) {
      await createNotification({
        recipient: assignedTechnician,
        type: NOTIFICATION_TYPES.REQUEST_ASSIGNED,
        title: 'New Request Assigned',
        message: `You have been assigned to ${request.requestNumber}`,
        relatedRequest: request._id,
      });
    }

    res.json({
      status: 'success',
      data: { request },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment
// @route   POST /api/requests/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      request: req.params.id,
      author: req.user.id,
      content: req.body.content,
      isInternal: req.body.isInternal,
    });

    await comment.populate('author');

    res.status(201).json({
      status: 'success',
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments
// @route   GET /api/requests/:id/comments
// @access  Private
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ request: req.params.id })
      .populate('author')
      .sort('createdAt');

    res.json({
      status: 'success',
      data: { comments },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get equipment maintenance statistics
// @route   GET /api/requests/equipment/:equipmentId/stats
// @access  Private
exports.getEquipmentStats = async (req, res, next) => {
  try {
    const { equipmentId } = req.params;

    // Convert to ObjectId for aggregation
    const equipmentObjectId = new mongoose.Types.ObjectId(equipmentId);

    // Optimized aggregation query with equipment filter
    const stats = await MaintenanceRequest.aggregate([
      { $match: { equipment: equipmentObjectId } },
      {
        $facet: {
          totalRequests: [{ $count: 'count' }],
          openRequests: [
            {
              $match: {
                status: { $in: ['New', 'In Progress'] },
              },
            },
            { $count: 'count' },
          ],
          repairedRequests: [
            { $match: { status: 'Repaired' } },
            { $count: 'count' },
          ],
          scrappedRequests: [
            { $match: { status: 'Scrap' } },
            { $count: 'count' },
          ],
          preventiveRequests: [
            { $match: { requestType: 'Preventive' } },
            { $count: 'count' },
          ],
          correctiveRequests: [
            { $match: { requestType: 'Corrective' } },
            { $count: 'count' },
          ],
        },
      },
      {
        $project: {
          totalRequests: { $arrayElemAt: ['$totalRequests.count', 0] },
          openRequests: { $arrayElemAt: ['$openRequests.count', 0] },
          repairedRequests: { $arrayElemAt: ['$repairedRequests.count', 0] },
          scrappedRequests: { $arrayElemAt: ['$scrappedRequests.count', 0] },
          preventiveRequests: { $arrayElemAt: ['$preventiveRequests.count', 0] },
          correctiveRequests: { $arrayElemAt: ['$correctiveRequests.count', 0] },
        },
      },
    ]);

    // Return stats with default values of 0 if no requests found
    const result = stats[0] || {};

    res.json({
      status: 'success',
      data: {
        totalRequests: result.totalRequests || 0,
        openRequests: result.openRequests || 0,
        repairedRequests: result.repairedRequests || 0,
        scrappedRequests: result.scrappedRequests || 0,
        preventiveRequests: result.preventiveRequests || 0,
        correctiveRequests: result.correctiveRequests || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests per maintenance team (aggregation)
// @route   GET /api/requests/analytics/by-team
// @access  Private
exports.getRequestsByTeam = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter if provided
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const pipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: '$maintenanceTeam',
          totalRequests: { $sum: 1 },
          newRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] },
          },
          inProgressRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] },
          },
          repairedRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'Repaired'] }, 1, 0] },
          },
          scrappedRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'Scrap'] }, 1, 0] },
          },
          correctiveRequests: {
            $sum: { $cond: [{ $eq: ['$requestType', 'Corrective'] }, 1, 0] },
          },
          preventiveRequests: {
            $sum: { $cond: [{ $eq: ['$requestType', 'Preventive'] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'maintenanceteams',
          localField: '_id',
          foreignField: '_id',
          as: 'team',
        },
      },
      { $unwind: { path: '$team', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          teamName: '$team.teamName',
          totalRequests: 1,
          newRequests: 1,
          inProgressRequests: 1,
          repairedRequests: 1,
          scrappedRequests: 1,
          correctiveRequests: 1,
          preventiveRequests: 1,
        },
      },
      { $sort: { totalRequests: -1 } },
    ];

    const results = await MaintenanceRequest.aggregate(pipeline);

    res.json({
      status: 'success',
      data: results.map((item) => ({
        teamId: item._id,
        teamName: item.teamName || 'Unassigned',
        totalRequests: item.totalRequests,
        newRequests: item.newRequests,
        inProgressRequests: item.inProgressRequests,
        repairedRequests: item.repairedRequests,
        scrappedRequests: item.scrappedRequests,
        correctiveRequests: item.correctiveRequests,
        preventiveRequests: item.preventiveRequests,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get breakdowns per equipment (aggregation)
// @route   GET /api/requests/analytics/by-equipment
// @access  Private
exports.getBreakdownsByEquipment = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 20 } = req.query;

    // Build date filter if provided
    const matchStage = {
      requestType: 'Corrective', // Breakdowns are corrective requests
    };
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$equipment',
          breakdownCount: { $sum: 1 },
          newBreakdowns: {
            $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] },
          },
          inProgressBreakdowns: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] },
          },
          repairedBreakdowns: {
            $sum: { $cond: [{ $eq: ['$status', 'Repaired'] }, 1, 0] },
          },
          scrappedBreakdowns: {
            $sum: { $cond: [{ $eq: ['$status', 'Scrap'] }, 1, 0] },
          },
          lastBreakdown: { $max: '$createdAt' },
        },
      },
      {
        $lookup: {
          from: 'equipment',
          localField: '_id',
          foreignField: '_id',
          as: 'equipment',
        },
      },
      { $unwind: { path: '$equipment', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          equipmentName: '$equipment.name',
          serialNumber: '$equipment.serialNumber',
          department: '$equipment.department',
          location: '$equipment.location',
          isScrapped: '$equipment.isScrapped',
          breakdownCount: 1,
          newBreakdowns: 1,
          inProgressBreakdowns: 1,
          repairedBreakdowns: 1,
          scrappedBreakdowns: 1,
          lastBreakdown: 1,
        },
      },
      { $sort: { breakdownCount: -1 } },
      { $limit: parseInt(limit, 10) },
    ];

    const results = await MaintenanceRequest.aggregate(pipeline);

    res.json({
      status: 'success',
      data: results.map((item) => ({
        equipmentId: item._id,
        equipmentName: item.equipmentName || 'Unknown Equipment',
        serialNumber: item.serialNumber,
        department: item.department,
        location: item.location,
        isScrapped: item.isScrapped,
        breakdownCount: item.breakdownCount,
        newBreakdowns: item.newBreakdowns,
        inProgressBreakdowns: item.inProgressBreakdowns,
        repairedBreakdowns: item.repairedBreakdowns,
        scrappedBreakdowns: item.scrappedBreakdowns,
        lastBreakdown: item.lastBreakdown,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Admin, Manager)
exports.deleteRequest = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found',
      });
    }

    res.json({
      status: 'success',
      message: 'Request deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
