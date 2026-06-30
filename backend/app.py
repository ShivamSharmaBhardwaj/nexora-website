import sys
import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime

print("=" * 50, flush=True)
print("🚀 Starting Krynova Backend...", flush=True)

# Load environment variables
load_dotenv()
print("✅ Environment loaded", flush=True)

# Detect if running on PythonAnywhere
ON_PYTHONANYWHERE = 'PYTHONANYWHERE_DOMAIN' in os.environ

# Set static folder path based on environment
if ON_PYTHONANYWHERE:
    STATIC_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')
else:
    STATIC_FOLDER = '../frontend/dist'

# Initialize Flask app
app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path='')
app.url_map.strict_slashes = False 
print("✅ Flask app created", flush=True)

# Get PythonAnywhere username if deployed
PA_USERNAME = os.environ.get('PYTHONANYWHERE_USERNAME', 'YOURUSERNAME')

# CORS Configuration - Works everywhere
CORS(app, 
     origins=[
         'http://localhost:5173',
         'http://localhost:5174',
         'http://127.0.0.1:5173',
         'http://127.0.0.1:5174',
         'https://nexora-website-epts.onrender.com',
         'https://nexora-website-1.onrender.com',
         f'https://{PA_USERNAME}.pythonanywhere.com'
     ],
     supports_credentials=True,
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
     allow_headers=['Content-Type', 'Authorization', 'Accept'],
     max_age=3600)
print("✅ CORS configured", flush=True)

# Handle OPTIONS preflight for ALL routes
@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS,PATCH'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,Accept'
        response.headers['Access-Control-Max-Age'] = '3600'
        return response

# After request headers
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin', '')
    allowed_origins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
    ]
    if origin in allowed_origins or '.pythonanywhere.com' in origin or '.onrender.com' in origin:
        response.headers['Access-Control-Allow-Origin'] = origin
    else:
        response.headers['Access-Control-Allow-Origin'] = '*'
    
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,Accept'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS,PATCH'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Import routes with error handling
print("📦 Importing routes...", flush=True)

try:
    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    print("  ✅ Auth routes loaded", flush=True)
except Exception as e:
    print(f"  ❌ Auth routes failed: {e}", flush=True)

try:
    from routes.project_routes import projects_bp
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    print("  ✅ Project routes loaded", flush=True)
except Exception as e:
    print(f"  ❌ Project routes failed: {e}", flush=True)

try:
    from routes.contact_routes import contact_bp
    app.register_blueprint(contact_bp, url_prefix='/api/contact')
    print("  ✅ Contact routes loaded", flush=True)
except Exception as e:
    print(f"  ❌ Contact routes failed: {e}", flush=True)

try:
    from routes.testimonial_routes import testimonials_bp
    app.register_blueprint(testimonials_bp, url_prefix='/api/testimonials')
    print("  ✅ Testimonial routes loaded", flush=True)
except Exception as e:
    print(f"  ❌ Testimonial routes failed: {e}", flush=True)

    # ✅ ADD THIS - Service Routes
try:
    from routes.service_routes import service_bp
    app.register_blueprint(service_bp, url_prefix='/api/services')
    print("  ✅ Service routes loaded", flush=True)
except Exception as e:
    print(f"  ❌ Service routes failed: {e}", flush=True)
    import traceback
    traceback.print_exc()

# ✅ TOOLS ROUTES - REGISTER WITH URL PREFIX
try:
    from routes.tools_routes import tools_bp
    app.register_blueprint(tools_bp, url_prefix='/api/tools')
    print("  ✅ Tools routes loaded", flush=True)
    print("  📋 Tools endpoints available at /api/tools/*")
except Exception as e:
    print(f"  ❌ Tools routes failed: {e}", flush=True)
    import traceback
    traceback.print_exc()

# Health check
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'OK',
        'database': 'SQLite',
        'message': 'Krynova API is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory(app.static_folder, 'sitemap.xml', mimetype='application/xml')

@app.route('/robots.txt')
def robots():
    return send_from_directory(app.static_folder, 'robots.txt', mimetype='text/plain')

# In backend/app.py - Update the root endpoint
@app.route('/')
def root():
    try:
        return send_from_directory(app.static_folder, 'index.html')
    except:
        return jsonify({
            'name': 'Krynova Technologies API',
            'version': '1.0.0',
            'endpoints': {
                'health': '/api/health',
                'auth': '/api/auth',
                'projects': '/api/projects',
                'testimonials': '/api/testimonials',
                'contact': '/api/contact',
                'tools': '/api/tools',
                'services': '/api/services'  # ✅ ADD THIS
            }
        })

@app.route('/<path:path>')
def serve_static(path):
    try:
        return send_from_directory(app.static_folder, path)
    except:
        if os.path.exists(os.path.join(app.static_folder, 'index.html')):
            return send_from_directory(app.static_folder, 'index.html')
        return jsonify({'error': 'Page not found'}), 404

# Error handlers
@app.errorhandler(404)
def not_found(e):
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Not found'}), 404
    if os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({'error': 'Page not found'}), 404

# Initialize database
print("🔧 Initializing database...", flush=True)
try:
    from config import init_db
    init_db()
    print("✅ Database initialized", flush=True)
except Exception as e:
    print(f"⚠️ Database warning: {e}", flush=True)

# For PythonAnywhere - this is needed
application = app

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    print(f"🌐 Server starting at: http://localhost:{port}", flush=True)
    print(f"📊 Health check: http://localhost:{port}/api/health", flush=True)
    print("=" * 50, flush=True)
    
    app.run(debug=True, host='0.0.0.0', port=port)