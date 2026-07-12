# backend/routes/auth_routes.py
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
        # ✅ FIX: Use with statement properly
        with get_db() as conn:
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
            
            return jsonify({
                'message': 'Admin created successfully',
                'id': user_id
            }), 201
        
    except Exception as e:
        print(f"❌ Registration error: {str(e)}")
        import traceback
        traceback.print_exc()
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
        # ✅ FIX: Use with statement properly
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Find user by email
            cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
            user = cursor.fetchone()
            
            if not user:
                return jsonify({'message': 'Invalid credentials'}), 401
            
            # Convert row to dict manually since row_factory might not be set
            user_dict = {
                'id': user[0],
                'name': user[1],
                'email': user[2],
                'password': user[3] if len(user) > 3 else None,
                'role': user[4] if len(user) > 4 else 'user',
                'is_premium': user[5] if len(user) > 5 else 0
            }
            
            # Check password
            if not bcrypt.checkpw(password.encode('utf-8'), user_dict['password'].encode('utf-8')):
                return jsonify({'message': 'Invalid credentials'}), 401
            
            # Generate token
            token = jwt.encode({
                'id': user_dict['id'],
                'email': user_dict['email'],
                'name': user_dict['name'],
                'role': user_dict['role'],
                'exp': datetime.utcnow() + timedelta(days=7)
            }, os.getenv('JWT_SECRET', 'your-secret-key'), algorithm='HS256')
            
            return jsonify({
                'token': token,
                'user': {
                    'id': user_dict['id'],
                    'name': user_dict['name'],
                    'email': user_dict['email'],
                    'role': user_dict['role'],
                    'is_premium': bool(user_dict['is_premium'])
                }
            })
        
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        import traceback
        traceback.print_exc()
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

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get user profile from token"""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return jsonify({'message': 'No token provided'}), 401
    
    token = auth_header.split(' ')[1]
    
    try:
        # Decode token
        data = jwt.decode(
            token, 
            os.getenv('JWT_SECRET', 'your-secret-key'),
            algorithms=['HS256']
        )
        
        # ✅ FIX: Use with statement properly
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT id, name, email, role, is_premium FROM users WHERE id = ?', (data['id'],))
            user = cursor.fetchone()
            
            if not user:
                return jsonify({'message': 'User not found'}), 404
            
            return jsonify({
                'id': user[0],
                'name': user[1],
                'email': user[2],
                'role': user[3],
                'is_premium': bool(user[4] if len(user) > 4 else 0)
            })
        
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401
    except Exception as e:
        print(f"❌ Profile error: {str(e)}")
        return jsonify({'message': f'Failed to get profile: {str(e)}'}), 500

@auth_bp.route('/change-password', methods=['POST'])
def change_password():
    """Change user password"""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return jsonify({'message': 'No token provided'}), 401
    
    token = auth_header.split(' ')[1]
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    old_password = data.get('old_password', '')
    new_password = data.get('new_password', '')
    
    if not old_password or not new_password:
        return jsonify({'message': 'Old and new password required'}), 400
    
    if len(new_password) < 8:
        return jsonify({'message': 'New password must be at least 8 characters'}), 400
    
    try:
        # Decode token
        user_data = jwt.decode(
            token, 
            os.getenv('JWT_SECRET', 'your-secret-key'),
            algorithms=['HS256']
        )
        
        # ✅ FIX: Use with statement properly
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT password FROM users WHERE id = ?', (user_data['id'],))
            user = cursor.fetchone()
            
            if not user:
                return jsonify({'message': 'User not found'}), 404
            
            # Verify old password
            if not bcrypt.checkpw(old_password.encode('utf-8'), user[0].encode('utf-8')):
                return jsonify({'message': 'Incorrect old password'}), 401
            
            # Hash new password
            hashed = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            
            # Update password
            cursor.execute(
                'UPDATE users SET password = ? WHERE id = ?',
                (hashed.decode('utf-8'), user_data['id'])
            )
            conn.commit()
            
            return jsonify({'message': 'Password changed successfully'})
        
    except Exception as e:
        print(f"❌ Password change error: {str(e)}")
        return jsonify({'message': f'Failed to change password: {str(e)}'}), 500