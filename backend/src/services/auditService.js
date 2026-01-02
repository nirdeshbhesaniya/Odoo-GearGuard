const AuditLog = require('../models/AuditLog');

/**
 * Log audit trail
 * @param {Object} data - Audit log data
 */
exports.logAudit = async (data) => {
  try {
    const auditLog = await AuditLog.create(data);
    return auditLog;
  } catch (error) {
    console.error('Error logging audit:', error);
    throw error;
  }
};

/**
 * Get audit logs for a resource
 * @param {String} resource - Resource type
 * @param {String} resourceId - Resource ID
 */
exports.getAuditLogs = async (resource, resourceId) => {
  try {
    const logs = await AuditLog.find({ resource, resourceId })
      .populate('user')
      .sort('-createdAt');
    return logs;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};
