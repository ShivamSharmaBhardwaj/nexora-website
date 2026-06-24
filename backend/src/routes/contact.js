// backend/src/routes/contact.js
import express from 'express';
import { validationResult } from 'express-validator';
import pool from '../config/db.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import auth from '../middleware/auth.js';
import { contactLimiter, adminLimiter } from '../middleware/rateLimit.js';
import { validateContact } from '../middleware/validation.js';
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Submit contact form (public) - WITH SECURITY
router.post('/',
  contactLimiter,
  validateContact,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, subject, message, type } = req.body;

    try {
      // Spam check - same email/IP in last hour
      const spamCheck = await pool.query(
        'SELECT COUNT(*) FROM contacts WHERE email = $1 AND created_at > NOW() - INTERVAL \'1 hour\'',
        [email]
      );
      
      if (parseInt(spamCheck.rows[0].count) >= 3) {
        return res.status(429).json({
          message: 'Too many submissions from this email. Please try again later.'
        });
      }

     // ✅ CORRECT - Remove ip_address from the array
const result = await pool.query(
  `INSERT INTO contacts (name, email, phone, subject, message, type) 
   VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
  [name, email, phone || '', subject || '', message, type || 'general'] // 6 parameters
);

      // Try to send email
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `Krynova Contact: ${subject || 'New Enquiry'}`,
          html: `
            <h3>New Contact Enquiry</h3>
            <p><strong>ID:</strong> ${result.rows[0].id}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Type:</strong> ${type || 'general'}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <hr>
            <p><small>IP: ${req.ip || 'Not available'}</small></p>
          `
        });
        console.log('📧 Email sent for contact ID:', result.rows[0].id);
      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError.message);
      }

      res.status(201).json({ 
        message: 'Message sent successfully', 
        id: result.rows[0].id 
      });
    } catch (error) {
      console.error('Contact error:', error);
      res.status(500).json({ 
        message: 'Failed to save contact message' 
      });
    }
  }
);

// Get all contacts (admin only) - WITH SECURITY
router.get('/', auth, adminLimiter, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

// Mark as read (admin only)
router.put('/:id/read', auth, adminLimiter, async (req, res) => {
  try {
    const result = await pool.query('UPDATE contacts SET is_read = $1 WHERE id = $2', [true, req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Marked as read' });
  } catch (error) {
    console.error('Error marking contact as read:', error);
    res.status(500).json({ message: 'Failed to mark as read' });
  }
});

// Delete contact (admin only)
router.delete('/:id', auth, adminLimiter, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM contacts WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
});

export default router;