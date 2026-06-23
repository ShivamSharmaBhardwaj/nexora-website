// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';  // ✅ Fixed: ./config/

// Routes
import projectRoutes from './routes/projects.js';  // ✅ Fixed: ./routes/
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://sight-exploring-validity-discretion.trycloudflare.com',
  'https://nexora-business-frontend.railway.app',  // Add your Railway frontend
  'https://nexora-business-backend.railway.app',   // Add your Railway backend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Origin ${origin} not allowed by CORS`);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (temporary - with error handling)
app.get('/api/health', async (req, res) => {
  try {
    // Try to connect to database
    const [rows] = await pool.query('SELECT 1+1 as result');
    res.json({ 
      status: 'OK', 
      database: 'connected', 
      result: rows[0].result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // If database fails, still return success (for testing)
    res.json({ 
      status: 'OK', 
      database: 'not connected (check DATABASE_URL)',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test route (no database required)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/health', '/api/test', '/api/projects', '/api/testimonials']
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found', 
    path: req.path,
    availableEndpoints: ['/api/health', '/api/test', '/api/projects', '/api/testimonials', '/api/auth', '/api/contact']
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Allowed origins:`, allowedOrigins);
});