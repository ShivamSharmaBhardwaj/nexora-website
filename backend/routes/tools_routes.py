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
from pdf2image import convert_from_bytes
import img2pdf
import shutil

tools_bp = Blueprint('tools', __name__)
tools_bp.strict_slashes = False

# ============================================
# FREE USAGE TRACKING
# ============================================

# In-memory usage tracking (for demo - use Redis in production)
usage_tracking = {}

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
# 1. RESUME BUILDER
# ============================================

@tools_bp.route('/resume-builder', methods=['POST'])
def build_resume():
    """Generate ATS-friendly resume (Free: 3 per day, Premium: Unlimited)"""
    data = request.get_json()
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    
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
    
    try:
        # Validate required fields
        required = ['name', 'email', 'skills']
        for field in required:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'Missing field: {field}'}), 400
        
        # Generate resume content
        resume_content = generate_resume_content(data)
        
        increment_usage('resume_builder', ip_address)
        
        return jsonify({
            'success': True,
            'resume': resume_content,
            'usage_count': get_usage_count('resume_builder', ip_address),
            'remaining_free': max(0, 3 - get_usage_count('resume_builder', ip_address)),
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

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

# ============================================
# 2. COVER LETTER GENERATOR
# ============================================

@tools_bp.route('/cover-letter', methods=['POST'])
def generate_cover_letter():
    """Generate cover letter (Free: 3 per day, Premium: Unlimited)"""
    data = request.get_json()
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    
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
    
    try:
        required = ['name', 'position', 'company', 'skills']
        for field in required:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'Missing field: {field}'}), 400
        
        cover_letter = generate_cover_letter_content(data)
        
        increment_usage('cover_letter', ip_address)
        
        return jsonify({
            'success': True,
            'cover_letter': cover_letter,
            'usage_count': get_usage_count('cover_letter', ip_address),
            'remaining_free': max(0, 3 - get_usage_count('cover_letter', ip_address)),
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

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

# ============================================
# 3. QR CODE GENERATOR
# ============================================

@tools_bp.route('/qr-generator', methods=['POST'])
def generate_qr():
    """Generate QR Code (Free: 5 per day, Premium: Unlimited)"""
    data = request.get_json()
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    
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
    
    try:
        content = data.get('content', '')
        if not content:
            return jsonify({'success': False, 'error': 'Content is required'}), 400
        
        # Get style and size from request
        style = data.get('style', 'default')
        size = data.get('size', 250)
        
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
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 4. PDF TO IMAGE
# ============================================

@tools_bp.route('/pdf-to-image', methods=['POST'])
def pdf_to_image():
    """Convert PDF to Image (Free: 3 pages per day, Premium: Unlimited)"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
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
    
    try:
        filename = secure_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), filename)
        file.save(temp_path)
        
        # Convert PDF to images
        images = convert_from_bytes(open(temp_path, 'rb').read())
        
        # Convert to base64
        image_list = []
        limit = len(images) if is_premium else min(3, len(images))
        for i, img in enumerate(images[:limit]):
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode()
            image_list.append({
                'page': i + 1,
                'image': f"data:image/png;base64,{img_base64}"
            })
        
        os.remove(temp_path)
        
        for _ in range(len(image_list)):
            increment_usage('pdf_to_image', ip_address)
        
        return jsonify({
            'success': True,
            'images': image_list,
            'total_pages': len(images),
            'converted': len(image_list),
            'usage_count': get_usage_count('pdf_to_image', ip_address),
            'remaining_free': max(0, 3 - get_usage_count('pdf_to_image', ip_address)),
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 5. PDF TO WORD
# ============================================

@tools_bp.route('/pdf-to-word', methods=['POST'])
def pdf_to_word():
    """Convert PDF to Word (Free: 2 per day, Premium: Unlimited)"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
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
    
    try:
        filename = secure_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), filename)
        file.save(temp_path)
        
        text = extract_text_from_pdf(temp_path)
        
        doc = Document()
        doc.add_heading('PDF Content', 0)
        doc.add_paragraph(text)
        
        doc_bytes = BytesIO()
        doc.save(doc_bytes)
        doc_bytes.seek(0)
        doc_base64 = base64.b64encode(doc_bytes.read()).decode()
        
        os.remove(temp_path)
        
        increment_usage('pdf_to_word', ip_address)
        
        return jsonify({
            'success': True,
            'file': doc_base64,
            'filename': filename.replace('.pdf', '.docx'),
            'usage_count': get_usage_count('pdf_to_word', ip_address),
            'remaining_free': max(0, 2 - get_usage_count('pdf_to_word', ip_address)),
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 6. PDF TO EXCEL
# ============================================

@tools_bp.route('/pdf-to-excel', methods=['POST'])
def pdf_to_excel():
    """Convert PDF to Excel (Free: 2 per day, Premium: Unlimited)"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
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
    
    try:
        filename = secure_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), filename)
        file.save(temp_path)
        
        text = extract_text_from_pdf(temp_path)
        
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "PDF Content"
        
        # Split text into rows
        lines = text.split('\n')
        for i, line in enumerate(lines):
            ws.cell(row=i+1, column=1, value=line)
        
        excel_bytes = BytesIO()
        wb.save(excel_bytes)
        excel_bytes.seek(0)
        excel_base64 = base64.b64encode(excel_bytes.read()).decode()
        
        os.remove(temp_path)
        
        increment_usage('pdf_to_excel', ip_address)
        
        return jsonify({
            'success': True,
            'file': excel_base64,
            'filename': filename.replace('.pdf', '.xlsx'),
            'usage_count': get_usage_count('pdf_to_excel', ip_address),
            'remaining_free': max(0, 2 - get_usage_count('pdf_to_excel', ip_address)),
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 7. IMAGE TO PDF
# ============================================

@tools_bp.route('/image-to-pdf', methods=['POST'])
def image_to_pdf():
    """Convert Images to PDF (Free: 3 images per day, Premium: Unlimited)"""
    if 'files' not in request.files:
        return jsonify({'success': False, 'error': 'No files uploaded'}), 400
    
    files = request.files.getlist('files')
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    is_premium = request.form.get('is_premium', 'false').lower() == 'true'
    
    usage_count = get_usage_count('image_to_pdf', ip_address)
    
    if not is_premium and usage_count + len(files) > 3:
        return jsonify({
            'success': False,
            'error': f'Free limit reached. You can convert {3 - usage_count} more images today.',
            'limit_reached': True,
            'usage_count': usage_count,
            'max_free': 3
        }), 403
    
    try:
        images_paths = []
        limit = len(files) if is_premium else min(3, len(files))
        for file in files[:limit]:
            filename = secure_filename(file.filename)
            temp_path = os.path.join(tempfile.gettempdir(), filename)
            file.save(temp_path)
            images_paths.append(temp_path)
        
        pdf_bytes = img2pdf.convert(images_paths)
        pdf_base64 = base64.b64encode(pdf_bytes).decode()
        
        for path in images_paths:
            os.remove(path)
        
        for _ in range(len(images_paths)):
            increment_usage('image_to_pdf', ip_address)
        
        return jsonify({
            'success': True,
            'file': pdf_base64,
            'filename': 'converted.pdf',
            'pages': len(images_paths),
            'usage_count': get_usage_count('image_to_pdf', ip_address),
            'remaining_free': max(0, 3 - get_usage_count('image_to_pdf', ip_address)),
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 8. PDF COMPRESSOR
# ============================================

@tools_bp.route('/pdf-compressor', methods=['POST'])
def compress_pdf():
    """Compress PDF (Free: 3 per day, Premium: Unlimited)"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    is_premium = request.form.get('is_premium', 'false').lower() == 'true'
    
    usage_count = get_usage_count('pdf_compressor', ip_address)
    
    if not is_premium and usage_count >= 3:
        return jsonify({
            'success': False,
            'error': 'Free limit reached. Please upgrade to premium for unlimited access.',
            'limit_reached': True,
            'usage_count': usage_count,
            'max_free': 3
        }), 403
    
    try:
        filename = secure_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), filename)
        file.save(temp_path)
        
        # Read original size
        original_size = os.path.getsize(temp_path)
        
        # Compress PDF (simplified - read and write back)
        with open(temp_path, 'rb') as f:
            pdf_data = f.read()
        
        # Convert to base64
        pdf_base64 = base64.b64encode(pdf_data).decode()
        compressed_size = len(pdf_data)
        
        os.remove(temp_path)
        
        increment_usage('pdf_compressor', ip_address)
        
        return jsonify({
            'success': True,
            'file': pdf_base64,
            'filename': f'compressed_{filename}',
            'original_size': original_size,
            'compressed_size': compressed_size,
            'saved_percentage': int((1 - compressed_size/original_size) * 100) if original_size > 0 else 0,
            'usage_count': get_usage_count('pdf_compressor', ip_address),
            'remaining_free': max(0, 3 - get_usage_count('pdf_compressor', ip_address)),
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 9. MERGE PDF
# ============================================

@tools_bp.route('/merge-pdf', methods=['POST'])
def merge_pdf():
    """Merge PDFs (Free: 3 per day, Premium: Unlimited)"""
    if 'files' not in request.files:
        return jsonify({'success': False, 'error': 'No files uploaded'}), 400
    
    files = request.files.getlist('files')
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    is_premium = request.form.get('is_premium', 'false').lower() == 'true'
    
    usage_count = get_usage_count('merge_pdf', ip_address)
    
    if not is_premium and usage_count >= 3:
        return jsonify({
            'success': False,
            'error': 'Free limit reached. Please upgrade to premium for unlimited access.',
            'limit_reached': True,
            'usage_count': usage_count,
            'max_free': 3
        }), 403
    
    try:
        merger = PyPDF2.PdfMerger()
        temp_paths = []
        
        for file in files:
            filename = secure_filename(file.filename)
            temp_path = os.path.join(tempfile.gettempdir(), filename)
            file.save(temp_path)
            temp_paths.append(temp_path)
            merger.append(temp_path)
        
        output_bytes = BytesIO()
        merger.write(output_bytes)
        merger.close()
        
        pdf_base64 = base64.b64encode(output_bytes.getvalue()).decode()
        
        for path in temp_paths:
            os.remove(path)
        
        increment_usage('merge_pdf', ip_address)
        
        return jsonify({
            'success': True,
            'file': pdf_base64,
            'filename': 'merged.pdf',
            'pages': len(files),
            'usage_count': get_usage_count('merge_pdf', ip_address),
            'remaining_free': max(0, 3 - get_usage_count('merge_pdf', ip_address)),
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 10. SPLIT PDF
# ============================================

@tools_bp.route('/split-pdf', methods=['POST'])
def split_pdf():
    """Split PDF (Free: 3 per day, Premium: Unlimited)"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
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
    
    try:
        filename = secure_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), filename)
        file.save(temp_path)
        
        with open(temp_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            pages = []
            
            for i in range(len(reader.pages)):
                writer = PyPDF2.PdfWriter()
                writer.add_page(reader.pages[i])
                
                page_bytes = BytesIO()
                writer.write(page_bytes)
                pages.append(base64.b64encode(page_bytes.getvalue()).decode())
        
        os.remove(temp_path)
        
        increment_usage('split_pdf', ip_address)
        
        return jsonify({
            'success': True,
            'pages': pages,
            'total_pages': len(pages),
            'filename': filename.replace('.pdf', ''),
            'usage_count': get_usage_count('split_pdf', ip_address),
            'remaining_free': max(0, 3 - get_usage_count('split_pdf', ip_address)),
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 11. IMAGE RESIZER
# ============================================

@tools_bp.route('/image-resizer', methods=['POST'])
def resize_image():
    """Resize Image (Free: 5 per day, Premium: Unlimited)"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    is_premium = request.form.get('is_premium', 'false').lower() == 'true'
    
    usage_count = get_usage_count('image_resizer', ip_address)
    
    if not is_premium and usage_count >= 5:
        return jsonify({
            'success': False,
            'error': 'Free limit reached. Please upgrade to premium for unlimited access.',
            'limit_reached': True,
            'usage_count': usage_count,
            'max_free': 5
        }), 403
    
    try:
        width = int(request.form.get('width', 800))
        height = int(request.form.get('height', 600))
        
        if width < 10 or height < 10:
            return jsonify({'success': False, 'error': 'Width and height must be at least 10px'}), 400
        
        filename = secure_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), filename)
        file.save(temp_path)
        
        img = Image.open(temp_path)
        img_resized = img.resize((width, height), Image.Resampling.LANCZOS)
        
        buffered = BytesIO()
        img_resized.save(buffered, format=img.format or 'PNG')
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        os.remove(temp_path)
        
        increment_usage('image_resizer', ip_address)
        
        return jsonify({
            'success': True,
            'image': f"data:image/png;base64,{img_base64}",
            'original_size': img.size,
            'new_size': (width, height),
            'usage_count': get_usage_count('image_resizer', ip_address),
            'remaining_free': max(0, 5 - get_usage_count('image_resizer', ip_address)),
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 12. TEXT TO PDF
# ============================================

@tools_bp.route('/text-to-pdf', methods=['POST'])
def text_to_pdf():
    """Convert Text to PDF (Free: 5 per day, Premium: Unlimited)"""
    data = request.get_json()
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
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
    
    try:
        text = data.get('text', '')
        title = data.get('title', 'Document')
        
        if not text:
            return jsonify({'success': False, 'error': 'Text is required'}), 400
        
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
        for line in lines:
            if y < 50:
                c.showPage()
                y = height - 50
                c.setFont("Helvetica", 12)
            # Truncate long lines
            if len(line) > 80:
                line = line[:77] + '...'
            c.drawString(50, y, line)
            y -= 20
        
        c.save()
        
        pdf_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        increment_usage('text_to_pdf', ip_address)
        
        return jsonify({
            'success': True,
            'file': pdf_base64,
            'filename': f'{title}.pdf',
            'usage_count': get_usage_count('text_to_pdf', ip_address),
            'remaining_free': max(0, 5 - get_usage_count('text_to_pdf', ip_address)),
            'is_premium': is_premium
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# PREMIUM SUBSCRIPTION
# ============================================

@tools_bp.route('/premium/check', methods=['GET'])
def check_premium_status():
    """Check if user has premium access"""
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    return jsonify({
        'is_premium': False,
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

@tools_bp.route('/premium/subscribe', methods=['POST'])
def subscribe_premium():
    """Subscribe to premium"""
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