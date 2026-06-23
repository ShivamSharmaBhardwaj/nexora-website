// middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ 
      message: 'No token provided. Authorization denied.',
      code: 'NO_TOKEN'
    });
  }

  // Check if it's a Bearer token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      message: 'Invalid token format. Use Bearer <token>',
      code: 'INVALID_FORMAT'
    });
  }

  const token = parts[1];

  // Check if token is empty
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ 
      message: 'Invalid token provided',
      code: 'INVALID_TOKEN'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Attach user to request
    req.user = decoded;
    
    // Log for debugging (remove in production)
    console.log('Auth successful for user:', decoded.email || decoded.id);
    
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    
    // Handle different JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token signature',
        code: 'INVALID_SIGNATURE'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
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

export default auth;