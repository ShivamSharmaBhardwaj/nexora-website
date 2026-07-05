from flask import Blueprint, request, jsonify, send_file
import json
import os
import uuid
import tempfile
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from config import get_db
from middleware.auth import token_required
from middleware.validation import sanitize_input
import PyPDF2
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageDraw, ImageFont
import qrcode
from io import BytesIO
import base64
import re
from docx import Document
import openpyxl
import shutil
import hashlib
import magic
import mimetypes

# Create blueprint WITHOUT url_prefix
tools_bp = Blueprint('tools_bp', __name__)
tools_bp.strict_slashes = False

# ============================================
# ✅ GLOBAL VARIABLES - MUST BE AT TOP
# ============================================

usage_tracking = {}

# ============================================
# 🔒 SECURITY CONFIGURATIONS
# ============================================

# File size limits (in bytes)
MAX_FILE_SIZE = {
    'default': 10 * 1024 * 1024,      # 10MB
    'pdf': 10 * 1024 * 1024,           # 10MB
    'image': 10 * 1024 * 1024,         # 10MB
    'batch': 15 * 1024 * 1024,         # 15MB (for batch operations)
}

# Allowed file extensions and MIME types
ALLOWED_EXTENSIONS = {
    'pdf': '.pdf',
    'image': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'],
    'all': ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff']
}

ALLOWED_MIME_TYPES = {
    'pdf': 'application/pdf',
    'image': [
        'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 
        'image/webp', 'image/tiff', 'image/x-ms-bmp'
    ]
}

# ============================================
# 🔒 SECURITY FUNCTIONS
# ============================================

def validate_file_type(file, expected_type='pdf'):
    """
    Validate file type using both extension and MIME type
    Returns: (is_valid, error_message)
    """
    try:
        # Check file extension
        filename = file.filename or ''
        ext = os.path.splitext(filename)[1].lower()
        
        if expected_type == 'pdf':
            if ext != '.pdf':
                return False, "Only PDF files are allowed"
        
        elif expected_type == 'image':
            if ext not in ALLOWED_EXTENSIONS['image']:
                return False, "Only image files are allowed (JPG, PNG, GIF, BMP, WEBP, TIFF)"
        
        # Check MIME type using python-magic
        file_bytes = file.read(1024)
        file.seek(0)  # Reset file pointer
        
        mime = magic.from_buffer(file_bytes, mime=True)
        
        expected_mimes = ALLOWED_MIME_TYPES.get(expected_type, [])
        if isinstance(expected_mimes, str):
            expected_mimes = [expected_mimes]
        
        if expected_type == 'pdf' and mime != 'application/pdf':
            return False, "Invalid PDF file (MIME type mismatch)"
        
        if expected_type == 'image' and mime not in expected_mimes:
            return False, f"Invalid image file (MIME type: {mime})"
        
        return True, ""
        
    except Exception as e:
        print(f"File validation error: {str(e)}")
        # Fallback: check extension only
        return True, ""

def validate_file_size(file, max_size=None):
    """
    Validate file size
    """
    max_size = max_size or MAX_FILE_SIZE['default']
    
    # Get file size
    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    
    if size > max_size:
        return False, f"File size exceeds {max_size // (1024*1024)}MB limit (Current: {size // (1024*1024)}MB)"
    
    return True, ""

def detect_malicious_content(file_bytes):
    """
    Detect potentially malicious content in files
    """
    try:
        # Check for executable signatures
        executable_signatures = [
            b'MZ',  # Windows EXE
            b'\x7fELF',  # Linux ELF
            b'PK\x03\x04',  # ZIP (could be malicious)
            b'%PDF',  # PDF (valid)
        ]
        
        # Check first 50 bytes for suspicious patterns
        header = file_bytes[:50]
        
        # Check for script injection patterns
        suspicious_patterns = [
            b'<script>', b'javascript:', b'data:text/html',
            b'exec(', b'eval(', b'system(', b'passthru(',
            b'<?php', b'<%%', b'<%', b'<jsp:'
        ]
        
        for pattern in suspicious_patterns:
            if pattern in header:
                return True, f"Potentially malicious content detected (pattern: {pattern.decode('utf-8', errors='ignore')})"
        
        # Check for double extensions (e.g., file.pdf.exe)
        return False, ""
        
    except Exception as e:
        print(f"Malicious content detection error: {str(e)}")
        return False, ""

def sanitize_filename(filename):
    """
    Sanitize filename to prevent path traversal attacks
    """
    # Remove path traversal attempts
    filename = filename.replace('../', '').replace('..\\', '')
    filename = filename.replace('/../', '').replace('\\..\\', '')
    
    # Remove dangerous characters
    dangerous_chars = [';', '&', '|', '`', '$', '(', ')', '<', '>', '{', '}', '[', ']', '*', '?']
    for char in dangerous_chars:
        filename = filename.replace(char, '')
    
    # Use secure_filename from werkzeug
    filename = secure_filename(filename)
    
    # If filename becomes empty, generate a random one
    if not filename:
        filename = f"file_{uuid.uuid4().hex[:8]}"
    
    return filename

def cleanup_temp_files(file_paths):
    """
    Safely cleanup temporary files
    """
    for path in file_paths:
        try:
            if os.path.exists(path):
                os.remove(path)
        except Exception as e:
            print(f"Cleanup error for {path}: {str(e)}")

def get_client_ip(request):
    """
    Get client IP address safely
    """
    # Check for proxy headers
    forwarded = request.headers.get('X-Forwarded-For')
    if forwarded:
        # Get the first IP in the list (client IP)
        ips = forwarded.split(',')
        ip = ips[0].strip()
        # Validate IP format (basic check)
        if re.match(r'^(\d{1,3}\.){3}\d{1,3}$', ip):
            return ip
    
    return request.remote_addr or '0.0.0.0'

def is_rate_limited(ip, tool_name, limit=10, window=60):
    """
    Rate limiting: Max 'limit' requests per 'window' seconds
    """
    key = f"rate_limit:{tool_name}:{ip}"
    current_time = datetime.now().timestamp()
    
    # Clean old entries (if too many)
    if key in usage_tracking and 'requests' in usage_tracking[key]:
        # Remove requests older than window
        cutoff = current_time - window
        usage_tracking[key]['requests'] = [
            t for t in usage_tracking[key]['requests'] 
            if t > cutoff
        ]
        
        # Check if limit exceeded
        if len(usage_tracking[key]['requests']) >= limit:
            return True
    
    return False

def track_request(ip, tool_name):
    """
    Track request for rate limiting
    """
    key = f"rate_limit:{tool_name}:{ip}"
    current_time = datetime.now().timestamp()
    
    if key not in usage_tracking:
        usage_tracking[key] = {'requests': []}
    
    if 'requests' not in usage_tracking[key]:
        usage_tracking[key]['requests'] = []
    
    usage_tracking[key]['requests'].append(current_time)

# ============================================
# WATERMARK CONFIGURATION
# ============================================

WATERMARK_TEXT = "Made with ❤️ by Krynova Technologies"
WATERMARK_FOOTER = "\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nMade with ❤️ by Krynova Technologies\nVisit: https://krynovatechnology.pythonanywhere.com\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

def should_add_watermark(is_premium):
    """Determine if watermark should be added"""
    return not is_premium

def add_watermark_to_text(content, is_premium):
    """Add watermark footer to text content"""
    if is_premium:
        return content
    return content + WATERMARK_FOOTER

def add_watermark_to_image(image, is_premium):
    """Add watermark to image using PIL"""
    if is_premium:
        return image
    
    try:
        draw = ImageDraw.Draw(image)
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
        except:
            font = ImageFont.load_default()
        
        watermark_text = "Made with ❤️ by Krynova"
        bbox = draw.textbbox((0, 0), watermark_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (image.width - text_width) // 2
        y = image.height - text_height - 20
        
        # Semi-transparent background
        overlay = Image.new('RGBA', image.size, (255, 255, 255, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.rectangle(
            [x-10, y-10, x+text_width+10, y+text_height+10],
            fill=(255, 255, 255, 180)
        )
        image = Image.alpha_composite(image.convert('RGBA'), overlay)
        
        draw = ImageDraw.Draw(image)
        draw.text((x, y), watermark_text, fill=(80, 80, 80, 200), font=font)
        
        return image
    except Exception as e:
        print(f"Watermark error: {str(e)}")
        return image

# ============================================
# ✅ USAGE TRACKING FUNCTIONS
# ============================================

def get_usage_count(tool_name, ip_address):
    """Get usage count for a specific tool and IP"""
    key = f"{tool_name}:{ip_address}"
    today = datetime.now().strftime('%Y-%m-%d')
    
    if key not in usage_tracking:
        usage_tracking[key] = {'date': today, 'count': 0}
    
    if usage_tracking[key]['date'] != today:
        usage_tracking[key] = {'date': today, 'count': 0}
    
    return usage_tracking[key]['count']

def increment_usage(tool_name, ip_address):
    """Increment usage count for a specific tool and IP"""
    key = f"{tool_name}:{ip_address}"
    today = datetime.now().strftime('%Y-%m-%d')
    
    if key not in usage_tracking:
        usage_tracking[key] = {'date': today, 'count': 0}
    
    if usage_tracking[key]['date'] != today:
        usage_tracking[key] = {'date': today, 'count': 0}
    
    usage_tracking[key]['count'] += 1
    return usage_tracking[key]['count']

# ============================================
# TEST ROUTE
# ============================================

@tools_bp.route('/test', methods=['GET', 'OPTIONS'])
def test_tools():
    """Test route to verify tools blueprint is working"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response
    
    return jsonify({
        'success': True,
        'message': 'Tools API is working!',
        'available_tools': [
            '/resume-builder (POST)',
            '/cover-letter (POST)',
            '/qr-generator (POST)',
            '/pdf-to-image (POST)',
            '/pdf-to-word (POST)',
            '/pdf-to-excel (POST)',
            '/image-to-pdf (POST)',
            '/pdf-compressor (POST)',
            '/merge-pdf (POST)',
            '/split-pdf (POST)',
            '/image-resizer (POST)',
            '/text-to-pdf (POST)',
            '/premium/check (GET)',
            '/premium/subscribe (POST)'
        ]
    })

# ============================================
# 1. RESUME BUILDER
# ============================================

@tools_bp.route('/resume-builder', methods=['POST', 'OPTIONS'])
def build_resume():
    """Generate ATS-friendly resume (Free: 3 per day, Premium: Unlimited)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        ip_address = get_client_ip(request)
        
        # Rate limiting: 20 requests per minute
        if is_rate_limited(ip_address, 'resume_builder', limit=20, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'resume_builder')
        
        usage_count = get_usage_count('resume_builder', ip_address)
        is_premium = data.get('is_premium', False)
        
        if not is_premium and usage_count >= 3:
            return jsonify({
                'success': False,
                'error': 'Free limit reached. Please upgrade to premium for unlimited access.',
                'limit_reached': True,
                'usage_count': usage_count,
                'max_free': 3
            }), 403
        
        # Validate required fields
        required = ['name', 'email', 'skills']
        for field in required:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'Missing field: {field}'}), 400
        
        # Sanitize inputs
        name = sanitize_input(data.get('name', ''))
        email = sanitize_input(data.get('email', ''))
        skills = sanitize_input(data.get('skills', ''))
        
        # Generate resume content
        resume_content = generate_resume_content(data)
        
        # ✅ Add watermark for free users
        resume_content = add_watermark_to_text(resume_content, is_premium)
        
        increment_usage('resume_builder', ip_address)
        
        return jsonify({
            'success': True,
            'resume': resume_content,
            'usage_count': get_usage_count('resume_builder', ip_address),
            'remaining_free': max(0, 3 - get_usage_count('resume_builder', ip_address)),
            'is_premium': is_premium,
            'has_watermark': should_add_watermark(is_premium)
        })
        
    except Exception as e:
        print(f"Resume Builder Error: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# 2. COVER LETTER GENERATOR
# ============================================

@tools_bp.route('/cover-letter', methods=['POST', 'OPTIONS'])
def generate_cover_letter():
    """Generate cover letter (Free: 3 per day, Premium: Unlimited)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        ip_address = get_client_ip(request)
        
        # Rate limiting
        if is_rate_limited(ip_address, 'cover_letter', limit=20, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'cover_letter')
        
        usage_count = get_usage_count('cover_letter', ip_address)
        is_premium = data.get('is_premium', False)
        
        if not is_premium and usage_count >= 3:
            return jsonify({
                'success': False,
                'error': 'Free limit reached. Please upgrade to premium for unlimited access.',
                'limit_reached': True,
                'usage_count': usage_count,
                'max_free': 3
            }), 403
        
        required = ['name', 'position', 'company', 'skills']
        for field in required:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'Missing field: {field}'}), 400
        
        cover_letter = generate_cover_letter_content(data)
        
        # ✅ Add watermark for free users
        cover_letter = add_watermark_to_text(cover_letter, is_premium)
        
        increment_usage('cover_letter', ip_address)
        
        return jsonify({
            'success': True,
            'cover_letter': cover_letter,
            'usage_count': get_usage_count('cover_letter', ip_address),
            'remaining_free': max(0, 3 - get_usage_count('cover_letter', ip_address)),
            'is_premium': is_premium,
            'has_watermark': should_add_watermark(is_premium)
        })
        
    except Exception as e:
        print(f"Cover Letter Error: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# 3. QR CODE GENERATOR
# ============================================

@tools_bp.route('/qr-generator', methods=['POST', 'OPTIONS'])
def generate_qr():
    """Generate QR Code (Free: 5 per day, Premium: Unlimited)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        ip_address = get_client_ip(request)
        
        # Rate limiting
        if is_rate_limited(ip_address, 'qr_generator', limit=30, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'qr_generator')
        
        usage_count = get_usage_count('qr_generator', ip_address)
        is_premium = data.get('is_premium', False)
        
        if not is_premium and usage_count >= 5:
            return jsonify({
                'success': False,
                'error': 'Free limit reached. Please upgrade to premium for unlimited access.',
                'limit_reached': True,
                'usage_count': usage_count,
                'max_free': 5
            }), 403
        
        content = data.get('content', '')
        if not content:
            return jsonify({'success': False, 'error': 'Content is required'}), 400
        
        # Sanitize content - limit length
        content = content[:5000]  # Max 5000 chars
        
        # Get style and size from request
        style = data.get('style', 'default')
        size = min(int(data.get('size', 250)), 1000)  # Max 1000px
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(content)
        qr.make(fit=True)
        
        # Get colors based on style
        color_map = {
            'default': ('black', 'white'),
            'blue': ('#2563eb', 'white'),
            'green': ('#16a34a', 'white'),
            'purple': ('#7c3aed', 'white'),
            'red': ('#dc2626', 'white'),
            'dark': ('#1f2937', '#f3f4f6'),
        }
        fill_color, back_color = color_map.get(style, ('black', 'white'))
        
        img = qr.make_image(fill_color=fill_color, back_color=back_color)
        
        # Resize if needed
        if size and size != 250:
            img = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # ✅ Add watermark for free users
        if should_add_watermark(is_premium):
            img = add_watermark_to_image(img, is_premium)
        
        # Convert to base64
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        increment_usage('qr_generator', ip_address)
        
        return jsonify({
            'success': True,
            'qr_code': f"data:image/png;base64,{img_base64}",
            'usage_count': get_usage_count('qr_generator', ip_address),
            'remaining_free': max(0, 5 - get_usage_count('qr_generator', ip_address)),
            'is_premium': is_premium,
            'has_watermark': should_add_watermark(is_premium)
        })
        
    except Exception as e:
        print(f"QR Generator Error: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# 4. PDF TO IMAGE
# ============================================

@tools_bp.route('/pdf-to-image', methods=['POST', 'OPTIONS'])
def pdf_to_image():
    """Convert PDF to Image (Free: 3 pages per day, Premium: Unlimited)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    try:
        file = request.files['file']
        ip_address = get_client_ip(request)
        
        # Rate limiting
        if is_rate_limited(ip_address, 'pdf_to_image', limit=15, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'pdf_to_image')
        
        # ✅ Security: Validate file type
        is_valid, error = validate_file_type(file, 'pdf')
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        # ✅ Security: Validate file size
        is_valid, error = validate_file_size(file, MAX_FILE_SIZE['pdf'])
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        is_premium = request.form.get('is_premium', 'false').lower() == 'true'
        
        usage_count = get_usage_count('pdf_to_image', ip_address)
        
        if not is_premium and usage_count >= 3:
            return jsonify({
                'success': False,
                'error': f'Free limit reached. You can convert {3 - usage_count} more pages today.',
                'limit_reached': True,
                'usage_count': usage_count,
                'max_free': 3,
                'remaining_pages': max(0, 3 - usage_count)
            }), 403
        
        # Save uploaded file with secure filename
        filename = sanitize_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}_{filename}")
        file.save(temp_path)
        
        # ✅ Security: Check for malicious content
        with open(temp_path, 'rb') as f:
            file_bytes = f.read()
            is_malicious, error = detect_malicious_content(file_bytes)
            if is_malicious:
                cleanup_temp_files([temp_path])
                return jsonify({'success': False, 'error': error}), 400
        
        # Use PyPDF2 to extract pages (NO PyMuPDF)
        with open(temp_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            total_pages = len(pdf_reader.pages)
            
            # Determine how many pages to convert
            limit = total_pages if is_premium else min(3, total_pages)
            
            image_list = []
            for i in range(limit):
                page = pdf_reader.pages[i]
                
                # Extract text (for preview)
                text = page.extract_text() or ''
                
                # Create image representation using PIL
                img = Image.new('RGB', (800, 1000), color='white')
                draw = ImageDraw.Draw(img)
                
                try:
                    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
                except:
                    font = ImageFont.load_default()
                
                # Draw page content (text preview)
                draw.text((50, 50), f"Page {i+1} of {total_pages}", fill='black', font=font)
                draw.text((50, 80), f"Content preview:", fill='black', font=font)
                
                # Show extracted text (first 200 chars)
                preview_text = text[:200] if text else 'No text extracted (scanned page)'
                y_pos = 110
                for line in preview_text.split('\n')[:10]:
                    draw.text((50, y_pos), line[:80], fill='gray', font=font)
                    y_pos += 20
                
                # Convert to base64
                img_buffer = BytesIO()
                img.save(img_buffer, format='PNG')
                
                # ✅ Add watermark for free users
                if should_add_watermark(is_premium):
                    watermarked_img = Image.open(img_buffer)
                    watermarked_img = add_watermark_to_image(watermarked_img, is_premium)
                    img_buffer = BytesIO()
                    watermarked_img.save(img_buffer, format='PNG')
                
                img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
                
                image_list.append({
                    'page': i + 1,
                    'image': f"data:image/png;base64,{img_base64}"
                })
        
        # Clean up
        cleanup_temp_files([temp_path])
        
        # Increment usage for each page converted
        for _ in range(len(image_list)):
            increment_usage('pdf_to_image', ip_address)
        
        return jsonify({
            'success': True,
            'images': image_list,
            'total_pages': total_pages,
            'converted': len(image_list),
            'usage_count': get_usage_count('pdf_to_image', ip_address),
            'remaining_free': max(0, 3 - get_usage_count('pdf_to_image', ip_address)) if not is_premium else "Unlimited",
            'is_premium': is_premium,
            'has_watermark': should_add_watermark(is_premium)
        })
        
    except Exception as e:
        print(f"PDF to Image Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# 5. PDF TO WORD
# ============================================

@tools_bp.route('/pdf-to-word', methods=['POST', 'OPTIONS'])
def pdf_to_word():
    """Convert PDF to Word (Free: 2 per day, Premium: Unlimited)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    try:
        file = request.files['file']
        ip_address = get_client_ip(request)
        
        # Rate limiting
        if is_rate_limited(ip_address, 'pdf_to_word', limit=15, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'pdf_to_word')
        
        # ✅ Security: Validate file type
        is_valid, error = validate_file_type(file, 'pdf')
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        # ✅ Security: Validate file size
        is_valid, error = validate_file_size(file, MAX_FILE_SIZE['pdf'])
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        is_premium = request.form.get('is_premium', 'false').lower() == 'true'
        
        usage_count = get_usage_count('pdf_to_word', ip_address)
        
        if not is_premium and usage_count >= 2:
            return jsonify({
                'success': False,
                'error': 'Free limit reached. Please upgrade to premium for unlimited access.',
                'limit_reached': True,
                'usage_count': usage_count,
                'max_free': 2
            }), 403
        
        filename = sanitize_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}_{filename}")
        file.save(temp_path)
        
        # ✅ Security: Check for malicious content
        with open(temp_path, 'rb') as f:
            file_bytes = f.read()
            is_malicious, error = detect_malicious_content(file_bytes)
            if is_malicious:
                cleanup_temp_files([temp_path])
                return jsonify({'success': False, 'error': error}), 400
        
        text = extract_text_from_pdf(temp_path)
        
        doc = Document()
        doc.add_heading('PDF Content', 0)
        doc.add_paragraph(text)
        
        # ✅ Add watermark for free users
        if should_add_watermark(is_premium):
            doc.add_paragraph()
            doc.add_paragraph('─' * 50)
            doc.add_paragraph('Made with ❤️ by Krynova Technologies')
            doc.add_paragraph('Visit: https://krynovatechnology.pythonanywhere.com')
            doc.add_paragraph('─' * 50)
        
        doc_bytes = BytesIO()
        doc.save(doc_bytes)
        doc_bytes.seek(0)
        doc_base64 = base64.b64encode(doc_bytes.read()).decode()
        
        cleanup_temp_files([temp_path])
        
        increment_usage('pdf_to_word', ip_address)
        
        return jsonify({
            'success': True,
            'file': doc_base64,
            'filename': filename.replace('.pdf', '.docx'),
            'usage_count': get_usage_count('pdf_to_word', ip_address),
            'remaining_free': max(0, 2 - get_usage_count('pdf_to_word', ip_address)),
            'is_premium': is_premium,
            'has_watermark': should_add_watermark(is_premium)
        })
        
    except Exception as e:
        print(f"PDF to Word Error: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# 6. PDF TO EXCEL
# ============================================

@tools_bp.route('/pdf-to-excel', methods=['POST', 'OPTIONS'])
def pdf_to_excel():
    """Convert PDF to Excel (Free: 2 per day, Premium: Unlimited)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    try:
        file = request.files['file']
        ip_address = get_client_ip(request)
        
        # Rate limiting
        if is_rate_limited(ip_address, 'pdf_to_excel', limit=15, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'pdf_to_excel')
        
        # ✅ Security: Validate file type
        is_valid, error = validate_file_type(file, 'pdf')
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        # ✅ Security: Validate file size
        is_valid, error = validate_file_size(file, MAX_FILE_SIZE['pdf'])
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        is_premium = request.form.get('is_premium', 'false').lower() == 'true'
        
        usage_count = get_usage_count('pdf_to_excel', ip_address)
        
        if not is_premium and usage_count >= 2:
            return jsonify({
                'success': False,
                'error': 'Free limit reached. Please upgrade to premium for unlimited access.',
                'limit_reached': True,
                'usage_count': usage_count,
                'max_free': 2
            }), 403
        
        filename = sanitize_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}_{filename}")
        file.save(temp_path)
        
        # ✅ Security: Check for malicious content
        with open(temp_path, 'rb') as f:
            file_bytes = f.read()
            is_malicious, error = detect_malicious_content(file_bytes)
            if is_malicious:
                cleanup_temp_files([temp_path])
                return jsonify({'success': False, 'error': error}), 400
        
        text = extract_text_from_pdf(temp_path)
        
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "PDF Content"
        
        # Split text into rows
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if i < 10000:  # Limit rows to prevent abuse
                ws.cell(row=i+1, column=1, value=line[:1000])  # Limit cell length
        
        # ✅ Add watermark for free users
        if should_add_watermark(is_premium):
            max_row = ws.max_row + 2
            ws.cell(row=max_row, column=1, value='─' * 30)
            ws.cell(row=max_row+1, column=1, value='Made with ❤️ by Krynova Technologies')
            ws.cell(row=max_row+2, column=1, value='Visit: https://krynovatechnology.pythonanywhere.com')
            ws.cell(row=max_row+3, column=1, value='─' * 30)
        
        excel_bytes = BytesIO()
        wb.save(excel_bytes)
        excel_bytes.seek(0)
        excel_base64 = base64.b64encode(excel_bytes.read()).decode()
        
        cleanup_temp_files([temp_path])
        
        increment_usage('pdf_to_excel', ip_address)
        
        return jsonify({
            'success': True,
            'file': excel_base64,
            'filename': filename.replace('.pdf', '.xlsx'),
            'usage_count': get_usage_count('pdf_to_excel', ip_address),
            'remaining_free': max(0, 2 - get_usage_count('pdf_to_excel', ip_address)),
            'is_premium': is_premium,
            'has_watermark': should_add_watermark(is_premium)
        })
        
    except Exception as e:
        print(f"PDF to Excel Error: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# 7. IMAGE TO PDF
# ============================================

@tools_bp.route('/image-to-pdf', methods=['POST', 'OPTIONS'])
def image_to_pdf():
    """Convert Images to PDF (Free: Single images unlimited, Bulk: 2 per day, Premium: Unlimited)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    if 'files' not in request.files:
        return jsonify({'success': False, 'error': 'No files uploaded'}), 400
    
    try:
        files = request.files.getlist('files')
        ip_address = get_client_ip(request)
        
        # Rate limiting
        if is_rate_limited(ip_address, 'image_to_pdf', limit=15, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'image_to_pdf')
        
        is_premium = request.form.get('is_premium', 'false').lower() == 'true'
        
        # ✅ Security: Validate each file
        for file in files:
            is_valid, error = validate_file_type(file, 'image')
            if not is_valid:
                return jsonify({'success': False, 'error': f'Invalid file: {file.filename} - {error}'}), 400
            
            is_valid, error = validate_file_size(file, MAX_FILE_SIZE['image'])
            if not is_valid:
                return jsonify({'success': False, 'error': f'File too large: {file.filename} - {error}'}), 400
        
        # Get options from request
        options = {}
        try:
            options = json.loads(request.form.get('options', '{}'))
        except:
            pass
        
        # ✅ FIX: Single image = unlimited, Bulk = limited
        is_bulk = len(files) > 1
        
        # Track bulk usage for free users
        bulk_key = f"bulk_image_to_pdf:{ip_address}"
        today = datetime.now().strftime('%Y-%m-%d')
        
        if not is_premium and is_bulk:
            bulk_data = usage_tracking.get(bulk_key, {'date': '', 'count': 0})
            if bulk_data['date'] != today:
                bulk_data = {'date': today, 'count': 0}
            
            if bulk_data['count'] >= 2:
                return jsonify({
                    'success': False,
                    'error': 'Bulk conversion limit reached. Free users can convert 2 bulk (2+ images) per day. Upgrade to premium for unlimited.',
                    'limit_reached': True,
                    'limit_type': 'bulk',
                    'max_free': 2,
                    'used_today': bulk_data['count']
                }), 403
            
            bulk_data['count'] += 1
            usage_tracking[bulk_key] = bulk_data
        
        # Process images to PDF using PIL
        image_list = []
        temp_paths = []
        
        for file in files:
            filename = sanitize_filename(file.filename)
            temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}_{filename}")
            file.save(temp_path)
            temp_paths.append(temp_path)
            
            # Open and convert image
            img = Image.open(temp_path)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize if too large (max 2000px)
            max_dim = 2000
            if img.width > max_dim or img.height > max_dim:
                img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
            
            image_list.append(img)
        
        # Create PDF from images
        pdf_buffer = BytesIO()
        if image_list:
            image_list[0].save(
                pdf_buffer,
                format='PDF',
                save_all=True,
                append_images=image_list[1:] if len(image_list) > 1 else [],
                resolution=100.0,
                quality=85 if not is_premium else 95
            )
        
        pdf_bytes = pdf_buffer.getvalue()
        
        # ✅ Add watermark for free users (as text footer using PyPDF2)
        if should_add_watermark(is_premium):
            try:
                from PyPDF2 import PdfReader, PdfWriter
                from reportlab.pdfgen import canvas
                from reportlab.lib.pagesizes import letter
                from io import BytesIO
                
                # Create watermark page
                watermark_buffer = BytesIO()
                c = canvas.Canvas(watermark_buffer, pagesize=letter)
                c.setFont("Helvetica", 10)
                c.setFillColorRGB(0.5, 0.5, 0.5, 0.3)
                c.drawRightString(500, 30, "Made with ❤️ by Krynova")
                c.save()
                watermark_buffer.seek(0)
                
                # Merge with PDF
                reader = PdfReader(BytesIO(pdf_bytes))
                writer = PdfWriter()
                watermark_reader = PdfReader(watermark_buffer)
                watermark_page = watermark_reader.pages[0]
                
                for page in reader.pages:
                    page.merge_page(watermark_page)
                    writer.add_page(page)
                
                final_buffer = BytesIO()
                writer.write(final_buffer)
                pdf_bytes = final_buffer.getvalue()
            except Exception as e:
                print(f"Watermark error: {str(e)}")
        
        pdf_base64 = base64.b64encode(pdf_bytes).decode()
        
        # Clean up
        cleanup_temp_files(temp_paths)
        
        # For single images, only track total usage for display purposes
        if not is_premium:
            increment_usage('image_to_pdf', ip_address)
            current_usage = get_usage_count('image_to_pdf', ip_address)
            remaining = max(0, 999 - current_usage)
        else:
            current_usage = 0
            remaining = "Unlimited"
        
        return jsonify({
            'success': True,
            'file': pdf_base64,
            'filename': f'converted_{datetime.now().strftime("%Y%m%d")}.pdf',
            'pages': len(image_list),
            'usage_count': current_usage,
            'remaining_free': remaining,
            'is_premium': is_premium,
            'is_bulk': is_bulk,
            'has_watermark': should_add_watermark(is_premium)
        })
        
    except Exception as e:
        print(f"Image to PDF Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# 8. PDF COMPRESSOR
# ============================================

@tools_bp.route('/pdf-compressor', methods=['POST', 'OPTIONS'])
def compress_pdf():
    """Compress PDF (Free: Unlimited single, 3 batch/day, Premium: Unlimited)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    try:
        file = request.files['file']
        ip_address = get_client_ip(request)
        
        # Rate limiting
        if is_rate_limited(ip_address, 'pdf_compressor', limit=15, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'pdf_compressor')
        
        # ✅ Security: Validate file type
        is_valid, error = validate_file_type(file, 'pdf')
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        # ✅ Security: Validate file size
        is_valid, error = validate_file_size(file, MAX_FILE_SIZE['pdf'])
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        is_premium = request.form.get('is_premium', 'false').lower() == 'true'
        
        # Check if this is a batch request
        is_batch = request.form.get('batch_mode', 'false').lower() == 'true'
        
        # Track batch usage for free users
        batch_key = f"batch_pdf_compressor:{ip_address}"
        today = datetime.now().strftime('%Y-%m-%d')
        
        if not is_premium and is_batch:
            batch_data = usage_tracking.get(batch_key, {'date': '', 'count': 0})
            if batch_data['date'] != today:
                batch_data = {'date': today, 'count': 0}
            
            if batch_data['count'] >= 3:
                return jsonify({
                    'success': False,
                    'error': 'Batch compression limit reached. Free users can compress 3 batches per day. Upgrade to premium for unlimited.',
                    'limit_reached': True,
                    'limit_type': 'batch',
                    'max_free': 3,
                    'used_today': batch_data['count']
                }), 403
            
            batch_data['count'] += 1
            usage_tracking[batch_key] = batch_data
        
        # Save uploaded file
        filename = sanitize_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}_{filename}")
        file.save(temp_path)
        
        # ✅ Security: Check for malicious content
        with open(temp_path, 'rb') as f:
            file_bytes = f.read()
            is_malicious, error = detect_malicious_content(file_bytes)
            if is_malicious:
                cleanup_temp_files([temp_path])
                return jsonify({'success': False, 'error': error}), 400
        
        # Read original size
        original_size = os.path.getsize(temp_path)
        
        # ============================================
        # PDF COMPRESSION USING PyPDF2 (NO PyMuPDF)
        # ============================================
        
        with open(temp_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            pdf_writer = PyPDF2.PdfWriter()
            
            for page in pdf_reader.pages:
                try:
                    page.compress_content_streams()
                except:
                    pass
                pdf_writer.add_page(page)
            
            # Remove metadata to reduce size
            pdf_writer.add_metadata({
                '/Creator': 'Krynova PDF Compressor',
                '/Producer': 'Krynova'
            })
            
            compressed_buffer = BytesIO()
            pdf_writer.write(compressed_buffer)
            compressed_data = compressed_buffer.getvalue()
            compressed_size = len(compressed_data)
        
        # Calculate saved percentage
        if original_size > 0 and compressed_size > 0:
            saved_percentage = int((1 - compressed_size / original_size) * 100)
            if saved_percentage < 0:
                saved_percentage = 0
        else:
            saved_percentage = 0
        
        # If compression didn't reduce size, use original file
        if compressed_size < original_size:
            final_data = compressed_data
            final_size = compressed_size
            final_saved = saved_percentage
        else:
            with open(temp_path, 'rb') as f:
                final_data = f.read()
            final_size = original_size
            final_saved = 0
        
        # Clean up temp file
        cleanup_temp_files([temp_path])
        
        # For single files, we don't enforce any limit
        usage_count = get_usage_count('pdf_compressor', ip_address)
        
        if not is_premium:
            increment_usage('pdf_compressor', ip_address)
            current_usage = get_usage_count('pdf_compressor', ip_address)
            if is_batch:
                remaining = max(0, 3 - batch_data['count'])
            else:
                remaining = "Unlimited"
        else:
            current_usage = 0
            remaining = "Unlimited"
        
        # Return compressed file
        pdf_base64 = base64.b64encode(final_data).decode()
        
        return jsonify({
            'success': True,
            'file': pdf_base64,
            'filename': f'compressed_{filename}',
            'original_size': original_size,
            'compressed_size': final_size,
            'saved_percentage': final_saved,
            'usage_count': current_usage,
            'remaining_free': remaining,
            'is_premium': is_premium,
            'is_batch': is_batch,
            'batch_remaining': max(0, 3 - batch_data['count']) if not is_premium and is_batch else "Unlimited",
            'has_watermark': False  # No watermark for compression
        })
        
    except Exception as e:
        print(f"PDF Compressor Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# 9. MERGE PDF
# ============================================

@tools_bp.route('/merge-pdf', methods=['POST', 'OPTIONS'])
def merge_pdf():
    """Merge PDFs (Free: Up to 35 files, Premium: Unlimited)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    if 'files' not in request.files:
        return jsonify({'success': False, 'error': 'No files uploaded'}), 400
    
    try:
        files = request.files.getlist('files')
        ip_address = get_client_ip(request)
        
        # Rate limiting
        if is_rate_limited(ip_address, 'merge_pdf', limit=10, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'merge_pdf')
        
        is_premium = request.form.get('is_premium', 'false').lower() == 'true'
        
        # ✅ Security: Validate each file
        for file in files:
            is_valid, error = validate_file_type(file, 'pdf')
            if not is_valid:
                return jsonify({'success': False, 'error': f'Invalid file: {file.filename} - {error}'}), 400
            
            is_valid, error = validate_file_size(file, MAX_FILE_SIZE['pdf'])
            if not is_valid:
                return jsonify({'success': False, 'error': f'File too large: {file.filename} - {error}'}), 400
        
        # ✅ Check file count limit: Free = 35 max, Premium = Unlimited
        MAX_FILES_FREE = 35
        if not is_premium and len(files) > MAX_FILES_FREE:
            return jsonify({
                'success': False,
                'error': f'Free users can merge up to {MAX_FILES_FREE} files. You have {len(files)} files. Please upgrade to premium for unlimited files.',
                'limit_reached': True,
                'limit_type': 'file_count',
                'max_free': MAX_FILES_FREE,
                'file_count': len(files)
            }), 403
        
        # Check daily usage limit (3 per day for free)
        usage_count = get_usage_count('merge_pdf', ip_address)
        
        if not is_premium and usage_count >= 3:
            return jsonify({
                'success': False,
                'error': 'Daily merge limit reached (3 per day). Please upgrade to premium for unlimited merges.',
                'limit_reached': True,
                'limit_type': 'daily',
                'usage_count': usage_count,
                'max_free': 3
            }), 403
        
        # Get options
        options = {}
        try:
            options = json.loads(request.form.get('options', '{}'))
        except:
            pass
        
        # Create merger
        merger = PyPDF2.PdfMerger()
        temp_paths = []
        file_names = []
        
        # Process files one by one
        for idx, file in enumerate(files):
            filename = sanitize_filename(file.filename)
            file_names.append(filename)
            temp_path = os.path.join(tempfile.gettempdir(), f"merge_{uuid.uuid4().hex}_{filename}")
            file.save(temp_path)
            temp_paths.append(temp_path)
            
            # ✅ Security: Check for malicious content
            with open(temp_path, 'rb') as f:
                file_bytes = f.read()
                is_malicious, error = detect_malicious_content(file_bytes)
                if is_malicious:
                    cleanup_temp_files(temp_paths)
                    return jsonify({'success': False, 'error': error}), 400
            
            try:
                with open(temp_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    page_count = len(reader.pages)
                merger.append(temp_path)
            except Exception as e:
                cleanup_temp_files(temp_paths)
                return jsonify({
                    'success': False,
                    'error': f'Error processing file "{filename}". Please check if it\'s a valid PDF.'
                }), 400
        
        # Write merged PDF
        output_bytes = BytesIO()
        merger.write(output_bytes)
        merger.close()
        
        merged_data = output_bytes.getvalue()
        
        # Count total pages
        try:
            with BytesIO(merged_data) as f:
                reader = PyPDF2.PdfReader(f)
                total_pages = len(reader.pages)
        except:
            total_pages = len(files)
        
        # Clean up temp files
        cleanup_temp_files(temp_paths)
        
        # Only increment usage for free users
        if not is_premium:
            increment_usage('merge_pdf', ip_address)
            remaining_free = max(0, 3 - get_usage_count('merge_pdf', ip_address))
        else:
            remaining_free = "Unlimited"
        
        pdf_base64 = base64.b64encode(merged_data).decode()
        
        return jsonify({
            'success': True,
            'file': pdf_base64,
            'filename': f'merged_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf',
            'pages': len(files),
            'total_pages': total_pages,
            'file_count': len(files),
            'file_names': file_names,
            'usage_count': get_usage_count('merge_pdf', ip_address) if not is_premium else 0,
            'remaining_free': remaining_free,
            'max_files_free': MAX_FILES_FREE,
            'is_premium': is_premium,
            'has_watermark': False  # No watermark for merge
        })
        
    except Exception as e:
        print(f"Merge PDF Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# 10. SPLIT PDF
# ============================================

@tools_bp.route('/split-pdf', methods=['POST', 'OPTIONS'])
def split_pdf():
    """Split PDF (Free: 3 per day, Premium: Unlimited)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    try:
        file = request.files['file']
        ip_address = get_client_ip(request)
        
        # Rate limiting
        if is_rate_limited(ip_address, 'split_pdf', limit=15, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'split_pdf')
        
        # ✅ Security: Validate file type
        is_valid, error = validate_file_type(file, 'pdf')
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        # ✅ Security: Validate file size
        is_valid, error = validate_file_size(file, MAX_FILE_SIZE['pdf'])
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        is_premium = request.form.get('is_premium', 'false').lower() == 'true'
        
        usage_count = get_usage_count('split_pdf', ip_address)
        
        if not is_premium and usage_count >= 3:
            return jsonify({
                'success': False,
                'error': 'Free limit reached. Please upgrade to premium for unlimited access.',
                'limit_reached': True,
                'usage_count': usage_count,
                'max_free': 3
            }), 403
        
        filename = sanitize_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}_{filename}")
        file.save(temp_path)
        
        # ✅ Security: Check for malicious content
        with open(temp_path, 'rb') as f:
            file_bytes = f.read()
            is_malicious, error = detect_malicious_content(file_bytes)
            if is_malicious:
                cleanup_temp_files([temp_path])
                return jsonify({'success': False, 'error': error}), 400
        
        with open(temp_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            pages = []
            
            # Limit to 100 pages to prevent abuse
            max_pages = min(len(reader.pages), 100)
            
            for i in range(max_pages):
                writer = PyPDF2.PdfWriter()
                writer.add_page(reader.pages[i])
                
                page_bytes = BytesIO()
                writer.write(page_bytes)
                pages.append(base64.b64encode(page_bytes.getvalue()).decode())
        
        cleanup_temp_files([temp_path])
        
        increment_usage('split_pdf', ip_address)
        
        return jsonify({
            'success': True,
            'pages': pages,
            'total_pages': len(pages),
            'filename': filename.replace('.pdf', ''),
            'usage_count': get_usage_count('split_pdf', ip_address),
            'remaining_free': max(0, 3 - get_usage_count('split_pdf', ip_address)),
            'is_premium': is_premium,
            'has_watermark': False  # No watermark for split
        })
        
    except Exception as e:
        print(f"Split PDF Error: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# 11. IMAGE RESIZER
# ============================================

@tools_bp.route('/image-resizer', methods=['POST', 'OPTIONS'])
def resize_image():
    """Resize Image (Free: Unlimited, max 1200x1200, Premium: Unlimited, up to 8000x8000)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    try:
        file = request.files['file']
        ip_address = get_client_ip(request)
        
        # Rate limiting
        if is_rate_limited(ip_address, 'image_resizer', limit=30, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'image_resizer')
        
        # ✅ Security: Validate file type
        is_valid, error = validate_file_type(file, 'image')
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        # ✅ Security: Validate file size
        is_valid, error = validate_file_size(file, MAX_FILE_SIZE['image'])
        if not is_valid:
            return jsonify({'success': False, 'error': error}), 400
        
        is_premium = request.form.get('is_premium', 'false').lower() == 'true'
        
        width = int(request.form.get('width', 800))
        height = int(request.form.get('height', 600))
        
        # ✅ Free: Max 1200x1200, Premium: Up to 8000x8000
        max_dimension = 8000 if is_premium else 1200
        
        if width < 10 or height < 10:
            return jsonify({'success': False, 'error': 'Width and height must be at least 10px'}), 400
        
        if width > max_dimension or height > max_dimension:
            return jsonify({
                'success': False, 
                'error': f'Maximum dimension is {max_dimension}px. {"Upgrade to premium for larger sizes." if not is_premium else ""}',
                'limit_reached': True if not is_premium else False,
                'max_dimension': max_dimension,
                'is_premium': is_premium
            }), 400
        
        # Get options
        options = {}
        try:
            options = json.loads(request.form.get('options', '{}'))
        except:
            pass
        
        filename = sanitize_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}_{filename}")
        file.save(temp_path)
        
        # Open image
        img = Image.open(temp_path)
        original_size = img.size
        
        # ✅ Quality settings
        quality = options.get('quality', 'medium')
        quality_map = {
            'high': 95,
            'medium': 85,
            'low': 70
        }
        quality_value = quality_map.get(quality, 85)
        
        # ✅ Premium gets advanced resizing options
        if is_premium:
            resample = Image.Resampling.LANCZOS
            output_format = options.get('format', 'PNG')
            background = options.get('background', None)
        else:
            resample = Image.Resampling.BICUBIC
            output_format = 'PNG'
            background = None
        
        # Resize image
        img_resized = img.resize((width, height), resample)
        
        # Convert to appropriate format
        buffered = BytesIO()
        save_kwargs = {'format': output_format, 'quality': quality_value, 'optimize': True}
        
        if output_format == 'PNG' and img_resized.mode == 'RGBA':
            save_kwargs['format'] = 'PNG'
        elif output_format in ['JPEG', 'JPG']:
            if img_resized.mode == 'RGBA':
                if background:
                    bg = Image.new('RGB', img_resized.size, background)
                    bg.paste(img_resized, mask=img_resized.split()[3] if len(img_resized.split()) > 3 else None)
                    img_resized = bg
                else:
                    img_resized = img_resized.convert('RGB')
            save_kwargs['format'] = 'JPEG'
        
        img_resized.save(buffered, **save_kwargs)
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        # ✅ Add watermark for free users
        if should_add_watermark(is_premium):
            watermarked_img = Image.open(BytesIO(buffered.getvalue()))
            watermarked_img = add_watermark_to_image(watermarked_img, is_premium)
            watermarked_buffer = BytesIO()
            watermarked_img.save(watermarked_buffer, format=output_format)
            img_base64 = base64.b64encode(watermarked_buffer.getvalue()).decode()
        
        cleanup_temp_files([temp_path])
        
        increment_usage('image_resizer', ip_address)
        current_usage = get_usage_count('image_resizer', ip_address)
        
        return jsonify({
            'success': True,
            'image': f"data:image/{output_format.lower()};base64,{img_base64}",
            'original_size': original_size,
            'new_size': (width, height),
            'usage_count': current_usage,
            'remaining_free': "Unlimited",
            'is_premium': is_premium,
            'max_dimension': max_dimension,
            'format': output_format,
            'quality': quality_value,
            'has_watermark': should_add_watermark(is_premium)
        })
        
    except Exception as e:
        print(f"Image Resizer Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# 12. TEXT TO PDF
# ============================================

@tools_bp.route('/text-to-pdf', methods=['POST', 'OPTIONS'])
def text_to_pdf():
    """Convert Text to PDF (Free: 5 per day, Premium: Unlimited)"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        ip_address = get_client_ip(request)
        
        # Rate limiting
        if is_rate_limited(ip_address, 'text_to_pdf', limit=20, window=60):
            return jsonify({
                'success': False,
                'error': 'Too many requests. Please try again later.'
            }), 429
        
        track_request(ip_address, 'text_to_pdf')
        
        is_premium = data.get('is_premium', False)
        
        usage_count = get_usage_count('text_to_pdf', ip_address)
        
        if not is_premium and usage_count >= 5:
            return jsonify({
                'success': False,
                'error': 'Free limit reached. Please upgrade to premium for unlimited access.',
                'limit_reached': True,
                'usage_count': usage_count,
                'max_free': 5
            }), 403
        
        text = data.get('text', '')
        title = data.get('title', 'Document')
        
        if not text:
            return jsonify({'success': False, 'error': 'Text is required'}), 400
        
        # Sanitize and limit text
        text = text[:10000]  # Max 10000 chars
        title = sanitize_input(title)[:100]
        
        # Create PDF
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        # Title
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, height - 50, title[:80])
        
        # Content
        c.setFont("Helvetica", 12)
        y = height - 80
        lines = text.split('\n')
        page_count = 1
        
        for line in lines:
            if y < 50:
                c.showPage()
                page_count += 1
                y = height - 50
                c.setFont("Helvetica", 12)
                # Page header on new page
                c.setFont("Helvetica-Bold", 10)
                c.drawString(50, height - 30, f"{title} - Page {page_count}")
                c.setFont("Helvetica", 12)
            
            # Truncate long lines
            if len(line) > 80:
                line = line[:77] + '...'
            c.drawString(50, y, line)
            y -= 20
        
        # ✅ Add watermark for free users (on last page)
        if should_add_watermark(is_premium):
            c.showPage()
            c.setFont("Helvetica", 10)
            c.setFillColorRGB(0.5, 0.5, 0.5)
            c.drawCentredString(width/2, 50, "Made with ❤️ by Krynova Technologies")
            c.drawCentredString(width/2, 35, "Visit: https://krynovatechnology.pythonanywhere.com")
        
        c.save()
        
        pdf_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        increment_usage('text_to_pdf', ip_address)
        
        return jsonify({
            'success': True,
            'file': pdf_base64,
            'filename': f'{title}.pdf',
            'usage_count': get_usage_count('text_to_pdf', ip_address),
            'remaining_free': max(0, 5 - get_usage_count('text_to_pdf', ip_address)),
            'is_premium': is_premium,
            'has_watermark': should_add_watermark(is_premium)
        })
        
    except Exception as e:
        print(f"Text to PDF Error: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

# ============================================
# PREMIUM SUBSCRIPTION
# ============================================

@tools_bp.route('/premium/check', methods=['GET'])
def check_premium_status():
    """Check if user has premium access"""
    user_id = request.args.get('user_id')
    is_premium = False
    
    # In production, check from database
    
    return jsonify({
        'success': True,
        'is_premium': is_premium,
        'features': {
            'resume_builder': {'free_limit': 3, 'premium_unlimited': True},
            'cover_letter': {'free_limit': 3, 'premium_unlimited': True},
            'qr_generator': {'free_limit': 5, 'premium_unlimited': True},
            'pdf_to_image': {'free_limit': 3, 'premium_unlimited': True},
            'pdf_to_word': {'free_limit': 2, 'premium_unlimited': True},
            'pdf_to_excel': {'free_limit': 2, 'premium_unlimited': True},
            'image_to_pdf': {'free_limit': 3, 'premium_unlimited': True},
            'pdf_compressor': {'free_limit': 3, 'premium_unlimited': True},
            'merge_pdf': {'free_limit': 3, 'premium_unlimited': True},
            'split_pdf': {'free_limit': 3, 'premium_unlimited': True},
            'image_resizer': {'free_limit': 5, 'premium_unlimited': True},
            'text_to_pdf': {'free_limit': 5, 'premium_unlimited': True}
        }
    })

@tools_bp.route('/premium/subscribe', methods=['POST', 'OPTIONS'])
def subscribe_premium():
    """Subscribe to premium"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    data = request.get_json()
    return jsonify({
        'success': True,
        'message': 'Premium subscription activated!',
        'plan': data.get('plan', 'monthly'),
        'expires': (datetime.now() + timedelta(days=30)).isoformat()
    })

# ============================================
# HELPER FUNCTIONS
# ============================================

def generate_resume_content(data):
    """Generate professional resume content"""
    name = data.get('name', '')
    email = data.get('email', '')
    phone = data.get('phone', '')
    location = data.get('location', '')
    title = data.get('title', '')
    summary = data.get('summary', '')
    skills = data.get('skills', [])
    experience = data.get('experience', '')
    education = data.get('education', '')
    
    if isinstance(skills, str):
        skills = skills.split(',')

    resume = f"""
{name}
{email} | {phone}
{location}

{'-' * 50}

{title}

PROFESSIONAL SUMMARY
{summary if summary else f'Experienced professional with expertise in {", ".join(skills[:3]) if skills else "various technologies"}. Passionate about delivering high-quality solutions.'}

{'-' * 50}

SKILLS
"""
    for skill in skills:
        resume += f"• {skill.strip()}\n"
    
    if experience:
        resume += f"""
{'-' * 50}

EXPERIENCE
{experience}
"""
    
    if education:
        resume += f"""
{'-' * 50}

EDUCATION
{education}
"""
    
    return resume

def generate_cover_letter_content(data):
    """Generate professional cover letter"""
    name = data.get('name', '')
    position = data.get('position', '')
    company = data.get('company', '')
    skills = data.get('skills', [])
    experience = data.get('experience', '')
    
    if isinstance(skills, str):
        skills = skills.split(',')
    
    return f"""
{name}
{data.get('email', '')} | {data.get('phone', '')}
{data.get('location', '')}

{datetime.now().strftime('%B %d, %Y')}

Hiring Manager
{company}

Dear Hiring Manager,

I am writing to express my strong interest in the {position} position at {company}. 
With my expertise in {', '.join(skills[:3]) if skills else 'various technologies'}, I am confident I can make significant 
contributions to your team.

Throughout my career, I have developed strong skills in {', '.join(skills) if skills else 'various technologies'}. 
{experience[:200] if experience else 'I am passionate about delivering high-quality work and thrive in collaborative environments.'}

I am particularly drawn to {company} because of your reputation for innovation and 
excellence. I would welcome the opportunity to discuss how my experience aligns 
with the needs of your organization.

Thank you for considering my application.

Sincerely,
{name}
"""

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF"""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ''
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted
            return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return "Unable to extract text from PDF."

print("✅ tools_routes.py loaded successfully!", flush=True)