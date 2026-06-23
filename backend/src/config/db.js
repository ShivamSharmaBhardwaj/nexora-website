// src/config/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Use Railway's MySQL URL or fallback to individual variables
const pool = mysql.createPool({
  // Railway provides MYSQL_URL which has everything
  uri: process.env.MYSQL_URL || process.env.DATABASE_URL,
  // Or use individual variables if URL is not available
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'nexora',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // For Railway SSL
  ssl: process.env.MYSQL_URL ? { rejectUnauthorized: false } : undefined
});

export default pool;