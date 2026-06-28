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
    errors = {}
    
    if not data.get('title') or len(data['title'].strip()) < 2:
        errors['title'] = 'Title is required'
    
    if not data.get('category') or len(data['category'].strip()) < 2:
        errors['category'] = 'Category is required'
    
    if not data.get('description') or len(data['description'].strip()) < 10:
        errors['description'] = 'Description must be at least 10 characters'
    
    # Validate URLs if provided
    url_fields = ['demo_url', 'video_url', 'image_url']
    for field in url_fields:
        if data.get(field):
            if not re.match(r'^https?://', data[field]):
                errors[field] = f'Invalid {field} format'
    
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