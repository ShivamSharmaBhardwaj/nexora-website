# backend/routes/testimonial_routes.py
from flask import Blueprint, request, jsonify
from config import get_db
from middleware.auth import token_required
from middleware.validation import validate_testimonial_data

testimonials_bp = Blueprint('testimonials', __name__)
testimonials_bp.strict_slashes = False

@testimonials_bp.route('/', methods=['GET'])
def get_testimonials():
    """Get approved testimonials (public)"""
    try:
        # ✅ FIX: Use get_db() properly with context manager
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'SELECT id, client_name, client_company, client_image, rating, feedback, is_approved, created_at FROM testimonials WHERE is_approved = 1 ORDER BY created_at DESC'
            )
            testimonials = []
            for row in cursor.fetchall():
                testimonials.append({
                    'id': row[0],
                    'client_name': row[1],
                    'client_company': row[2],
                    'client_image': row[3],
                    'rating': row[4],
                    'feedback': row[5],
                    'is_approved': row[6],
                    'created_at': row[7]
                })
            return jsonify(testimonials)
    except Exception as e:
        print(f"❌ Error fetching testimonials: {str(e)}")
        import traceback
        traceback.print_exc()
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
        with get_db() as conn:
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
            
            return jsonify({
                'message': 'Testimonial submitted for approval',
                'id': testimonial_id
            }), 201
        
    except Exception as e:
        print(f"❌ Error submitting testimonial: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to submit testimonial: {str(e)}'}), 500

@testimonials_bp.route('/all', methods=['GET'])
@token_required
def get_all_testimonials():
    """Get all testimonials (admin only)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM testimonials ORDER BY created_at DESC')
            testimonials = []
            for row in cursor.fetchall():
                testimonials.append(dict(row))
            return jsonify(testimonials)
    except Exception as e:
        print(f"❌ Error fetching all testimonials: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to fetch testimonials: {str(e)}'}), 500

@testimonials_bp.route('/<int:id>/approve', methods=['PUT'])
@token_required
def approve_testimonial(id):
    """Approve testimonial (admin only)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'UPDATE testimonials SET is_approved = 1 WHERE id = ?',
                (id,)
            )
            
            if cursor.rowcount == 0:
                return jsonify({'message': 'Testimonial not found'}), 404
            
            conn.commit()
            return jsonify({'message': 'Testimonial approved'})
        
    except Exception as e:
        print(f"❌ Error approving testimonial: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to approve testimonial: {str(e)}'}), 500

@testimonials_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_testimonial(id):
    """Delete testimonial (admin only)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM testimonials WHERE id = ?', (id,))
            
            if cursor.rowcount == 0:
                return jsonify({'message': 'Testimonial not found'}), 404
            
            conn.commit()
            return jsonify({'message': 'Deleted'})
        
    except Exception as e:
        print(f"❌ Error deleting testimonial: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to delete testimonial: {str(e)}'}), 500