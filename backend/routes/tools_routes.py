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
import img2pdf
import shutil
import fitz 
from io import BytesIO

# Create blueprint WITHOUT url_prefix
tools_bp = Blueprint('tools_bp', __name__)
tools_bp.strict_slashes = False

# ============================================
# FREE USAGE TRACKING
# ============================================

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
# TEST ROUTE - To verify tools are working
# ============================================

@tools_bp.route('/test', methods=['GET'])
def test_tools():
    """Test route to verify tools blueprint is working"""
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
# 1. RESUME BUILDER - FIXED (no trailing slash)
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
        print(f"Resume Builder Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 2. COVER LETTER GENERATOR - FIXED (no trailing slash)
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
        print(f"Cover Letter Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 3. QR CODE GENERATOR - FIXED (no trailing slash)
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
        print(f"QR Generator Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# In tools.py - Replace the existing pdf_to_image function with this:


@tools_bp.route('/pdf-to-image', methods=['POST', 'OPTIONS'])
def pdf_to_image():
    """Convert PDF to Image using PyMuPDF (Free: 3 pages per day, Premium: Unlimited)"""
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
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), filename)
        file.save(temp_path)
        
        # Open PDF with PyMuPDF
        doc = fitz.open(temp_path)
        total_pages = len(doc)
        
        # Determine how many pages to convert
        limit = total_pages if is_premium else min(3, total_pages)
        
        # Convert pages to images
        image_list = []
        for i in range(limit):
            page = doc[i]
            # Render page with 2x zoom for better quality
            mat = fitz.Matrix(2.0, 2.0)
            pix = page.get_pixmap(matrix=mat)
            
            # Convert to PNG bytes
            img_data = pix.tobytes("png")
            img_base64 = base64.b64encode(img_data).decode()
            
            image_list.append({
                'page': i + 1,
                'image': f"data:image/png;base64,{img_base64}"
            })
        
        # Clean up
        doc.close()
        os.remove(temp_path)
        
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
            'is_premium': is_premium
        })
        
    except Exception as e:
        print(f"PDF to Image Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500# ============================================
# 5. PDF TO WORD - FIXED (no trailing slash)
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
        print(f"PDF to Word Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 6. PDF TO EXCEL - FIXED (no trailing slash)
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
        print(f"PDF to Excel Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# In tools.py - Update the image_to_pdf function

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
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
        is_premium = request.form.get('is_premium', 'false').lower() == 'true'
        
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
            # Check bulk usage
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
            
            # Increment bulk usage
            bulk_data['count'] += 1
            usage_tracking[bulk_key] = bulk_data
        
        # For single images, only track total usage for display purposes
        usage_key = f"image_to_pdf:{ip_address}"
        usage_count = get_usage_count('image_to_pdf', ip_address)
        
        # Process images
        images_paths = []
        for file in files:
            filename = secure_filename(file.filename)
            temp_path = os.path.join(tempfile.gettempdir(), filename)
            file.save(temp_path)
            images_paths.append(temp_path)
        
        # Convert to PDF
        pdf_bytes = img2pdf.convert(images_paths)
        pdf_base64 = base64.b64encode(pdf_bytes).decode()
        
        # Clean up
        for path in images_paths:
            os.remove(path)
        
        # Increment usage (for display only)
        if not is_premium:
            increment_usage('image_to_pdf', ip_address)
            current_usage = get_usage_count('image_to_pdf', ip_address)
            remaining = max(0, 999 - current_usage)  # Virtual unlimited for single
        else:
            current_usage = 0
            remaining = "Unlimited"
        
        # Get bulk remaining for response
        bulk_remaining = 2
        if not is_premium and is_bulk:
            bulk_data = usage_tracking.get(bulk_key, {'date': today, 'count': 0})
            bulk_remaining = max(0, 2 - bulk_data['count'])
        
        return jsonify({
            'success': True,
            'file': pdf_base64,
            'filename': f'converted_{datetime.now().strftime("%Y%m%d")}.pdf',
            'pages': len(images_paths),
            'usage_count': current_usage,
            'remaining_free': remaining,
            'is_premium': is_premium,
            'is_bulk': is_bulk,
            'bulk_remaining': bulk_remaining,
            'bulk_used': bulk_data['count'] if not is_premium and is_bulk else 0
        })
        
    except Exception as e:
        print(f"Image to PDF Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500
# ============================================
# 8. PDF COMPRESSOR - WITH PROPER COMPRESSION
# ============================================

@tools_bp.route('/pdf-compressor', methods=['POST', 'OPTIONS'])
def compress_pdf():
    """Compress PDF (Free: Single files unlimited, Batch: 3 per day, Premium: Unlimited)"""
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
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
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
        
        # Get compression options
        options = {}
        try:
            options = json.loads(request.form.get('options', '{}'))
        except:
            pass
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), filename)
        file.save(temp_path)
        
        # Read original size
        original_size = os.path.getsize(temp_path)
        
        # ============================================
        # PROPER PDF COMPRESSION USING PyMuPDF
        # ============================================
        
        try:
            import fitz  # PyMuPDF
            
            # Open the PDF
            doc = fitz.open(temp_path)
            
            # Create a new PDF for compression
            compressed_doc = fitz.open()
            
            # Compression level (1-9, default 5)
            compression_level = options.get('compressionLevel', 5)
            
            # Copy all pages with compression
            for page_num in range(len(doc)):
                page = doc[page_num]
                compressed_doc.insert_pdf(doc, from_page=page_num, to_page=page_num)
            
            # Save with compression options
            compressed_buffer = BytesIO()
            compressed_doc.save(
                compressed_buffer,
                garbage=compression_level,  # Garbage collection level
                deflate=True,               # Use deflate compression
                clean=True,                 # Clean up unused objects
                pretty=False                # Don't pretty print (smaller file)
            )
            
            compressed_doc.close()
            doc.close()
            
            compressed_data = compressed_buffer.getvalue()
            compressed_size = len(compressed_data)
            
        except Exception as e:
            # Fallback to PyPDF2 if PyMuPDF fails
            print(f"PyMuPDF compression failed, using PyPDF2: {str(e)}")
            
            with open(temp_path, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                pdf_writer = PyPDF2.PdfWriter()
                
                for page in pdf_reader.pages:
                    page.compress_content_streams()
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
            # If saved_percentage is negative (compressed file is larger), set to 0
            if saved_percentage < 0:
                saved_percentage = 0
        else:
            saved_percentage = 0
        
        # Clean up temp file
        try:
            os.remove(temp_path)
        except:
            pass
        
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
        
        # If compression didn't reduce size, use original file (but with our compression)
        # Only use compressed if it's smaller
        if compressed_size < original_size:
            final_data = compressed_data
            final_size = compressed_size
            final_saved = saved_percentage
        else:
            # If compression made it larger, return original
            with open(temp_path, 'rb') as f:
                final_data = f.read()
            final_size = original_size
            final_saved = 0
        
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
            'batch_remaining': max(0, 3 - batch_data['count']) if not is_premium and is_batch else "Unlimited"
        })
        
    except Exception as e:
        print(f"PDF Compressor Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500
# ============================================
# 9. MERGE PDF - UPDATED (Free: Up to 35 files, Premium: Unlimited)
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
        print(f"📄 Received {len(files)} files for merging")
        
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
        is_premium = request.form.get('is_premium', 'false').lower() == 'true'
        
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
        
        # Check each file size (same for both free and premium)
        MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB per file
        for file in files:
            if file.content_length and file.content_length > MAX_FILE_SIZE:
                return jsonify({
                    'success': False,
                    'error': f'File "{file.filename}" exceeds 10MB limit. Please compress it first.'
                }), 400
        
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
        
        print(f"📄 Options: {options}")
        
        # Create merger
        merger = PyPDF2.PdfMerger()
        temp_paths = []
        file_names = []
        
        # Process files one by one
        for idx, file in enumerate(files):
            filename = secure_filename(file.filename)
            file_names.append(filename)
            temp_path = os.path.join(tempfile.gettempdir(), f"merge_{uuid.uuid4().hex}_{filename}")
            file.save(temp_path)
            temp_paths.append(temp_path)
            print(f"📄 Processing file {idx + 1}/{len(files)}: {filename}")
            
            try:
                with open(temp_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    page_count = len(reader.pages)
                    print(f"   📄 Pages in {filename}: {page_count}")
                merger.append(temp_path)
            except Exception as e:
                print(f"❌ Error processing file {filename}: {str(e)}")
                for path in temp_paths:
                    try:
                        os.remove(path)
                    except:
                        pass
                return jsonify({
                    'success': False,
                    'error': f'Error processing file "{filename}". Please check if it\'s a valid PDF.'
                }), 400
        
        # Write merged PDF
        print("📄 Writing merged PDF...")
        output_bytes = BytesIO()
        merger.write(output_bytes)
        merger.close()
        
        merged_data = output_bytes.getvalue()
        print(f"📄 Merged PDF size: {len(merged_data)} bytes")
        
        # Count total pages in merged PDF
        try:
            with BytesIO(merged_data) as f:
                reader = PyPDF2.PdfReader(f)
                total_pages = len(reader.pages)
        except:
            total_pages = len(files)
        
        print(f"📄 Total pages in merged PDF: {total_pages}")
        
        # Compress output if requested (Premium feature)
        if options.get('compressOutput', False) and is_premium:
            try:
                print("📄 Compressing merged PDF...")
                import fitz
                
                temp_merged_path = os.path.join(tempfile.gettempdir(), f"merged_{uuid.uuid4().hex}.pdf")
                with open(temp_merged_path, 'wb') as f:
                    f.write(merged_data)
                
                doc = fitz.open(temp_merged_path)
                compressed_doc = fitz.open()
                
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    compressed_doc.insert_pdf(doc, from_page=page_num, to_page=page_num)
                
                compressed_buffer = BytesIO()
                compressed_doc.save(
                    compressed_buffer,
                    garbage=4,
                    deflate=True,
                    clean=True,
                    pretty=False
                )
                
                compressed_doc.close()
                doc.close()
                os.remove(temp_merged_path)
                
                merged_data = compressed_buffer.getvalue()
                print(f"📄 Compressed PDF size: {len(merged_data)} bytes")
            except Exception as e:
                print(f"❌ Compression failed: {str(e)}")
        
        pdf_base64 = base64.b64encode(merged_data).decode()
        
        # Clean up temp files
        for path in temp_paths:
            try:
                os.remove(path)
            except:
                pass
        
        # Only increment usage for free users
        if not is_premium:
            increment_usage('merge_pdf', ip_address)
            remaining_free = max(0, 3 - get_usage_count('merge_pdf', ip_address))
        else:
            remaining_free = "Unlimited"
        
        print("✅ Merge completed successfully!")
        
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
            'is_premium': is_premium
        })
        
    except Exception as e:
        print(f"❌ Merge PDF Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500
# 10. SPLIT PDF - FIXED (no trailing slash)
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
        print(f"Split PDF Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 11. IMAGE RESIZER - UPDATED (Free: Unlimited but limited size, Premium: Unlimited + Advanced)
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
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
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
        
        # Get options (for premium features)
        options = {}
        try:
            options = json.loads(request.form.get('options', '{}'))
        except:
            pass
        
        filename = secure_filename(file.filename)
        temp_path = os.path.join(tempfile.gettempdir(), filename)
        file.save(temp_path)
        
        # Open image
        img = Image.open(temp_path)
        original_size = img.size
        
        # ✅ Quality settings: Premium gets better quality
        quality = options.get('quality', 'medium')
        quality_map = {
            'high': 95,
            'medium': 85,
            'low': 70
        }
        quality_value = quality_map.get(quality, 85)
        
        # ✅ Premium gets advanced resizing options
        if is_premium:
            # Premium: Better resampling algorithm
            resample = Image.Resampling.LANCZOS
            # Premium: Format options
            output_format = options.get('format', 'PNG')
            # Premium: Background color for transparent images
            background = options.get('background', None)
        else:
            # Free: Standard resampling
            resample = Image.Resampling.BICUBIC
            output_format = 'PNG'
            background = None
        
        # Resize image
        img_resized = img.resize((width, height), resample)
        
        # Convert to appropriate format
        buffered = BytesIO()
        save_kwargs = {'format': output_format, 'quality': quality_value, 'optimize': True}
        
        # Handle transparency
        if output_format == 'PNG' and img_resized.mode == 'RGBA':
            save_kwargs['format'] = 'PNG'
        elif output_format in ['JPEG', 'JPG']:
            if img_resized.mode == 'RGBA':
                # Convert to RGB for JPEG
                if background:
                    # Use specified background color
                    bg = Image.new('RGB', img_resized.size, background)
                    bg.paste(img_resized, mask=img_resized.split()[3] if len(img_resized.split()) > 3 else None)
                    img_resized = bg
                else:
                    img_resized = img_resized.convert('RGB')
            save_kwargs['format'] = 'JPEG'
        
        img_resized.save(buffered, **save_kwargs)
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        os.remove(temp_path)
        
        # ✅ Free: Unlimited but tracked for display
        increment_usage('image_resizer', ip_address)
        current_usage = get_usage_count('image_resizer', ip_address)
        
        # ✅ Free: Unlimited (no limit), Premium: Unlimited
        remaining = "Unlimited" if is_premium else "Unlimited"
        
        return jsonify({
            'success': True,
            'image': f"data:image/{output_format.lower()};base64,{img_base64}",
            'original_size': original_size,
            'new_size': (width, height),
            'usage_count': current_usage,
            'remaining_free': remaining,
            'is_premium': is_premium,
            'max_dimension': max_dimension,
            'format': output_format,
            'quality': quality_value
        })
        
    except Exception as e:
        print(f"Image Resizer Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# 12. TEXT TO PDF - FIXED (no trailing slash)
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
        print(f"Text to PDF Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# PREMIUM SUBSCRIPTION - FIXED
# ============================================

@tools_bp.route('/premium/check', methods=['GET'])
def check_premium_status():
    """Check if user has premium access"""
    # Get user_id from query params or headers
    user_id = request.args.get('user_id')
    
    # In production, check from database
    # For now, return false (free user)
    is_premium = False
    
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