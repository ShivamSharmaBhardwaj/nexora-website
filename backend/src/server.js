// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import projectRoutes from './routes/projects.js';
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// ============================================
// CREATE TABLES AUTOMATICALLY
// ============================================
async function createTables() {
  try {
    console.log('📊 Creating tables if they don\'t exist...');
    
    // Create projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        short_desc VARCHAR(500),
        demo_url VARCHAR(500),
        video_url VARCHAR(500),
        image_url VARCHAR(500),
        icon VARCHAR(100),
        features JSONB,
        is_active BOOLEAN DEFAULT TRUE,
        is_upcoming BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Projects table ready');

    // Create testimonials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_company VARCHAR(255),
        client_image VARCHAR(500),
        rating INT DEFAULT 5,
        feedback TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Testimonials table ready');

    // Create contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'general',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contacts table ready');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready');

    console.log('🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
}

// backend/src/server.js

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://nexora-website-epts.onrender.com',
  'https://nexora-website-1.onrender.com',     // 👈 ADD THIS
  'https://nexora-business-frontend.railway.app',
  'https://nexora-business-backend.railway.app',
  'https://sight-exploring-validity-discretion.trycloudflare.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️ Origin ${origin} not allowed by CORS`);
      // For Render deployments, allow any .onrender.com domain
      if (origin.includes('.onrender.com')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROOT ROUTE - Fix the 404 error
// ============================================
app.get('/', (req, res) => {
  res.json({
    name: 'Krynova Technologies API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      projects: '/api/projects',
      testimonials: '/api/testimonials',
      contact: '/api/contact',
      auth: '/api/auth'
    },
    documentation: 'https://github.com/ShivamSharmaBhardwaj/nexora-website'
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1+1 as result');
    res.json({ 
      status: 'OK', 
      database: 'connected', 
      result: result.rows[0].result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      database: 'not connected (check DATABASE_URL)',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Routes
console.log('📋 Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
console.log('✅ Routes registered: /api/auth, /api/projects, /api/testimonials, /api/contact');

// ============================================
// API 404 handler for unmatched API routes
// ============================================
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found', 
    path: req.path,
    method: req.method,
    availableEndpoints: [
      '/api/health',
      '/api/projects', 
      '/api/testimonials', 
      '/api/auth', 
      '/api/contact'
    ]
  });
});

// ============================================
// 404 handler for all other routes
// ============================================
app.use((req, res) => {
  // Don't return JSON for browser requests - serve the frontend if available
  const acceptHeader = req.headers.accept || '';
  
  // Check if the request accepts HTML (likely a browser)
  if (acceptHeader.includes('text/html')) {
    // Try to serve the frontend if it's built
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    try {
      if (require('fs').existsSync(path.join(frontendPath, 'index.html'))) {
        res.sendFile(path.join(frontendPath, 'index.html'));
        return;
      }
    } catch (err) {
      // Fall through to JSON response
    }
  }
  
  // Default JSON response for API-like requests
  res.status(404).json({ 
    message: 'Route not found', 
    path: req.path,
    method: req.method,
    availableEndpoints: [
      '/',
      '/api/health', 
      '/api/projects', 
      '/api/testimonials', 
      '/api/auth', 
      '/api/contact'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// START THE SERVER
// ============================================
createTables().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🏠 Root endpoint: http://localhost:${PORT}/`);
    console.log(`🌐 Allowed origins:`, allowedOrigins);
  });
});

export default app;