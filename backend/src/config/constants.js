// User Roles
const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  TECHNICIAN: 'technician',
  USER: 'user',
};

// Request Types
const REQUEST_TYPES = {
  CORRECTIVE: 'Corrective',
  PREVENTIVE: 'Preventive',
};

// Request Status (Kanban Columns)
const REQUEST_STATUS = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  REPAIRED: 'Repaired',
  SCRAP: 'Scrap',
};

// Request Priority
const REQUEST_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Equipment Status
const EQUIPMENT_STATUS = {
  OPERATIONAL: 'operational',
  UNDER_MAINTENANCE: 'under_maintenance',
  OUT_OF_SERVICE: 'out_of_service',
  DECOMMISSIONED: 'decommissioned',
};

// Notification Types
const NOTIFICATION_TYPES = {
  REQUEST_ASSIGNED: 'request_assigned',
  REQUEST_STATUS_CHANGED: 'request_status_changed',
  REQUEST_COMMENT: 'request_comment',
  MAINTENANCE_DUE: 'maintenance_due',
  EQUIPMENT_STATUS_CHANGED: 'equipment_status_changed',
  TEAM_ASSIGNMENT: 'team_assignment',
};

// Audit Action Types
const AUDIT_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  STATUS_CHANGE: 'status_change',
  ASSIGNMENT: 'assignment',
};

// SLA Time Limits (in hours)
const SLA_LIMITS = {
  [REQUEST_PRIORITY.CRITICAL]: 4,
  [REQUEST_PRIORITY.HIGH]: 24,
  [REQUEST_PRIORITY.MEDIUM]: 72,
  [REQUEST_PRIORITY.LOW]: 168,
};

module.exports = {
  USER_ROLES,
  REQUEST_TYPES,
  REQUEST_STATUS,
  REQUEST_PRIORITY,
  EQUIPMENT_STATUS,
  NOTIFICATION_TYPES,
  AUDIT_ACTIONS,
  SLA_LIMITS,
};
