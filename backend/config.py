import sqlite3
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Database path - works both locally and on PythonAnywhere
DB_PATH = os.path.join(os.path.dirname(__file__), 'nexora.db')

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
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Projects table - UPDATED with status and priority
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
    
    # Check if columns exist and add if missing
    cursor.execute("PRAGMA table_info(projects)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'status' not in columns:
        cursor.execute("ALTER TABLE projects ADD COLUMN status TEXT DEFAULT 'active'")
        print("✅ Added 'status' column")
    
    if 'priority' not in columns:
        cursor.execute("ALTER TABLE projects ADD COLUMN priority INTEGER DEFAULT 0")
        print("✅ Added 'priority' column")
    
    if 'tech_stack' not in columns:
        cursor.execute("ALTER TABLE projects ADD COLUMN tech_stack TEXT DEFAULT '[]'")
        print("✅ Added 'tech_stack' column")
    
    if 'github_url' not in columns:
        cursor.execute("ALTER TABLE projects ADD COLUMN github_url TEXT")
        print("✅ Added 'github_url' column")
    
    if 'is_featured' not in columns:
        cursor.execute("ALTER TABLE projects ADD COLUMN is_featured INTEGER DEFAULT 0")
        print("✅ Added 'is_featured' column")
    
    # Testimonials table
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
    
    # Contacts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'general',
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
    
    # Sample projects with new fields
    projects = [
        ('HRMS System', 'HRMS', 'Complete human resource management system with payroll, attendance tracking, employee self-service, leave management, and performance reviews.',
         'Manage your workforce efficiently', '/demos/hrms', 
         'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', 'users-cog',
         json.dumps(["Payroll Management", "Attendance Tracking", "Leave Management", "Performance Reviews", "Employee Self-Service"]),
         json.dumps(["React", "Flask", "SQLite", "Bootstrap"]),
         'https://github.com/nexora/hrms',
         'active', 8, 1, 1, 0),
        ('TODO System', 'Productivity', 'Smart task management system with priority levels, deadlines, team collaboration, progress tracking, and automated reminders.',
         'Stay organized and productive', '/demos/todo',
         'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400', 'tasks',
         json.dumps(["Task Creation", "Priority Levels", "Deadline Management", "Team Collaboration", "Progress Tracking"]),
         json.dumps(["Vue.js", "Node.js", "MongoDB", "Express"]),
         'https://github.com/nexora/todo',
         'active', 6, 1, 1, 0),
        ('Estate Management', 'Real Estate', 'Complete property management solution with property listings, tenant management, maintenance tracking, rent collection, and financial reporting.',
         'Manage properties effortlessly', '/demos/estate',
         'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400', 'building',
         json.dumps(["Property Listings", "Tenant Management", "Maintenance Tracking", "Rent Collection", "Financial Reports"]),
         json.dumps(["Angular", "Django", "PostgreSQL", "Docker"]),
         'https://github.com/nexora/estate',
         'active', 7, 0, 1, 0),
        ('WhatsApp Bot', 'Communication', 'AI-powered WhatsApp bot for automated communication, lead generation, customer support, order tracking, and appointment scheduling.',
         'Automate your communication', '/demos/whatsapp',
         'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400', 'whatsapp',
         json.dumps(["Lead Generation", "Customer Support", "Order Tracking", "Appointment Scheduling", "Analytics"]),
         json.dumps(["Python", "Flask", "Twilio API", "Redis"]),
         'https://github.com/nexora/whatsapp-bot',
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
         'Nexora delivered an incredible HRMS system that transformed our workforce management. Highly recommended!', 
         5, 1),
        ('Priya Patel', 'EstatePro Realty', '',
         'The property management solution from Nexora is a game-changer. Our operations are now seamless.',
         5, 1),
        ('Amit Kumar', 'StartupIndia', '',
         'The TODO system helped our team stay organized and productive. Excellent product!',
         4, 1),
        ('Sneha Reddy', 'DigitalMinds', '',
         'WhatsApp bot integration was smooth and effective. Our customer engagement increased by 40%.',
         5, 1),
    ]
    
    for testimonial in testimonials:
        cursor.execute('''
            INSERT INTO testimonials (client_name, client_company, client_image, feedback, rating, is_approved)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', testimonial)
    
    # Default admin user (password: admin123)
    import bcrypt
    hashed = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
    cursor.execute('''
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
    ''', ('Admin', 'admin@nexora.com', hashed.decode('utf-8'), 'admin'))
    
    conn.commit()
    print("✅ Sample data inserted!")