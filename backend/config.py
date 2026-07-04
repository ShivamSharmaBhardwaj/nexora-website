# backend/config.py
import sqlite3
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Database path - works both locally and on PythonAnywhere
DB_PATH = os.path.join(os.path.dirname(__file__), 'nexora.db')

# ============================================
# PAYMENT CONFIGURATION
# ============================================

# Razorpay Configuration
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_xxxxxxxxxxxx')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'xxxxxxxxxxxxxxxxxxxx')

# Stripe Configuration (optional)
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY', '')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY', '')

# Plan prices (in paise for Razorpay)
PLANS = {
    'monthly': {
        'amount': 9900,  # ₹99 in paise
        'name': 'Monthly',
        'price': '₹99',
        'features': [
            'Unlimited resume generation',
            'All 6 professional templates',
            'Unlimited cover letters',
            'Unlimited QR codes',
            'Unlimited PDF conversions',
            'Priority support',
            'Cancel anytime'
        ]
    },
    'yearly': {
        'amount': 99900,  # ₹999 in paise
        'name': 'Yearly',
        'price': '₹999',
        'features': [
            'Everything in Monthly',
            '2 months free',
            'Priority support',
            'Early access to new features',
            'Premium templates',
            'Team collaboration (coming soon)'
        ]
    }
}

# ============================================
# DATABASE FUNCTIONS
# ============================================

def get_db():
    """Get SQLite database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

def init_db():
    """Initialize database tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table - ADDED premium fields
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            is_premium INTEGER DEFAULT 0,
            premium_since TIMESTAMP,
            premium_expiry TIMESTAMP,
            payment_id TEXT,
            razorpay_order_id TEXT,
            plan_type TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Check if premium columns exist and add if missing
    cursor.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cursor.fetchall()]
    
    premium_columns = ['is_premium', 'premium_since', 'premium_expiry', 'payment_id', 'razorpay_order_id', 'plan_type']
    for col in premium_columns:
        if col not in columns:
            if col == 'is_premium':
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col} INTEGER DEFAULT 0")
            else:
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col} TIMESTAMP")
            print(f"✅ Added '{col}' column to users")
    
    # Payments table - NEW
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            razorpay_order_id TEXT UNIQUE,
            razorpay_payment_id TEXT,
            amount INTEGER NOT NULL,
            currency TEXT DEFAULT 'INR',
            plan_type TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            payment_data TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # Projects table (existing)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT,
            description TEXT,
            short_desc TEXT,
            demo_url TEXT,
            video_url TEXT,
            image_url TEXT,
            icon TEXT,
            features TEXT,
            tech_stack TEXT DEFAULT '[]',
            github_url TEXT,
            status TEXT DEFAULT 'active',
            priority INTEGER DEFAULT 0,
            is_featured INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            is_upcoming INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Testimonials table (existing)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS testimonials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_name TEXT NOT NULL,
            client_company TEXT,
            client_image TEXT,
            rating INTEGER DEFAULT 5,
            feedback TEXT NOT NULL,
            is_approved INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Contacts table (existing)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'general',
            interest_type TEXT DEFAULT 'service',
            service_type TEXT,
            product_type TEXT,
            budget TEXT,
            timeline TEXT,
            requirements TEXT DEFAULT '[]',
            company_name TEXT,
            hear_about TEXT,
            preferred_contact TEXT DEFAULT 'email',
            industry TEXT,
            team_size TEXT,
            is_read INTEGER DEFAULT 0,
            ip_address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    
    # Check if data exists
    cursor.execute('SELECT COUNT(*) FROM projects')
    count = cursor.fetchone()[0]
    
    if count == 0:
        print("📦 Inserting sample data...")
        insert_sample_data(conn)
    
    conn.close()
    print("✅ Database ready!")

def insert_sample_data(conn):
    """Insert sample data"""
    import bcrypt
    import json
    
    cursor = conn.cursor()
    
    # Sample projects
    projects = [
        ('HRMS System', 'HRMS', 'Complete human resource management system with payroll, attendance tracking, employee self-service, leave management, and performance reviews.',
         'Manage your workforce efficiently', '/demos/hrms', 
         'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', 'users-cog',
         json.dumps(["Payroll Management", "Attendance Tracking", "Leave Management", "Performance Reviews", "Employee Self-Service"]),
         json.dumps(["React", "Flask", "SQLite", "Bootstrap"]),
         'https://github.com/krynova/hrms',
         'active', 8, 1, 1, 0),
        ('TODO System', 'Productivity', 'Smart task management system with priority levels, deadlines, team collaboration, progress tracking, and automated reminders.',
         'Stay organized and productive', '/demos/todo',
         'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400', 'tasks',
         json.dumps(["Task Creation", "Priority Levels", "Deadline Management", "Team Collaboration", "Progress Tracking"]),
         json.dumps(["Vue.js", "Node.js", "MongoDB", "Express"]),
         'https://github.com/krynova/todo',
         'active', 6, 1, 1, 0),
        ('Estate Management', 'Real Estate', 'Complete property management solution with property listings, tenant management, maintenance tracking, rent collection, and financial reporting.',
         'Manage properties effortlessly', '/demos/estate',
         'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400', 'building',
         json.dumps(["Property Listings", "Tenant Management", "Maintenance Tracking", "Rent Collection", "Financial Reports"]),
         json.dumps(["Angular", "Django", "PostgreSQL", "Docker"]),
         'https://github.com/krynova/estate',
         'active', 7, 0, 1, 0),
        ('WhatsApp Bot', 'Communication', 'AI-powered WhatsApp bot for automated communication, lead generation, customer support, order tracking, and appointment scheduling.',
         'Automate your communication', '/demos/whatsapp',
         'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400', 'whatsapp',
         json.dumps(["Lead Generation", "Customer Support", "Order Tracking", "Appointment Scheduling", "Analytics"]),
         json.dumps(["Python", "Flask", "Twilio API", "Redis"]),
         'https://github.com/krynova/whatsapp-bot',
         'upcoming', 9, 1, 1, 1),
    ]
    
    for project in projects:
        cursor.execute('''
            INSERT INTO projects 
            (title, category, description, short_desc, demo_url, video_url, image_url, icon, 
             features, tech_stack, github_url, status, priority, is_featured, is_active, is_upcoming)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', project)
    
    # Sample testimonials
    testimonials = [
        ('Rahul Sharma', 'TechSolutions Pvt Ltd', '',
         'Krynova delivered an incredible HRMS system that transformed our workforce management. Highly recommended!', 
         5, 1),
        ('Priya Patel', 'EstatePro Realty', '',
         'The property management solution from Krynova is a game-changer. Our operations are now seamless.',
         5, 1),
        ('Amit Kumar', 'StartupIndia', '',
         'The TODO system from Krynova helped our team stay organized and productive. Excellent product!',
         4, 1),
        ('Sneha Reddy', 'DigitalMinds', '',
         'Krynova\'s WhatsApp bot integration was smooth and effective. Our customer engagement increased by 40%.',
         5, 1),
    ]
    
    for testimonial in testimonials:
        cursor.execute('''
            INSERT INTO testimonials (client_name, client_company, client_image, feedback, rating, is_approved)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', testimonial)
    
    # Default admin user
    import bcrypt
    hashed = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
    cursor.execute('''
        INSERT INTO users (name, email, password, role, is_premium)
        VALUES (?, ?, ?, ?, ?)
    ''', ('Admin', 'admin@nexora.com', hashed.decode('utf-8'), 'admin', 1))
    
    conn.commit()
    print("✅ Sample data inserted!")