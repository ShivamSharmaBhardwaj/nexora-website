// frontend/src/utils/validation.js
import { 
  sanitizeInput, 
  isValidEmail, 
  isValidPhone, 
  isValidName, 
  isValidMessage,
  isValidPassword
} from './security.js';

// ============================================
// FORM VALIDATION RULES
// ============================================

export const validationRules = {
  // Contact form
  contact: {
    name: {
      required: true,
      validate: (value) => {
        if (!value || value.trim().length < 2) return 'Name is required';
        if (!isValidName(value)) return 'Name contains invalid characters';
        return null;
      }
    },
    email: {
      required: true,
      validate: (value) => {
        if (!value) return 'Email is required';
        if (!isValidEmail(value)) return 'Please enter a valid email';
        return null;
      }
    },
    phone: {
      required: false,
      validate: (value) => {
        if (value && !isValidPhone(value)) return 'Invalid phone number';
        return null;
      }
    },
    message: {
      required: true,
      validate: (value) => {
        if (!value || value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.trim().length > 5000) return 'Message is too long (max 5000 characters)';
        return null;
      }
    },
    subject: {
      required: false,
      validate: (value) => {
        if (value && value.trim().length > 200) return 'Subject is too long (max 200 characters)';
        return null;
      }
    }
  },

  // Login form
  login: {
    email: {
      required: true,
      validate: (value) => {
        if (!value) return 'Email is required';
        if (!isValidEmail(value)) return 'Please enter a valid email';
        return null;
      }
    },
    password: {
      required: true,
      validate: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      }
    }
  },

  // Testimonial form
  testimonial: {
    client_name: {
      required: true,
      validate: (value) => {
        if (!value || value.trim().length < 2) return 'Name is required';
        if (!isValidName(value)) return 'Name contains invalid characters';
        return null;
      }
    },
    feedback: {
      required: true,
      validate: (value) => {
        if (!value || value.trim().length < 10) return 'Feedback must be at least 10 characters';
        if (value.trim().length > 2000) return 'Feedback is too long (max 2000 characters)';
        return null;
      }
    },
    rating: {
      required: false,
      validate: (value) => {
        const num = Number(value);
        if (!isNaN(num) && (num < 1 || num > 5)) return 'Rating must be between 1 and 5';
        return null;
      }
    }
  },

  // Admin form (project)
  project: {
    title: {
      required: true,
      validate: (value) => {
        if (!value || value.trim().length < 2) return 'Title is required';
        return null;
      }
    },
    category: {
      required: true,
      validate: (value) => {
        if (!value || value.trim().length < 2) return 'Category is required';
        return null;
      }
    },
    description: {
      required: true,
      validate: (value) => {
        if (!value || value.trim().length < 10) return 'Description must be at least 10 characters';
        return null;
      }
    }
  }
};

// ============================================
// VALIDATION HELPER FUNCTIONS
// ============================================

/**
 * Validate a single field
 */
export const validateField = (fieldName, value, formType) => {
  const rules = validationRules[formType];
  if (!rules || !rules[fieldName]) return null;
  
  const rule = rules[fieldName];
  const sanitized = typeof value === 'string' ? sanitizeInput(value) : value;
  
  // Check required
  if (rule.required && (!sanitized || (typeof sanitized === 'string' && sanitized.trim() === ''))) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
  }
  
  // Custom validation
  if (rule.validate) {
    return rule.validate(sanitized);
  }
  
  return null;
};

/**
 * Validate entire form
 */
export const validateForm = (data, formType) => {
  const errors = {};
  const rules = validationRules[formType];
  
  if (!rules) return errors;
  
  for (let key in rules) {
    const error = validateField(key, data[key], formType);
    if (error) {
      errors[key] = error;
    }
  }
  
  return errors;
};

/**
 * Check if form is valid
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

/**
 * Sanitize form data before submission
 */
export const prepareFormData = (data) => {
  const sanitized = {};
  for (let key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = sanitizeInput(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }
  return sanitized;
};