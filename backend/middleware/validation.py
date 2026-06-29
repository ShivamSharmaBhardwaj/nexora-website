import re
from email_validator import validate_email, EmailNotValidError

def sanitize_input(data):
    """Sanitize user input"""
    if isinstance(data, dict):
        sanitized = {}
        for key, value in data.items():
            if isinstance(value, str):
                # Remove dangerous content, preserve spaces
                sanitized[key] = value.replace(
                    '<script>', ''
                ).replace(
                    '</script>', ''
                ).replace(
                    'javascript:', ''
                )
            else:
                sanitized[key] = value
        return sanitized
    return data

def validate_contact_data(data):
    """Validate contact form data"""
    errors = {}
    
    # Validate name
    if not data.get('name') or len(data['name'].strip()) < 2:
        errors['name'] = 'Name must be at least 2 characters'
    elif not re.match(r'^[a-zA-Z\s\-.\']+$', data['name']):
        errors['name'] = 'Name contains invalid characters'
    
    # Validate email
    if not data.get('email'):
        errors['email'] = 'Email is required'
    else:
        try:
            validate_email(data['email'])
        except EmailNotValidError:
            errors['email'] = 'Invalid email format'
    
    # Validate message
    if not data.get('message') or len(data['message'].strip()) < 10:
        errors['message'] = 'Message must be at least 10 characters'
    elif len(data['message']) > 5000:
        errors['message'] = 'Message is too long (max 5000 characters)'
    
    # Validate phone (optional)
    if data.get('phone'):
        if not re.match(r'^[\s+\-()0-9]+$', data['phone']):
            errors['phone'] = 'Invalid phone format'
        elif len(data['phone']) > 20:
            errors['phone'] = 'Phone number too long'
    
    return errors

def validate_project_data(data):
    """Validate project data"""
    errors = []
    
    if not data.get('title'):
        errors.append({'field': 'title', 'message': 'Title is required'})
    elif len(data['title']) < 3:
        errors.append({'field': 'title', 'message': 'Title must be at least 3 characters'})
    
    if not data.get('category'):
        errors.append({'field': 'category', 'message': 'Category is required'})
    
    if not data.get('description'):
        errors.append({'field': 'description', 'message': 'Description is required'})
    elif len(data['description']) < 10:
        errors.append({'field': 'description', 'message': 'Description must be at least 10 characters'})
    
    # Status validation
    if data.get('status'):
        valid_statuses = ['active', 'upcoming', 'maintenance', 'deprecated', 'archived']
        if data['status'] not in valid_statuses:
            errors.append({'field': 'status', 'message': f'Status must be one of: {", ".join(valid_statuses)}'})
    
    # Priority validation
    if data.get('priority'):
        try:
            priority = int(data['priority'])
            if priority < 0 or priority > 10:
                errors.append({'field': 'priority', 'message': 'Priority must be between 0 and 10'})
        except ValueError:
            errors.append({'field': 'priority', 'message': 'Priority must be a number'})
    
    return errors

def validate_testimonial_data(data):
    """Validate testimonial data"""
    errors = {}
    
    if not data.get('client_name') or len(data['client_name'].strip()) < 2:
        errors['client_name'] = 'Name is required'
    elif not re.match(r'^[a-zA-Z\s\-.\']+$', data['client_name']):
        errors['client_name'] = 'Name contains invalid characters'
    
    if not data.get('feedback') or len(data['feedback'].strip()) < 10:
        errors['feedback'] = 'Feedback must be at least 10 characters'
    elif len(data['feedback']) > 2000:
        errors['feedback'] = 'Feedback is too long (max 2000 characters)'
    
    if data.get('rating'):
        try:
            rating = int(data['rating'])
            if rating < 1 or rating > 5:
                errors['rating'] = 'Rating must be between 1 and 5'
        except ValueError:
            errors['rating'] = 'Invalid rating'
    
    return errors