const { USER_ROLES, REQUEST_STATUS } = require('../config/constants');

/**
 * Check if user can assign technicians to maintenance requests
 * Only managers and admins can assign
 */
exports.canAssignTechnician = (req, res, next) => {
  const { role } = req.user;

  if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.MANAGER) {
    return res.status(403).json({
      status: 'error',
      message: 'Only managers and admins can assign technicians to requests',
    });
  }

  next();
};

/**
 * Check if user can mark request as Repaired
 * Only technicians (and admins) can mark as Repaired
 */
exports.canMarkAsRepaired = (req, res, next) => {
  const { role } = req.user;
  const { status } = req.body;

  // If trying to set status to "Repaired"
  if (status === REQUEST_STATUS.REPAIRED) {
    if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.TECHNICIAN) {
      return res.status(403).json({
        status: 'error',
        message: 'Only technicians can mark requests as Repaired',
      });
    }
  }

  next();
};

/**
 * Check if user can update equipment
 * Only managers and admins can update equipment
 */
exports.canManageEquipment = (req, res, next) => {
  const { role } = req.user;

  if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.MANAGER) {
    return res.status(403).json({
      status: 'error',
      message: 'Only managers and admins can manage equipment',
    });
  }

  next();
};

/**
 * Check if user can manage teams
 * Only admins can manage teams
 */
exports.canManageTeams = (req, res, next) => {
  const { role } = req.user;

  if (role !== USER_ROLES.ADMIN) {
    return res.status(403).json({
      status: 'error',
      message: 'Only admins can manage teams',
    });
  }

  next();
};

/**
 * Check if user can manage other users
 * Only admins can manage users
 */
exports.canManageUsers = (req, res, next) => {
  const { role } = req.user;

  if (role !== USER_ROLES.ADMIN) {
    return res.status(403).json({
      status: 'error',
      message: 'Only admins can manage users',
    });
  }

  next();
};

/**
 * Check if user can view all requests
 * Technicians can only see their assigned requests
 */
exports.canViewAllRequests = (req, res, next) => {
  const { role } = req.user;

  // If user is technician, filter to only their assigned requests
  if (role === USER_ROLES.TECHNICIAN) {
    req.query.assignedTechnician = req.user.id;
  }

  next();
};
