// frontend/src/utils/api.js
import axios from 'axios';
import { secureStorage } from './security.js';  // ✅ Remove getCsrfToken import

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

apiClient.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = secureStorage.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ❌ REMOVED CSRF TOKEN SECTION
    
    // Sanitize request data
    if (config.data && ['post', 'put', 'patch'].includes(config.method?.toLowerCase())) {
      if (typeof config.data === 'object') {
        const sanitized = {};
        for (let key in config.data) {
          if (typeof config.data[key] === 'string') {
            sanitized[key] = config.data[key].replace(/<[^>]*>/g, '').trim();
          } else {
            sanitized[key] = config.data[key];
          }
        }
        config.data = sanitized;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      secureStorage.remove('auth_token');
      secureStorage.remove('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    
    if (error.response?.status === 403) {
      console.warn('🔒 Access forbidden');
    }
    
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      console.warn(`⏳ Rate limited. Try again in ${retryAfter} seconds`);
    }
    
    if (!error.response) {
      console.error('🌐 Network error - please check your connection');
      error.message = 'Network error. Please check your internet connection.';
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// API HELPER FUNCTIONS
// ============================================

export const api = {
  // Auth
  login: (email, password) => {
    return apiClient.post('/api/auth/login', { email, password });
  },
  register: (data) => {
    return apiClient.post('/api/auth/register', data);
  },
  logout: () => {
    const token = secureStorage.get('auth_token');
    if (token) {
      return apiClient.post('/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return Promise.resolve();
  },

  // Projects
  getProjects: () => {
    return apiClient.get('/api/projects');
  },
  getProject: (id) => {
    return apiClient.get(`/api/projects/${id}`);
  },
  getProjectsByCategory: (category) => {
    return apiClient.get(`/api/projects/category/${encodeURIComponent(category)}`);
  },
  createProject: (data) => {
    return apiClient.post('/api/projects', data);
  },
  updateProject: (id, data) => {
    return apiClient.put(`/api/projects/${id}`, data);
  },
  deleteProject: (id) => {
    return apiClient.delete(`/api/projects/${id}`);
  },

  // Testimonials
  getTestimonials: () => {
    return apiClient.get('/api/testimonials');
  },
  getAllTestimonials: () => {
    return apiClient.get('/api/testimonials/all');
  },
  submitTestimonial: (data) => {
    return apiClient.post('/api/testimonials', data);
  },
  approveTestimonial: (id) => {
    return apiClient.put(`/api/testimonials/${id}/approve`);
  },
  deleteTestimonial: (id) => {
    return apiClient.delete(`/api/testimonials/${id}`);
  },

  // Contact
  submitContact: (data) => {
    return apiClient.post('/api/contact', data);
  },
  getContacts: () => {
    return apiClient.get('/api/contact');
  },
  markContactRead: (id) => {
    return apiClient.put(`/api/contact/${id}/read`);
  },
  deleteContact: (id) => {
    return apiClient.delete(`/api/contact/${id}`);
  },

  // Health
  healthCheck: () => {
    return apiClient.get('/api/health');
  }
};

export default apiClient;