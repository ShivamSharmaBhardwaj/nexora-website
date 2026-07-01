from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
from config import get_db
from middleware.auth import token_required, admin_required
from middleware.validation import validate_contact_data, sanitize_input
from utils.email_service import send_contact_email

contact_bp = Blueprint('contact_bp', __name__)
contact_bp.strict_slashes = False

@contact_bp.route('/', methods=['POST', 'OPTIONS'])
def submit_contact():
    """Submit contact form (public) - Enhanced with new fields"""
    
    # Handle preflight
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    # Validate basic fields
    errors = validate_contact_data(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Spam check - same email in last hour
        one_hour_ago = (datetime.now() - timedelta(hours=1)).isoformat()
        cursor.execute(
            'SELECT COUNT(*) as count FROM contacts WHERE email = ? AND created_at > ?',
            (data['email'], one_hour_ago)
        )
        spam_count = cursor.fetchone()['count']
        
        if spam_count >= 3:
            conn.close()
            return jsonify({
                'message': 'Too many submissions from this email. Please try again later.'
            }), 429
        
        # Insert with new fields
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
        cursor.execute('''
            INSERT INTO contacts (
                name, email, phone, subject, message, type, 
                interest_type, service_type, product_type, budget, 
                timeline, requirements, company_name, hear_about, 
                preferred_contact, industry, team_size, ip_address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            sanitize_input(data['name']),
            sanitize_input(data['email']),
            sanitize_input(data.get('phone', '')),
            sanitize_input(data.get('subject', '')),
            sanitize_input(data['message']),
            data.get('type', 'general'),
            data.get('interestType', 'service'),
            data.get('serviceType', ''),
            data.get('productType', ''),
            data.get('budget', ''),
            data.get('timeline', ''),
            json.dumps(data.get('requirements', [])),
            sanitize_input(data.get('companyName', '')),
            sanitize_input(data.get('hearAbout', '')),
            data.get('preferredContact', 'email'),
            data.get('industry', ''),
            data.get('teamSize', ''),
            ip_address
        ))
        
        contact_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Try to send email notification asynchronously
        try:
            send_contact_email(contact_id, data)
        except Exception as e:
            print(f"Email sending failed: {e}")
        
        return jsonify({
            'success': True,
            'message': 'Message sent successfully',
            'id': contact_id
        }), 201
        
    except Exception as e:
        print(f"Error saving contact: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to save contact message'
        }), 500

@contact_bp.route('/', methods=['GET'])
@token_required
def get_contacts():
    """Get all contacts (requires authentication)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM contacts ORDER BY created_at DESC')
        contacts = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(contacts)
    except Exception as e:
        return jsonify({'message': 'Failed to fetch contacts'}), 500

@contact_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_contact(id):
    """Get contact by ID"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM contacts WHERE id = ?', (id,))
        contact = cursor.fetchone()
        conn.close()
        
        if not contact:
            return jsonify({'message': 'Contact not found'}), 404
        
        return jsonify(dict(contact))
    except Exception as e:
        return jsonify({'message': 'Failed to fetch contact'}), 500

@contact_bp.route('/<int:id>/read', methods=['PUT'])
@token_required
def mark_as_read(id):
    """Mark contact as read"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE contacts SET is_read = 1 WHERE id = ?',
            (id,)
        )
        conn.commit()
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'message': 'Contact not found'}), 404
        
        cursor.execute('SELECT * FROM contacts WHERE id = ?', (id,))
        contact = dict(cursor.fetchone())
        conn.close()
        
        return jsonify({
            'message': 'Marked as read',
            'contact': contact
        })
    except Exception as e:
        return jsonify({'message': 'Failed to mark as read'}), 500

@contact_bp.route('/<int:id>', methods=['DELETE'])
@token_required
@admin_required  # Added admin requirement for deletion
def delete_contact(id):
    """Delete contact (admin only)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM contacts WHERE id = ?', (id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'message': 'Contact not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Contact deleted successfully',
            'id': id
        })
    except Exception as e:
        return jsonify({'message': 'Failed to delete contact'}), 500