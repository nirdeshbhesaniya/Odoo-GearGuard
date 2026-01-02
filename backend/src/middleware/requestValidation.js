const { body, validationResult } = require('express-validator');

/**
 * Validation rules for creating Corrective Maintenance request
 */
exports.validateCorrectiveRequest = [
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),

  body('equipment')
    .notEmpty()
    .withMessage('Equipment is required')
    .isMongoId()
    .withMessage('Invalid equipment ID'),

  body('requestType')
    .equals('Corrective')
    .withMessage('Request type must be Corrective'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('durationHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Duration must be a positive number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

/**
 * Validation rules for creating Preventive Maintenance request
 */
exports.validatePreventiveRequest = [
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),

  body('equipment')
    .notEmpty()
    .withMessage('Equipment is required')
    .isMongoId()
    .withMessage('Invalid equipment ID'),

  body('requestType')
    .equals('Preventive')
    .withMessage('Request type must be Preventive'),

  body('scheduledDate')
    .notEmpty()
    .withMessage('Scheduled date is required for Preventive Maintenance')
    .isISO8601()
    .withMessage('Scheduled date must be a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Scheduled date must be in the future');
      }
      return true;
    }),

  body('durationHours')
    .notEmpty()
    .withMessage('Duration is required for Preventive Maintenance')
    .isFloat({ min: 0.5, max: 24 })
    .withMessage('Duration must be between 0.5 and 24 hours'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

/**
 * Validation rules for updating request status
 */
exports.validateStatusUpdate = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['New', 'In Progress', 'Repaired', 'Scrap'])
    .withMessage('Invalid status value'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

/**
 * Validation rules for assigning request
 */
exports.validateAssignment = [
  body('maintenanceTeam')
    .optional()
    .isMongoId()
    .withMessage('Invalid maintenance team ID'),

  body('assignedTechnician')
    .optional()
    .isMongoId()
    .withMessage('Invalid technician ID'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    // At least one field must be provided
    if (!req.body.maintenanceTeam && !req.body.assignedTechnician) {
      return res.status(400).json({
        status: 'error',
        message: 'Either maintenanceTeam or assignedTechnician must be provided',
      });
    }

    next();
  },
];
