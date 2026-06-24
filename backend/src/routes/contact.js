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
      // Spam check - same email in last hour
      const spamCheck = await pool.query(
        'SELECT COUNT(*) FROM contacts WHERE email = $1 AND created_at > NOW() - INTERVAL \'1 hour\'',
        [email]
      );
      
      if (parseInt(spamCheck.rows[0].count) >= 3) {
        return res.status(429).json({
          message: 'Too many submissions from this email. Please try again later.'
        });
      }

      // ✅ FIXED: Correct INSERT query - removed ip_address
      const result = await pool.query(
        `INSERT INTO contacts (name, email, phone, subject, message, type, is_read) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id`,
        [name, email, phone || '', subject || '', message, type || 'general', false] // 7 parameters
      );

      // Try to send email notification
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
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>IP: ${req.ip || req.headers['x-forwarded-for'] || 'Not available'}</small></p>
          `
        });
        console.log('📧 Email sent for contact ID:', result.rows[0].id);
      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError.message);
        // Don't fail the request if email fails
      }

      res.status(201).json({ 
        success: true,
        message: 'Message sent successfully', 
        id: result.rows[0].id 
      });
    } catch (error) {
      console.error('Contact error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to save contact message',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Get all contacts (admin only) - WITH SECURITY
router.get('/', auth, adminLimiter, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

// Get contact by ID (admin only)
router.get('/:id', auth, adminLimiter, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contacts WHERE id = $1',
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Failed to fetch contact' });
  }
});

// Mark as read (admin only)
router.put('/:id/read', auth, adminLimiter, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE contacts SET is_read = $1, read_at = NOW() WHERE id = $2 RETURNING *',
      [true, req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ 
      message: 'Marked as read',
      contact: result.rows[0]
    });
  } catch (error) {
    console.error('Error marking contact as read:', error);
    res.status(500).json({ message: 'Failed to mark as read' });
  }
});

// Delete contact (admin only)
router.delete('/:id', auth, adminLimiter, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM contacts WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ 
      message: 'Contact deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
});

export default router;