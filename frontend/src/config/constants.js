export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  TECHNICIAN: 'technician',
  USER: 'user',
};

// Match backend REQUEST_STATUS - these are the Kanban columns
export const REQUEST_STATUS = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  REPAIRED: 'Repaired',
  SCRAP: 'Scrap',
};

export const REQUEST_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Match backend REQUEST_TYPES
export const REQUEST_TYPES = {
  CORRECTIVE: 'Corrective',
  PREVENTIVE: 'Preventive',
};

export const EQUIPMENT_STATUS = {
  OPERATIONAL: 'operational',
  UNDER_MAINTENANCE: 'under_maintenance',
  OUT_OF_SERVICE: 'out_of_service',
  DECOMMISSIONED: 'decommissioned',
};

// Kanban columns matching backend status
export const KANBAN_COLUMNS = [
  { id: 'New', title: 'New', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100 border-blue-300' },
  { id: 'Repaired', title: 'Repaired', color: 'bg-green-100 border-green-300' },
  { id: 'Scrap', title: 'Scrap', color: 'bg-red-100 border-red-300' },
];

export const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

// Status colors matching backend status values
export const STATUS_COLORS = {
  'New': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Repaired': 'bg-green-100 text-green-800',
  'Scrap': 'bg-red-100 text-red-800',
};
