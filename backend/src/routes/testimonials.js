// backend/src/routes/testimonials.js
import express from 'express';
import { validationResult } from 'express-validator';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';
import { contactLimiter, adminLimiter } from '../middleware/rateLimit.js';
import { validateTestimonial } from '../middleware/validation.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Get approved testimonials (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testimonials WHERE is_approved = $1 ORDER BY created_at DESC',
      [true]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

// Submit testimonial (public) - WITH SECURITY
router.post('/',
  contactLimiter,
  validateTestimonial,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { client_name, client_company, client_image, rating, feedback } = req.body;
    
    try {
      const result = await pool.query(
        'INSERT INTO testimonials (client_name, client_company, client_image, rating, feedback) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [client_name, client_company || '', client_image || '', rating || 5, feedback]
      );
      res.status(201).json({ 
        message: 'Testimonial submitted for approval', 
        id: result.rows[0].id 
      });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      res.status(500).json({ message: 'Failed to submit testimonial' });
    }
  }
);

// ============================================
// ADMIN ROUTES (Require auth)
// ============================================

// Get all testimonials (admin only)
router.get('/all', auth, adminLimiter, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

// Approve testimonial (admin only)
router.put('/:id/approve', auth, adminLimiter, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE testimonials SET is_approved = $1 WHERE id = $2',
      [true, req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial approved' });
  } catch (error) {
    console.error('Error approving testimonial:', error);
    res.status(500).json({ message: 'Failed to approve testimonial' });
  }
});

// Delete testimonial (admin only)
router.delete('/:id', auth, adminLimiter, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ message: 'Failed to delete testimonial' });
  }
});

export default router;