import axios from 'axios';
import { API_URL } from '../config/constants';
import { showError } from '../utils/toast';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request counter for global loading state
let activeRequests = 0;

// Request interceptor - add auth token and loading state
api.interceptors.request.use(
  (config) => {
    activeRequests++;

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for performance monitoring
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors and success
api.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);

    // Log slow requests in development
    if (process.env.NODE_ENV === 'development') {
      const duration = new Date() - response.config.metadata.startTime;
      if (duration > 3000) {
        console.warn(`Slow API call detected: ${response.config.url} took ${duration}ms`);
      }
    }

    return response;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      showError('Request timeout. Please check your connection.');
    } else if (!error.response) {
      // Network error
      showError('Network error. Please check your connection.');
    } else {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          // Bad request - handled by individual components
          break;
        case 401:
          // Unauthorized - redirect to login
          showError('Your session has expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
          break;
        case 403:
          showError('You do not have permission to perform this action.');
          break;
        case 404:
          // Not found - usually handled by components
          break;
        case 409:
          // Conflict - usually handled by components (duplicate resources)
          break;
        case 422:
          // Validation error - handled by components
          break;
        case 429:
          showError('Too many requests. Please wait a moment and try again.');
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          showError('Server error. Please try again later.');
          break;
        default:
          if (data?.message) {
            showError(data.message);
          } else {
            showError('An unexpected error occurred.');
          }
      }
    }

    return Promise.reject(error);
  },
);

// Export function to check if requests are active
export const hasActiveRequests = () => activeRequests > 0;

// Export function to get active request count
export const getActiveRequestCount = () => activeRequests;

export default api;
