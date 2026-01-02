import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (email, otp, newPassword) => {
    const response = await api.post('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  },
};

export const userService = {
  getUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await api.put('/users/password', data);
    return response.data;
  },
};

export const equipmentService = {
  getEquipment: async (params) => {
    const response = await api.get('/equipment', { params });
    return response.data;
  },

  getEquipmentById: async (id) => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },

  createEquipment: async (data) => {
    const response = await api.post('/equipment', data);
    return response.data;
  },

  updateEquipment: async (id, data) => {
    const response = await api.put(`/equipment/${id}`, data);
    return response.data;
  },

  deleteEquipment: async (id) => {
    const response = await api.delete(`/equipment/${id}`);
    return response.data;
  },

  getMaintenanceHistory: async (id) => {
    const response = await api.get(`/equipment/${id}/history`);
    return response.data;
  },
};

export const requestService = {
  getRequests: async (params) => {
    const response = await api.get('/requests', { params });
    return response.data;
  },

  getKanban: async (params) => {
    const response = await api.get('/requests/kanban', { params });
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  createCorrectiveRequest: async (data) => {
    const response = await api.post('/requests/corrective', data);
    return response.data;
  },

  createPreventiveRequest: async (data) => {
    const response = await api.post('/requests/preventive', data);
    return response.data;
  },

  createRequest: async (data) => {
    // Use specific endpoint based on requestType
    if (data.requestType === 'Preventive') {
      return requestService.createPreventiveRequest(data);
    }
    return requestService.createCorrectiveRequest(data);
  },

  updateRequest: async (id, data) => {
    const response = await api.put(`/requests/${id}`, data);
    return response.data;
  },

  updateStatus: async (id, data) => {
    const response = await api.patch(`/requests/${id}/status`, data);
    return response.data;
  },

  updateKanbanStatus: async (id, data) => {
    const response = await api.patch(`/requests/${id}/kanban-status`, data);
    return response.data;
  },

  assignRequest: async (id, data) => {
    const response = await api.post(`/requests/${id}/assign`, data);
    return response.data;
  },

  addComment: async (id, data) => {
    const response = await api.post(`/requests/${id}/comments`, data);
    return response.data;
  },

  getComments: async (id) => {
    const response = await api.get(`/requests/${id}/comments`);
    return response.data;
  },

  deleteRequest: async (id) => {
    const response = await api.delete(`/requests/${id}`);
    return response.data;
  },

  getRequestsByTeam: async (params) => {
    const response = await api.get('/requests/analytics/by-team', { params });
    return response.data;
  },

  getBreakdownsByEquipment: async (params) => {
    const response = await api.get('/requests/analytics/by-equipment', { params });
    return response.data;
  },

  getEquipmentStats: async (equipmentId) => {
    const response = await api.get(`/requests/equipment/${equipmentId}/stats`);
    return response.data;
  },
};

export const teamService = {
  getTeams: async (params) => {
    const response = await api.get('/teams', { params });
    return response.data;
  },

  getTeamById: async (id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },

  createTeam: async (data) => {
    const response = await api.post('/teams', data);
    return response.data;
  },

  updateTeam: async (id, data) => {
    const response = await api.put(`/teams/${id}`, data);
    return response.data;
  },

  deleteTeam: async (id) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },
};

export const calendarService = {
  getEvents: async (params) => {
    const response = await api.get('/calendar/events', { params });
    return response.data;
  },

  getAvailability: async (params) => {
    const response = await api.get('/calendar/availability', { params });
    return response.data;
  },
};

export const dashboardService = {
  getOverview: async () => {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },

  getCharts: async () => {
    const response = await api.get('/dashboard/charts');
    return response.data;
  },
};

export const notificationService = {
  getNotifications: async (params) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};
