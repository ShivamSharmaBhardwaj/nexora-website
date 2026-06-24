// backend/src/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import pool from '../config/db.js';
import dotenv from 'dotenv';
import { loginLimiter } from '../middleware/rateLimit.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { tokenBlacklist } from '../middleware/auth.js';
dotenv.config();

const router = express.Router();

// Register
router.post('/register', 
  loginLimiter,
  validateRegister,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, email, hashedPassword, 'admin']
      );
      
      res.status(201).json({ 
        message: 'Admin created successfully', 
        id: result.rows[0].id 
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      res.status(500).json({ message: 'Registration failed' });
    }
  }
);

// Login
router.post('/login',
  loginLimiter,
  validateLogin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          role: user.role 
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  }
);

// Logout - blacklist the token
router.post('/logout', (req, res) => {
  const authHeader = req.header('Authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      tokenBlacklist.add(token);
      console.log('🔒 Token blacklisted for logout');
    }
  }
  res.json({ message: 'Logged out successfully' });
});

export default router;