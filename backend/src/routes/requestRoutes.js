const express = require('express');
const requestController = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/auth');
const {
  canAssignTechnician,
  canMarkAsRepaired,
  canViewAllRequests,
} = require('../middleware/roleChecks');
const {
  validateCorrectiveRequest,
  validatePreventiveRequest,
  validateStatusUpdate,
  validateAssignment,
} = require('../middleware/requestValidation');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @swagger
 * /requests:
 *   get:
 *     tags: [Maintenance Requests]
 *     summary: Get all maintenance requests
 *     security:
 *       - bearerAuth: []
 */
router.get('/', canViewAllRequests, requestController.getRequests);
router.get('/kanban', canViewAllRequests, requestController.getKanbanBoard);
router.get('/analytics/by-team', requestController.getRequestsByTeam);
router.get('/analytics/by-equipment', requestController.getBreakdownsByEquipment);
router.get('/equipment/:equipmentId/stats', requestController.getEquipmentStats);
router.get('/:id', requestController.getRequestById);

// Kanban drag & drop status update (optimized endpoint)
router.patch(
  '/:id/kanban-status',
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.TECHNICIAN),
  canMarkAsRepaired,
  requestController.updateKanbanStatus,
);

// Create Corrective Maintenance (any user can create)
router.post(
  '/corrective',
  validateCorrectiveRequest,
  requestController.createRequest,
);

// Create Preventive Maintenance (only managers)
router.post(
  '/preventive',
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  validatePreventiveRequest,
  requestController.createRequest,
);

// Generic create endpoint (with validation in controller)
router.post('/', requestController.createRequest);

// Only admins and managers can update or delete
router.put('/:id', authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER), requestController.updateRequest);
router.delete('/:id', authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER), requestController.deleteRequest);

// Only managers can assign technicians
router.post('/:id/assign', canAssignTechnician, validateAssignment, requestController.assignRequest);

// Only technicians (and admins) can update status, with special check for "Repaired" status
router.patch(
  '/:id/status',
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.TECHNICIAN),
  validateStatusUpdate,
  canMarkAsRepaired,
  requestController.updateStatus,
);

// Anyone can comment
router.post('/:id/comments', requestController.addComment);
router.get('/:id/comments', requestController.getComments);

module.exports = router;
