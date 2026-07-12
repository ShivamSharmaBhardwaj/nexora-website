# backend/routes/project_routes.py
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

def parse_tech_stack(tech_stack):
    """Parse tech stack from string to list"""
    if not tech_stack:
        return []
    try:
        if isinstance(tech_stack, str):
            return json.loads(tech_stack)
        return tech_stack
    except:
        return [t.strip() for t in tech_stack.split(',') if t.strip()]

def row_to_dict(cursor, row):
    """Convert row to dict with column names"""
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}

@projects_bp.route('/', methods=['GET'])
@projects_bp.route('', methods=['GET'])
def get_projects():
    """Get all active projects (public)"""
    try:
        # ✅ FIX: Use with statement properly
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM projects 
                WHERE is_active = 1 
                ORDER BY priority DESC, created_at DESC
            ''')
            
            projects = []
            for row in cursor.fetchall():
                project = row_to_dict(cursor, row)
                project['features'] = parse_features(project.get('features'))
                project['tech_stack'] = parse_tech_stack(project.get('tech_stack'))
                projects.append(project)
            
            return jsonify(projects)
    except Exception as e:
        print(f"❌ Error fetching projects: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to fetch projects: {str(e)}'}), 500

@projects_bp.route('/<int:id>', methods=['GET'])
def get_project(id):
    """Get single project (public)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM projects WHERE id = ?', (id,))
            row = cursor.fetchone()
            
            if not row:
                return jsonify({'message': 'Project not found'}), 404
            
            project = row_to_dict(cursor, row)
            project['features'] = parse_features(project.get('features'))
            project['tech_stack'] = parse_tech_stack(project.get('tech_stack'))
            return jsonify(project)
    except Exception as e:
        print(f"❌ Error fetching project: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to fetch project: {str(e)}'}), 500

@projects_bp.route('/category/<category>', methods=['GET'])
def get_projects_by_category(category):
    """Get projects by category (public)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM projects 
                WHERE category = ? AND is_active = 1 
                ORDER BY priority DESC, created_at DESC
            ''', (category,))
            
            projects = []
            for row in cursor.fetchall():
                project = row_to_dict(cursor, row)
                project['features'] = parse_features(project.get('features'))
                project['tech_stack'] = parse_tech_stack(project.get('tech_stack'))
                projects.append(project)
            
            return jsonify(projects)
    except Exception as e:
        print(f"❌ Error fetching projects by category: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to fetch projects: {str(e)}'}), 500

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
        
        # Prepare tech_stack
        tech_stack = data.get('tech_stack', [])
        if isinstance(tech_stack, list):
            tech_stack_json = json.dumps(tech_stack)
        elif isinstance(tech_stack, str):
            try:
                tech_stack_json = json.dumps(json.loads(tech_stack))
            except:
                tech_stack_json = json.dumps([t.strip() for t in tech_stack.split(',') if t.strip()])
        else:
            tech_stack_json = json.dumps([])
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO projects 
                (title, category, description, short_desc, demo_url, video_url, image_url, icon, 
                 features, tech_stack, github_url, status, priority, is_featured, is_active, is_upcoming)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                tech_stack_json,
                data.get('github_url', ''),
                data.get('status', 'active'),
                int(data.get('priority', 0)),
                int(data.get('is_featured', 0)),
                int(data.get('is_active', 1)),
                int(data.get('is_upcoming', 0))
            ))
            
            project_id = cursor.lastrowid
            conn.commit()
            
            # Fetch the created project
            cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
            row = cursor.fetchone()
            project = row_to_dict(cursor, row)
            project['features'] = parse_features(project.get('features'))
            project['tech_stack'] = parse_tech_stack(project.get('tech_stack'))
            
            return jsonify({
                'message': 'Project created',
                'project': project,
                'id': project_id
            }), 201
        
    except Exception as e:
        print(f"❌ Error creating project: {str(e)}")
        import traceback
        traceback.print_exc()
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
        
        # Prepare tech_stack
        tech_stack = data.get('tech_stack', [])
        if isinstance(tech_stack, list):
            tech_stack_json = json.dumps(tech_stack)
        elif isinstance(tech_stack, str):
            try:
                tech_stack_json = json.dumps(json.loads(tech_stack))
            except:
                tech_stack_json = json.dumps([t.strip() for t in tech_stack.split(',') if t.strip()])
        else:
            tech_stack_json = json.dumps([])
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE projects SET 
                    title = ?, category = ?, description = ?, short_desc = ?,
                    demo_url = ?, video_url = ?, image_url = ?, icon = ?,
                    features = ?, tech_stack = ?, github_url = ?,
                    status = ?, priority = ?, is_featured = ?,
                    is_active = ?, is_upcoming = ?,
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
                tech_stack_json,
                data.get('github_url', ''),
                data.get('status', 'active'),
                int(data.get('priority', 0)),
                int(data.get('is_featured', 0)),
                int(data.get('is_active', 1)),
                int(data.get('is_upcoming', 0)),
                id
            ))
            
            if cursor.rowcount == 0:
                return jsonify({'message': 'Project not found'}), 404
            
            conn.commit()
            
            # Fetch updated project
            cursor.execute('SELECT * FROM projects WHERE id = ?', (id,))
            row = cursor.fetchone()
            project = row_to_dict(cursor, row)
            project['features'] = parse_features(project.get('features'))
            project['tech_stack'] = parse_tech_stack(project.get('tech_stack'))
            
            return jsonify({
                'message': 'Project updated',
                'project': project
            })
        
    except Exception as e:
        print(f"❌ Error updating project: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to update project: {str(e)}'}), 500

@projects_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_project(id):
    """Delete project (admin only)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM projects WHERE id = ?', (id,))
            
            if cursor.rowcount == 0:
                return jsonify({'message': 'Project not found'}), 404
            
            conn.commit()
            
            return jsonify({
                'message': 'Project deleted',
                'id': id
            })
        
    except Exception as e:
        print(f"❌ Error deleting project: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to delete project: {str(e)}'}), 500

# Bulk update endpoint
@projects_bp.route('/bulk', methods=['PUT'])
@token_required
def bulk_update_projects():
    """Bulk update projects (admin only)"""
    data = request.get_json()
    project_ids = data.get('ids', [])
    updates = data.get('updates', {})
    
    if not project_ids or not updates:
        return jsonify({'message': 'Missing ids or updates'}), 400
    
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Build update query
            set_clause = ', '.join([f"{key} = ?" for key in updates.keys()])
            placeholders = [updates[key] for key in updates.keys()] + project_ids
            
            query = f"UPDATE projects SET {set_clause}, updated_at = CURRENT_TIMESTAMP WHERE id IN ({','.join(['?' for _ in project_ids])})"
            cursor.execute(query, placeholders)
            
            updated_count = cursor.rowcount
            conn.commit()
            
            return jsonify({
                'message': f'{updated_count} projects updated',
                'updated': updated_count
            })
        
    except Exception as e:
        print(f"❌ Error bulk updating projects: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to update projects: {str(e)}'}), 500

# Get featured projects
@projects_bp.route('/featured', methods=['GET'])
def get_featured_projects():
    """Get featured projects (public)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM projects 
                WHERE is_featured = 1 AND is_active = 1 
                ORDER BY priority DESC, created_at DESC
            ''')
            
            projects = []
            for row in cursor.fetchall():
                project = row_to_dict(cursor, row)
                project['features'] = parse_features(project.get('features'))
                project['tech_stack'] = parse_tech_stack(project.get('tech_stack'))
                projects.append(project)
            
            return jsonify(projects)
    except Exception as e:
        print(f"❌ Error fetching featured projects: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to fetch featured projects: {str(e)}'}), 500

# Get upcoming projects
@projects_bp.route('/upcoming', methods=['GET'])
def get_upcoming_projects():
    """Get upcoming projects (public)"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM projects 
                WHERE is_upcoming = 1 AND is_active = 1 
                ORDER BY priority DESC, created_at DESC
            ''')
            
            projects = []
            for row in cursor.fetchall():
                project = row_to_dict(cursor, row)
                project['features'] = parse_features(project.get('features'))
                project['tech_stack'] = parse_tech_stack(project.get('tech_stack'))
                projects.append(project)
            
            return jsonify(projects)
    except Exception as e:
        print(f"❌ Error fetching upcoming projects: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to fetch upcoming projects: {str(e)}'}), 500