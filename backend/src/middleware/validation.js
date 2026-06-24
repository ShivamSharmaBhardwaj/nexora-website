// backend/src/middleware/validation.js
import { body, validationResult } from 'express-validator';

// Sanitize inputs
export const sanitizeInput = (req, res, next) => {
  for (let key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key]
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
    }
  }
  next();
};

// Validate contact form
export const validateContact = [
  sanitizeInput,
  body('name')
    .notEmpty().withMessage('Name required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .matches(/^[a-zA-Z\s\-']+$/).withMessage('Invalid name format'),
  
  body('email')
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  
  body('message')
    .notEmpty().withMessage('Message required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be 10-5000 characters'),
  
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]{10,15}$/).withMessage('Invalid phone format'),
  
  body('subject')
    .optional()
    .isLength({ max: 200 }).withMessage('Subject too long')
];

// Validate project
export const validateProject = [
  sanitizeInput,
  body('title')
    .notEmpty().withMessage('Title required')
    .isLength({ max: 255 }).withMessage('Title too long'),
  body('category')
    .notEmpty().withMessage('Category required')
    .isLength({ max: 100 }).withMessage('Category too long'),
  body('description')
    .notEmpty().withMessage('Description required'),
  body('short_desc')
    .optional()
    .isLength({ max: 500 }).withMessage('Short description too long'),
  body('demo_url')
    .optional()
    .isURL().withMessage('Invalid demo URL'),
  body('video_url')
    .optional()
    .isURL().withMessage('Invalid video URL'),
  body('image_url')
    .optional()
    .isURL().withMessage('Invalid image URL')
];

// Validate testimonial
export const validateTestimonial = [
  sanitizeInput,
  body('client_name')
    .notEmpty().withMessage('Name required')
    .isLength({ max: 100 }).withMessage('Name too long')
    .matches(/^[a-zA-Z\s\-']+$/).withMessage('Invalid name format'),
  body('feedback')
    .notEmpty().withMessage('Feedback required')
    .isLength({ max: 2000 }).withMessage('Feedback too long'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')
];

// Validate auth
export const validateRegister = [
  sanitizeInput,
  body('name')
    .notEmpty().withMessage('Name required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .matches(/^[a-zA-Z\s\-']+$/).withMessage('Invalid name format'),
  body('email')
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase and number')
];

export const validateLogin = [
  sanitizeInput,
  body('email')
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password required')
];