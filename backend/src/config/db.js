import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false  // Required for Render PostgreSQL
  }
});

// Test the connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL successfully');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err.stack);
});

export default pool;