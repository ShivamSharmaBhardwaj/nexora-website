from functools import wraps
from flask import request, jsonify
import jwt
import os
from datetime import datetime

# In-memory blacklist (use Redis in production)
token_blacklist = set()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        
        if not token or token in ['null', 'undefined']:
            return jsonify({
                'message': 'No token provided. Authorization denied.',
                'code': 'NO_TOKEN'
            }), 401
        
        # Check if token is blacklisted
        if token in token_blacklist:
            return jsonify({
                'message': 'Token has been revoked. Please login again.',
                'code': 'TOKEN_REVOKED'
            }), 401
        
        try:
            # Decode token
            data = jwt.decode(
                token, 
                os.getenv('JWT_SECRET', 'your-secret-key'),
                algorithms=['HS256']
            )
            
            # Check if token is expired
            if 'exp' in data and data['exp'] < datetime.now().timestamp():
                token_blacklist.add(token)
                return jsonify({
                    'message': 'Token expired. Please login again.',
                    'code': 'TOKEN_EXPIRED'
                }), 401
            
            # Add user data to request
            request.user = data
            
        except jwt.ExpiredSignatureError:
            token_blacklist.add(token)
            return jsonify({
                'message': 'Token has expired. Please login again.',
                'code': 'TOKEN_EXPIRED'
            }), 401
            
        except jwt.InvalidTokenError:
            return jsonify({
                'message': 'Invalid token signature',
                'code': 'INVALID_SIGNATURE'
            }), 401
        
        return f(*args, **kwargs)
    
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(request, 'user'):
            return jsonify({'message': 'Authentication required'}), 401
        
        if request.user.get('role') != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    
    return decorated