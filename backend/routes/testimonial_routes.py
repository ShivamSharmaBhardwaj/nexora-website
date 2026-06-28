from flask import Blueprint, request, jsonify
from config import get_db
from middleware.auth import token_required
from middleware.validation import validate_testimonial_data

testimonials_bp = Blueprint('testimonials', __name__)

@testimonials_bp.route('/', methods=['GET'])
def get_testimonials():
    """Get approved testimonials (public)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'SELECT * FROM testimonials WHERE is_approved = 1 ORDER BY created_at DESC'
        )
        testimonials = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(testimonials)
    except Exception as e:
        return jsonify({'message': f'Failed to fetch testimonials: {str(e)}'}), 500

@testimonials_bp.route('/', methods=['POST'])
def submit_testimonial():
    """Submit testimonial (public)"""
    data = request.get_json()
    
    # Validate
    errors = validate_testimonial_data(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO testimonials (client_name, client_company, client_image, rating, feedback)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data['client_name'],
            data.get('client_company', ''),
            data.get('client_image', ''),
            data.get('rating', 5),
            data['feedback']
        ))
        
        testimonial_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Testimonial submitted for approval',
            'id': testimonial_id
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Failed to submit testimonial: {str(e)}'}), 500

@testimonials_bp.route('/all', methods=['GET'])
@token_required
def get_all_testimonials():
    """Get all testimonials (admin only)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM testimonials ORDER BY created_at DESC')
        testimonials = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return jsonify(testimonials)
    except Exception as e:
        return jsonify({'message': f'Failed to fetch testimonials: {str(e)}'}), 500

@testimonials_bp.route('/<int:id>/approve', methods=['PUT'])
@token_required
def approve_testimonial(id):
    """Approve testimonial (admin only)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE testimonials SET is_approved = 1 WHERE id = ?',
            (id,)
        )
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'message': 'Testimonial not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Testimonial approved'})
        
    except Exception as e:
        return jsonify({'message': f'Failed to approve testimonial: {str(e)}'}), 500

@testimonials_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_testimonial(id):
    """Delete testimonial (admin only)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM testimonials WHERE id = ?', (id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'message': 'Testimonial not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Deleted'})
        
    except Exception as e:
        return jsonify({'message': f'Failed to delete testimonial: {str(e)}'}), 500