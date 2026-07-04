// frontend/src/utils/api.js
import axios from 'axios';
import { secureStorage } from './security.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

// ============================================
// AUTHENTICATED API CLIENT (with interceptors)
// ============================================

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for authenticated routes
apiClient.interceptors.request.use(
  (config) => {
    const token = secureStorage.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      secureStorage.remove('auth_token');
      secureStorage.remove('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// PUBLIC API CLIENT (NO INTERCEPTORS)
// ============================================

const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1200000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ============================================
// API HELPER FUNCTIONS
// ============================================

export const api = {
  // ============================================
  // AUTH
  // ============================================
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

  // ============================================
  // PROJECTS
  // ============================================
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

  // ============================================
  // SERVICE PAGES API
  // ============================================
  getServiceData: async (serviceId) => {
    const response = await publicApiClient.get(`/api/services/${serviceId}`);
    return response.data;
  },
  getServiceList: async () => {
    const response = await publicApiClient.get('/api/services/list');
    return response.data;
  },

  // ============================================
  // TESTIMONIALS
  // ============================================
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

  // ============================================
  // CONTACT
  // ============================================
  submitContact: (data) => {
    return publicApiClient.post('/api/contact', data);
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

  // ============================================
  // TOOLS
  // ============================================
  // Resume Builder
  buildResume: (data) => {
    return apiClient.post('/api/tools/resume-builder', data);
  },
  
  // Cover Letter
  generateCoverLetter: (data) => {
    return apiClient.post('/api/tools/cover-letter', data);
  },
  
  // QR Generator
  generateQR: (data) => {
    return apiClient.post('/api/tools/qr-generator', data);
  },
  
  // PDF to Image
  pdfToImage: (formData) => {
    return apiClient.post('/api/tools/pdf-to-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // PDF to Word
  pdfToWord: (formData) => {
    return apiClient.post('/api/tools/pdf-to-word', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // PDF to Excel
  pdfToExcel: (formData) => {
    return apiClient.post('/api/tools/pdf-to-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Image to PDF
  imageToPdf: (formData) => {
    return apiClient.post('/api/tools/image-to-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // PDF Compressor
  compressPdf: (formData) => {
    return apiClient.post('/api/tools/pdf-compressor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Merge PDF
  mergePdf: (formData) => {
    return apiClient.post('/api/tools/merge-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Split PDF
  splitPdf: (formData) => {
    return apiClient.post('/api/tools/split-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Image Resizer
  imageResizer: (formData) => {
    return apiClient.post('/api/tools/image-resizer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Text to PDF
  textToPdf: (data) => {
    return apiClient.post('/api/tools/text-to-pdf', data);
  },
  
  // ============================================
  // PAYMENT METHODS
  // ============================================
  
  createRazorpayOrder: (data) => {
    return apiClient.post('/api/create-razorpay-order', data);
  },
  
  verifyRazorpayPayment: (data) => {
    return apiClient.post('/api/verify-razorpay-payment', data);
  },
  
  checkPremium: () => {
    const user = secureStorage.get('user');
    const userId = user?.id || '';
    return apiClient.get(`/api/premium/check?user_id=${userId}`);
  },
  
  checkPremiumStatus: () => {
    const user = secureStorage.get('user');
    const userId = user?.id || '';
    return apiClient.get(`/api/premium/check?user_id=${userId}`);
  },
  
  getPremiumStatus: (userId) => {
    return apiClient.get(`/api/premium/check?user_id=${userId}`);
  },

  // ============================================
  // HEALTH
  // ============================================
  healthCheck: () => {
    return apiClient.get('/api/health');
  }
};

export default apiClient;