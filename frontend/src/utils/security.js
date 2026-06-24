// frontend/src/utils/security.js

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Sanitize entire form data object
 */
export const sanitizeFormData = (data) => {
  const sanitized = {};
  for (let key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = sanitizeInput(data[key]);
    } else if (Array.isArray(data[key])) {
      sanitized[key] = data[key].map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
};

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

/**
 * Validate phone number (international format)
 */
export const isValidPhone = (phone) => {
  if (!phone) return true;
  const re = /^[0-9+\-\s()]{10,15}$/;
  return re.test(phone);
};

/**
 * Validate name (letters, spaces, hyphens, apostrophes only)
 */
export const isValidName = (name) => {
  const re = /^[a-zA-Z\s\-']{2,100}$/;
  return re.test(name);
};

/**
 * Validate message (minimum 10 chars, no HTML)
 */
export const isValidMessage = (message) => {
  if (!message) return false;
  const clean = sanitizeInput(message);
  return clean.length >= 10 && clean.length <= 5000;
};

/**
 * Validate URL
 */
export const isValidUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
  if (!password || password.length < 8) return false;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
};

// ============================================
// SECURE STORAGE
// ============================================

/**
 * Secure localStorage with expiration
 */
export const secureStorage = {
  set(key, value, expiresInDays = 7) {
    try {
      const data = {
        value: value,
        expires: Date.now() + expiresInDays * 24 * 60 * 60 * 1000
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  get(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if (!data || data.expires < Date.now()) {
        this.remove(key);
        return null;
      }
      return data.value;
    } catch {
      return null;
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  },
  
  clear() {
    localStorage.clear();
  }
};

// ============================================
// CSRF PROTECTION
// ============================================

/**
 * Generate CSRF token
 */
export const generateCsrfToken = () => {
  const token = crypto.randomUUID ? crypto.randomUUID() : 
    Math.random().toString(36).substring(2, 15) + 
    Math.random().toString(36).substring(2, 15);
  secureStorage.set('csrf_token', token, 1);
  return token;
};

/**
 * Get CSRF token
 */
export const getCsrfToken = () => {
  return secureStorage.get('csrf_token');
};

// ============================================
// CONSOLE SECURITY (Production)
// ============================================

/**
 * Disable console methods in production
 */
export const disableConsoleInProduction = () => {
  if (import.meta.env.PROD) {
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};
    // Keep console.error for debugging
  }
};

/**
 * Detect DevTools (basic)
 */
export const detectDevTools = () => {
  if (import.meta.env.PROD) {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      // DevTools is open
      console.warn('🔒 DevTools detected!');
      // Optional: Redirect or show warning
    }
  }
};

// ============================================
// XSS PROTECTION
// ============================================

/**
 * Escape HTML to prevent XSS
 */
export const escapeHtml = (text) => {
  if (typeof text !== 'string') return text;
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Safe HTML render function
 */
export const safeHtml = (html) => {
  if (typeof html !== 'string') return html;
  return escapeHtml(html);
};