import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get approved testimonials (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM testimonials WHERE is_approved = 1 ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all testimonials (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit testimonial (public)
router.post('/', async (req, res) => {
  const { client_name, client_company, client_image, rating, feedback } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO testimonials (client_name, client_company, client_image, rating, feedback) VALUES (?, ?, ?, ?, ?)',
      [client_name, client_company || '', client_image || '', rating || 5, feedback]
    );
    res.status(201).json({ 
      message: 'Testimonial submitted for approval', 
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve testimonial (admin only)
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE testimonials SET is_approved = 1 WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Testimonial approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete testimonial (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;