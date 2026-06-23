// routes/contact.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import auth from '../middleware/auth.js';
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Submit contact form (public)
router.post('/', [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').notEmpty().withMessage('Message required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, subject, message, type } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO contacts (name, email, phone, subject, message, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, email, phone || '', subject || '', message, type || 'general']
    );

    // Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Krynova Contact: ${subject || 'New Enquiry'}`,
      html: `
        <h3>New Contact Enquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Type:</strong> ${type || 'general'}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.status(201).json({ message: 'Message sent successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all contacts (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark as read (admin only)
router.put('/:id/read', auth, async (req, res) => {
  try {
    const result = await pool.query('UPDATE contacts SET is_read = $1 WHERE id = $2', [true, req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete contact (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM contacts WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;