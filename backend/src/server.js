// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import security middleware
import { apiLimiter } from './middleware/rateLimit.js';
import { sanitizeInput } from './middleware/validation.js';

// Routes
import projectRoutes from './routes/projects.js';
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.set('trust proxy', 1);

// ============================================
// CORS Configuration
// ============================================

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://nexora-website-epts.onrender.com',
  'https://nexora-website-1.onrender.com',
  'https://nexora-business-frontend.railway.app',
  'https://nexora-business-backend.railway.app',
  'https://sight-exploring-validity-discretion.trycloudflare.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️ Origin ${origin} not allowed by CORS`);
      if (origin.includes('.onrender.com') || origin.includes('.trycloudflare.com')) {
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput);
app.use('/api', apiLimiter);

// ============================================
// CREATE TABLES
// ============================================

async function createTables() {
  try {
    console.log('📊 Creating tables...');
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
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contacts table ready');

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

// ============================================
// API ROUTES
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
    }
  });
});

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
    res.status(500).json({ 
      status: 'Error', 
      database: 'disconnected',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

console.log('📋 Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
console.log('✅ Routes registered');

// ============================================
// ✅ CRITICAL FIX: Serve Frontend Files
// ============================================

// Get the frontend dist path
const frontendPath = path.join(__dirname, '../../frontend/dist');
console.log(`📁 Frontend path: ${frontendPath}`);

// Serve static files from frontend dist
app.use(express.static(frontendPath));

// ============================================
// ✅ CRITICAL FIX: Handle all routes with index.html
// ============================================

// API 404 handler - Only for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: 'API endpoint not found', 
    path: req.path,
    availableEndpoints: [
      '/api/health',
      '/api/projects', 
      '/api/testimonials', 
      '/api/auth', 
      '/api/contact'
    ]
  });
});

// ✅ CRITICAL: All non-API routes should serve index.html
app.get('*', (req, res) => {
  // Check if it's an API route (should be handled above)
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve index.html for all other routes (React Router handles routing)
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// START SERVER
// ============================================

createTables().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🏠 Root endpoint: http://localhost:${PORT}/`);
    console.log(`📁 Serving frontend from: ${frontendPath}`);
    console.log(`🔒 Security: Rate limiting, Input sanitization, CORS enabled`);
  });
});

export default app;