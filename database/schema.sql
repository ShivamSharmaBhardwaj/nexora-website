-- Create database
CREATE DATABASE nexora;
USE nexora;

-- Users (admin)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    short_desc VARCHAR(200),
    demo_url VARCHAR(255),
    video_url VARCHAR(255),
    image_url VARCHAR(255),
    icon VARCHAR(50),
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    is_upcoming BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Testimonials (only approved ones show)
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    client_company VARCHAR(100),
    client_image VARCHAR(255),
    rating INT DEFAULT 5,
    feedback TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact enquiries
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    type ENUM('general', 'demo_request', 'feedback') DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO projects (title, category, description, short_desc, demo_url, video_url, icon, features) VALUES
('HRMS System', 'HRMS', 'Complete human resource management system with payroll, attendance tracking, employee self-service, leave management, and performance reviews.', 'Manage your workforce efficiently', '/demos/hrms', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'users-cog', '["Payroll Management", "Attendance Tracking", "Leave Management", "Performance Reviews", "Employee Self-Service"]'),
('TODO System', 'Productivity', 'Smart task management system with priority levels, deadlines, team collaboration, progress tracking, and automated reminders.', 'Stay organized and productive', '/demos/todo', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'tasks', '["Task Creation", "Priority Levels", "Deadline Management", "Team Collaboration", "Progress Tracking"]'),
('Estate Management', 'Real Estate', 'Complete property management solution with property listings, tenant management, maintenance tracking, rent collection, and financial reporting.', 'Manage properties effortlessly', '/demos/estate', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'building', '["Property Listings", "Tenant Management", "Maintenance Tracking", "Rent Collection", "Financial Reports"]'),
('WhatsApp Bot', 'Communication', 'AI-powered WhatsApp bot for automated communication, lead generation, customer support, order tracking, and appointment scheduling.', 'Automate your communication', '/demos/whatsapp', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'whatsapp', '["Lead Generation", "Customer Support", "Order Tracking", "Appointment Scheduling", "Analytics"]');

-- Sample testimonials
INSERT INTO testimonials (client_name, client_company, feedback, rating, is_approved) VALUES
('Rahul Sharma', 'TechSolutions Pvt Ltd', 'Nexora delivered an incredible HRMS system that transformed our workforce management. Highly recommended!', 5, TRUE),
('Priya Patel', 'EstatePro Realty', 'The property management solution from Nexora is a game-changer. Our operations are now seamless.', 5, TRUE),
('Amit Kumar', 'StartupIndia', 'The TODO system helped our team stay organized and productive. Excellent product!', 4, TRUE),
('Sneha Reddy', 'DigitalMinds', 'WhatsApp bot integration was smooth and effective. Our customer engagement increased by 40%.', 5, TRUE);

-- Admin user (password: admin123 - change after first login)
INSERT INTO users (name, email, password) VALUES
('Admin', 'admin@nexora.com', '$2b$10$YqVZ4XZ9XZ9XZ9XZ9XZ9XZ9XZ9XZ9XZ9XZ9XZ9XZ9XZ9XZ9XZ9');