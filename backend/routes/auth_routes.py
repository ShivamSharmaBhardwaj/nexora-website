from flask import Blueprint, request, jsonify
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from config import get_db
from middleware.auth import token_blacklist
from middleware.validation import sanitize_input

auth_bp = Blueprint('auth', __name__)
auth_bp.strict_slashes = False

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register new admin user"""
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    # Validation
    errors = {}
    if not name or len(name) < 2:
        errors['name'] = 'Name must be at least 2 characters'
    if not email or '@' not in email:
        errors['email'] = 'Valid email required'
    if not password or len(password) < 8:
        errors['password'] = 'Password must be at least 8 characters'
    
    if errors:
        return jsonify({'errors': errors}), 400
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
        if cursor.fetchone():
            return jsonify({'message': 'Email already registered'}), 400
        
        # Hash password
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Insert user
        cursor.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            (name, email, hashed.decode('utf-8'), 'admin')
        )
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Admin created successfully',
            'id': user_id
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Find user
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Generate token
        token = jwt.encode({
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(days=7)
        }, os.getenv('JWT_SECRET', 'your-secret-key'), algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        })
        
    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user (blacklist token)"""
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        if token:
            token_blacklist.add(token)
    
    return jsonify({'message': 'Logged out successfully'})