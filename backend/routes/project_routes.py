from flask import Blueprint, request, jsonify
import json
from config import get_db
from middleware.auth import token_required, admin_required
from middleware.validation import validate_project_data

projects_bp = Blueprint('projects', __name__)
projects_bp.strict_slashes = False

def parse_features(features):
    """Parse features from string to list"""
    if not features:
        return []
    try:
        if isinstance(features, str):
            return json.loads(features)
        return features
    except:
        return [f.strip() for f in features.split(',') if f.strip()]

@projects_bp.route('/', methods=['GET'])
@projects_bp.route('', methods=['GET'])
def get_projects():
    """Get all active projects (public)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'SELECT * FROM projects WHERE is_active = 1 ORDER BY created_at DESC'
        )
        projects = []
        for row in cursor.fetchall():
            project = dict(row)
            project['features'] = parse_features(project.get('features'))
            projects.append(project)
        conn.close()
        return jsonify(projects)
    except Exception as e:
        return jsonify({'message': f'Failed to fetch projects: {str(e)}'}), 500

@projects_bp.route('/category/<category>', methods=['GET'])
def get_projects_by_category(category):
    """Get projects by category (public)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'SELECT * FROM projects WHERE LOWER(category) = LOWER(?) AND is_active = 1 ORDER BY created_at DESC',
            (category,)
        )
        projects = []
        for row in cursor.fetchall():
            project = dict(row)
            project['features'] = parse_features(project.get('features'))
            projects.append(project)
        conn.close()
        return jsonify(projects)
    except Exception as e:
        return jsonify({'message': f'Failed to fetch projects: {str(e)}'}), 500

@projects_bp.route('/<int:id>', methods=['GET'])
def get_project(id):
    """Get single project (public)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM projects WHERE id = ?', (id,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            return jsonify({'message': 'Project not found'}), 404
        
        project = dict(row)
        project['features'] = parse_features(project.get('features'))
        return jsonify(project)
    except Exception as e:
        return jsonify({'message': f'Failed to fetch project: {str(e)}'}), 500

@projects_bp.route('/', methods=['POST'])
@token_required
def create_project():
    """Create new project (admin only)"""
    data = request.get_json()
    
    # Validate
    errors = validate_project_data(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    try:
        # Prepare features
        features = data.get('features', [])
        if isinstance(features, list):
            features_json = json.dumps(features)
        elif isinstance(features, str):
            try:
                features_json = json.dumps(json.loads(features))
            except:
                features_json = json.dumps([f.strip() for f in features.split(',') if f.strip()])
        else:
            features_json = json.dumps([])
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO projects 
            (title, category, description, short_desc, demo_url, video_url, image_url, icon, features, is_upcoming)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['title'],
            data['category'],
            data['description'],
            data.get('short_desc', ''),
            data.get('demo_url', ''),
            data.get('video_url', ''),
            data.get('image_url', ''),
            data.get('icon', ''),
            features_json,
            data.get('is_upcoming', False)
        ))
        
        project_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Project created',
            'id': project_id
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Failed to create project: {str(e)}'}), 500

@projects_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_project(id):
    """Update project (admin only)"""
    data = request.get_json()
    
    # Validate
    errors = validate_project_data(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    try:
        # Prepare features
        features = data.get('features', [])
        if isinstance(features, list):
            features_json = json.dumps(features)
        elif isinstance(features, str):
            try:
                features_json = json.dumps(json.loads(features))
            except:
                features_json = json.dumps([f.strip() for f in features.split(',') if f.strip()])
        else:
            features_json = json.dumps([])
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE projects SET 
                title = ?, category = ?, description = ?, short_desc = ?,
                demo_url = ?, video_url = ?, image_url = ?, icon = ?,
                features = ?, is_active = ?, is_upcoming = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            data['title'],
            data['category'],
            data['description'],
            data.get('short_desc', ''),
            data.get('demo_url', ''),
            data.get('video_url', ''),
            data.get('image_url', ''),
            data.get('icon', ''),
            features_json,
            data.get('is_active', True),
            data.get('is_upcoming', False),
            id
        ))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'message': 'Project not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Project updated'})
        
    except Exception as e:
        return jsonify({'message': f'Failed to update project: {str(e)}'}), 500

@projects_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_project(id):
    """Delete project (admin only)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM projects WHERE id = ?', (id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'message': 'Project not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Project deleted'})
        
    except Exception as e:
        return jsonify({'message': f'Failed to delete project: {str(e)}'}), 500