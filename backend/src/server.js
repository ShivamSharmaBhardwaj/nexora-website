// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';  // Your PostgreSQL connection

// Routes
import projectRoutes from './routes/projects.js';
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// ============================================
// ADD THIS FUNCTION TO CREATE TABLES AUTOMATICALLY
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

    // Insert sample data if tables are empty
    const projectCheck = await pool.query('SELECT COUNT(*) FROM projects');
    if (parseInt(projectCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO projects (title, category, description, features, is_active) 
        VALUES ('Sample Project', 'Web Development', 'This is a sample project', '["Feature 1", "Feature 2", "Feature 3"]', TRUE)
      `);
      console.log('✅ Sample project added');
    }

    const testimonialCheck = await pool.query('SELECT COUNT(*) FROM testimonials');
    if (parseInt(testimonialCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO testimonials (client_name, client_company, feedback, rating, is_approved) 
        VALUES ('John Doe', 'ABC Corp', 'Great service! Highly recommended.', 5, TRUE)
      `);
      console.log('✅ Sample testimonial added');
    }

    console.log('🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
}

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://nexora-website-epts.onrender.com',
  // Add your frontend URL
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
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found', 
    path: req.path,
    availableEndpoints: ['/api/health', '/api/projects', '/api/testimonials', '/api/auth', '/api/contact']
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
// CALL THE FUNCTION BEFORE STARTING THE SERVER
// ============================================
createTables().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Allowed origins:`, allowedOrigins);
  });
});