// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Simple in-memory blacklist (use Redis in production)
const tokenBlacklist = new Set();

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ 
      message: 'No token provided. Authorization denied.',
      code: 'NO_TOKEN'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      message: 'Invalid token format. Use Bearer <token>',
      code: 'INVALID_FORMAT'
    });
  }

  const token = parts[1];

  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ 
      message: 'Invalid token provided',
      code: 'INVALID_TOKEN'
    });
  }

  // Check if token is blacklisted
  if (tokenBlacklist.has(token)) {
    return res.status(401).json({
      message: 'Token has been revoked. Please login again.',
      code: 'TOKEN_REVOKED'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      tokenBlacklist.add(token);
      return res.status(401).json({
        message: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token signature',
        code: 'INVALID_SIGNATURE'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      tokenBlacklist.add(token);
      return res.status(401).json({ 
        message: 'Token has expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    res.status(401).json({ 
      message: 'Token validation failed',
      code: 'VALIDATION_FAILED'
    });
  }
};

// Export blacklist for logout functionality
export { tokenBlacklist };

export default auth;