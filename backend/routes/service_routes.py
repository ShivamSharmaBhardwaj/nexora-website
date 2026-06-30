# backend/routes/service_routes.py
from flask import Blueprint, jsonify, request

service_bp = Blueprint('service', __name__, url_prefix='/api/services')

# ============================================
# SERVICE PAGE DATA
# ============================================

SERVICE_DATA = {
    'web-development-agra': {
        'title': 'Web Development Company in Agra, India',
        'meta_description': 'Best web development company in Agra, India. Krynova Technologies creates custom websites, web applications, and enterprise solutions. Starting from ₹15,000. 50+ satisfied clients.',
        'keywords': 'web development company Agra, website design Agra, custom web development, best web developer Agra, software company Agra',
        'h1': 'Web Development Company in Agra, India',
        'subheading': 'Custom Web Solutions for Agra Businesses',
        'hero': {
            'title': 'Transform Your Business with Custom Web Solutions',
            'description': 'From simple business websites to complex web applications — we build it all. Serving businesses in Agra and across India.',
            'cta': 'Get Free Quote',
            'cta_link': '/contact'
        },
        'services': [
            {
                'title': 'Custom Website Design',
                'description': 'Beautiful, responsive websites that convert visitors into customers.',
                'price': '₹15,000+'
            },
            {
                'title': 'Web Application Development',
                'description': 'Powerful web applications with modern technologies and scalable architecture.',
                'price': '₹35,000+'
            },
            {
                'title': 'E-Commerce Solutions',
                'description': 'Complete online stores with payment integration and inventory management.',
                'price': '₹25,000+'
            },
            {
                'title': 'CMS Development',
                'description': 'Content management systems for easy website updates and management.',
                'price': '₹20,000+'
            }
        ],
        'features': [
            '100% Custom Development',
            'Mobile Responsive Design',
            'SEO Optimized',
            'Fast Loading Speed',
            'Secure & Scalable',
            '24/7 Support'
        ],
        'why_choose': [
            '8+ Years Experience',
            '50+ Systems Built',
            '100% Client Satisfaction',
            'Affordable Pricing',
            'Free Consultation',
            'Dedicated Support Team'
        ],
        'faqs': [
            {
                'q': 'How much does a website cost in Agra?',
                'a': 'Our website development starts from ₹15,000 for basic websites. Professional websites with advanced features start from ₹35,000. Contact us for a custom quote based on your requirements.'
            },
            {
                'q': 'How long does it take to build a website?',
                'a': 'Simple websites take 1-2 weeks. Professional websites with more features take 2-4 weeks. Complex web applications may take 1-3 months depending on requirements.'
            },
            {
                'q': 'Do you provide website maintenance?',
                'a': 'Yes! We offer 24/7 maintenance and support packages. All our websites come with a warranty period and ongoing support options.'
            },
            {
                'q': 'Why choose Krynova Technologies in Agra?',
                'a': 'We are a local web development company in Agra with 8+ years of experience. We have built 50+ systems for businesses across India. Our team provides personalized service and transparent communication.'
            }
        ]
    },
    'hrms-software': {
        'title': 'HRMS Software India - Complete Human Resource Management System',
        'meta_description': 'Complete HRMS software for Indian businesses. Krynova Technologies offers payroll, attendance, performance tracking, and employee management systems. Trusted by 50+ companies.',
        'keywords': 'HRMS software India, HR management system, payroll software, attendance management, employee management system',
        'h1': 'HRMS Software for Indian Businesses',
        'subheading': 'Complete Human Resource Management System',
        'hero': {
            'title': 'Streamline Your HR Operations',
            'description': 'Automate payroll, track attendance, manage performance, and handle all HR tasks from one powerful platform.',
            'cta': 'Request Demo',
            'cta_link': '/contact'
        },
        'services': [
            {
                'title': 'Payroll Management',
                'description': 'Automated payroll processing with tax calculations, salary slips, and compliance management.',
                'price': 'Contact for Pricing'
            },
            {
                'title': 'Attendance Tracking',
                'description': 'Biometric and digital attendance tracking with real-time monitoring and reporting.',
                'price': 'Contact for Pricing'
            },
            {
                'title': 'Performance Management',
                'description': 'Goal setting, performance reviews, and employee evaluation tools for better productivity.',
                'price': 'Contact for Pricing'
            },
            {
                'title': 'Employee Database',
                'description': 'Centralized employee information management with secure access and reporting.',
                'price': 'Contact for Pricing'
            }
        ],
        'features': [
            'Automated Payroll',
            'Real-time Attendance',
            'Performance Analytics',
            'Leave Management',
            'Employee Self-Service',
            'Compliance Reporting'
        ],
        'why_choose': [
            'Customizable for Indian Businesses',
            'Secure & Scalable',
            '24/7 Support',
            'Mobile Access',
            'Integration Ready',
            'Cost-Effective'
        ],
        'faqs': [
            {
                'q': 'What is HRMS software?',
                'a': 'HRMS (Human Resource Management System) is software that helps businesses manage employee data, payroll, attendance, performance, and other HR functions in one platform.'
            },
            {
                'q': 'How much does HRMS software cost in India?',
                'a': 'Our HRMS pricing is customized based on your company size and requirements. We offer affordable solutions starting from ₹25,000 for small businesses.'
            },
            {
                'q': 'Is the HRMS software cloud-based?',
                'a': 'Yes! Our HRMS is cloud-based, allowing you to access it from anywhere. We also offer on-premise deployment for organizations with specific security requirements.'
            },
            {
                'q': 'How long does implementation take?',
                'a': 'Implementation typically takes 1-2 weeks for small companies and 3-4 weeks for larger organizations. We provide full training and support during implementation.'
            }
        ]
    },
    'property-management': {
        'title': 'Property Management System - Real Estate Software',
        'meta_description': 'Advanced property management system for real estate businesses. Tenant management, rent collection, property tracking, and analytics. Trusted by 50+ real estate companies.',
        'keywords': 'property management system, real estate software, rental management, tenant management, property tracking',
        'h1': 'Property Management System for Real Estate',
        'subheading': 'Complete Real Estate Management Solution',
        'hero': {
            'title': 'Manage Your Properties with Ease',
            'description': 'Track tenants, collect rent, manage maintenance, and get real-time insights — all from one powerful platform.',
            'cta': 'Get Started',
            'cta_link': '/contact'
        },
        'services': [
            {
                'title': 'Tenant Management',
                'description': 'Complete tenant information management with lease tracking and communication tools.',
                'price': 'Contact for Pricing'
            },
            {
                'title': 'Rent Collection',
                'description': 'Automated rent collection with payment reminders, online payments, and financial reporting.',
                'price': 'Contact for Pricing'
            },
            {
                'title': 'Property Tracking',
                'description': 'Track property details, maintenance history, and occupancy status in real-time.',
                'price': 'Contact for Pricing'
            },
            {
                'title': 'Analytics & Reports',
                'description': 'Comprehensive analytics and reports on occupancy, revenue, and property performance.',
                'price': 'Contact for Pricing'
            }
        ],
        'features': [
            'Tenant Management',
            'Automated Rent Collection',
            'Maintenance Tracking',
            'Financial Reports',
            'Property Analytics',
            'Mobile Access'
        ],
        'why_choose': [
            'Designed for Indian Real Estate',
            'Easy to Use',
            'Scalable Platform',
            'Secure Data',
            '24/7 Support',
            'Customizable Reports'
        ],
        'faqs': [
            {
                'q': 'What is property management software?',
                'a': 'Property management software helps real estate businesses manage properties, tenants, rent collection, maintenance, and financial reporting in one centralized platform.'
            },
            {
                'q': 'How much does property management software cost?',
                'a': 'Pricing starts from ₹30,000 for small businesses. Enterprise solutions are custom-quoted based on your requirements.'
            },
            {
                'q': 'Can I track maintenance requests?',
                'a': 'Yes! Our system includes maintenance tracking with tenant request management, vendor coordination, and completion tracking.'
            },
            {
                'q': 'Is it suitable for multiple properties?',
                'a': 'Absolutely! Our system is designed for managing single or multiple properties with portfolio management features.'
            }
        ]
    },
    'whatsapp-automation': {
        'title': 'WhatsApp Automation Bot - AI Chatbot for Business',
        'meta_description': 'AI-powered WhatsApp automation bot for lead generation, customer support, and automated communication. 24/7 customer engagement for Indian businesses.',
        'keywords': 'WhatsApp automation bot, WhatsApp business API, AI chatbot India, lead generation WhatsApp, customer support automation',
        'h1': 'WhatsApp Automation Bot for Business',
        'subheading': '24/7 Customer Engagement with AI',
        'hero': {
            'title': 'Automate Your WhatsApp Communication',
            'description': 'Generate leads, provide 24/7 customer support, and automate business communication with our AI-powered WhatsApp bot.',
            'cta': 'Try Demo',
            'cta_link': '/contact'
        },
        'services': [
            {
                'title': 'Lead Generation',
                'description': 'Automated lead capture and qualification through WhatsApp conversations.',
                'price': 'Contact for Pricing'
            },
            {
                'title': 'Customer Support',
                'description': '24/7 AI-powered customer support with instant responses to common queries.',
                'price': 'Contact for Pricing'
            },
            {
                'title': 'Order Processing',
                'description': 'Automated order placement, confirmation, and tracking through WhatsApp.',
                'price': 'Contact for Pricing'
            },
            {
                'title': 'Broadcast & Campaigns',
                'description': 'Send broadcast messages and promotional campaigns to your WhatsApp audience.',
                'price': 'Contact for Pricing'
            }
        ],
        'features': [
            '24/7 Automated Responses',
            'Lead Generation',
            'Order Processing',
            'Broadcast Messages',
            'Analytics Dashboard',
            'Multi-language Support'
        ],
        'why_choose': [
            'AI-Powered',
            'Easy Setup',
            'Scalable Platform',
            'Secure & Reliable',
            '24/7 Support',
            'Customizable Responses'
        ],
        'faqs': [
            {
                'q': 'What is WhatsApp automation?',
                'a': 'WhatsApp automation uses AI-powered bots to automate business communication, lead generation, customer support, and order processing on WhatsApp.'
            },
            {
                'q': 'How much does WhatsApp automation cost?',
                'a': 'Pricing starts from ₹20,000 for small businesses. Enterprise solutions are custom-quoted based on your requirements and message volume.'
            },
            {
                'q': 'Is it WhatsApp Business API compliant?',
                'a': 'Yes! Our solution is fully compliant with WhatsApp Business API guidelines and policies.'
            },
            {
                'q': 'Can I use it for multiple WhatsApp numbers?',
                'a': 'Yes! Our system supports multiple WhatsApp numbers and accounts for large businesses.'
            }
        ]
    },
    'enterprise-software': {
        'title': 'Enterprise Software Development Company - Custom Solutions',
        'meta_description': 'Enterprise software development services by Krynova Technologies. Custom enterprise solutions for large organizations. Trusted by 50+ businesses across India.',
        'keywords': 'enterprise software development, custom enterprise solutions, business management software, enterprise application development, software company India',
        'h1': 'Enterprise Software Development Services',
        'subheading': 'Scalable Solutions for Growing Businesses',
        'hero': {
            'title': 'Build Scalable Enterprise Solutions',
            'description': 'Custom enterprise software development for large organizations. Scalable, secure, and tailored to your business needs.',
            'cta': 'Contact Us',
            'cta_link': '/contact'
        },
        'services': [
            {
                'title': 'Custom Enterprise Software',
                'description': 'Tailored software solutions for enterprise-level business operations and management.',
                'price': 'Custom Quote'
            },
            {
                'title': 'Business Intelligence',
                'description': 'Advanced analytics and reporting solutions for data-driven decision making.',
                'price': 'Custom Quote'
            },
            {
                'title': 'ERP Solutions',
                'description': 'Complete enterprise resource planning systems for streamlined operations.',
                'price': 'Custom Quote'
            },
            {
                'title': 'Integration Services',
                'description': 'Seamless integration of enterprise systems and third-party applications.',
                'price': 'Custom Quote'
            }
        ],
        'features': [
            'Scalable Architecture',
            'Enterprise Security',
            'API Integration',
            'Real-time Analytics',
            'Cloud Deployment',
            '24/7 Support'
        ],
        'why_choose': [
            '8+ Years Experience',
            '50+ Enterprise Systems',
            'Trusted by Leading Companies',
            'ISO Standard Security',
            'Dedicated Team',
            'End-to-End Support'
        ],
        'faqs': [
            {
                'q': 'What is enterprise software development?',
                'a': 'Enterprise software development involves creating large-scale, complex software solutions designed to meet the needs of large organizations and businesses.'
            },
            {
                'q': 'How much does enterprise software cost?',
                'a': 'Enterprise software costs vary based on requirements. We provide custom quotes after understanding your business needs.'
            },
            {
                'q': 'How long does enterprise software development take?',
                'a': 'Timeline depends on complexity. Enterprise solutions typically take 3-6 months for development and deployment.'
            },
            {
                'q': 'What industries do you serve?',
                'a': 'We serve various industries including HR, real estate, manufacturing, healthcare, retail, and more.'
            }
        ]
    }
}

# ============================================
# ROUTES
# ============================================

@service_bp.route('/<service_id>', methods=['GET'])
def get_service_data(service_id):
    """Get service page data by ID"""
    try:
        service = SERVICE_DATA.get(service_id)
        if not service:
            return jsonify({
                'success': False,
                'message': 'Service not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': service
        })
    
    except Exception as e:
        print(f"Error fetching service data: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@service_bp.route('/list', methods=['GET'])
def list_services():
    """List all available services"""
    try:
        services = []
        for key, data in SERVICE_DATA.items():
            services.append({
                'id': key,
                'title': data.get('title', ''),
                'h1': data.get('h1', ''),
                'subheading': data.get('subheading', '')
            })
        
        return jsonify({
            'success': True,
            'services': services
        })
    
    except Exception as e:
        print(f"Error listing services: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@service_bp.route('/<service_id>/faqs', methods=['GET'])
def get_service_faqs(service_id):
    """Get FAQs for a specific service"""
    try:
        service = SERVICE_DATA.get(service_id)
        if not service:
            return jsonify({
                'success': False,
                'message': 'Service not found'
            }), 404
        
        return jsonify({
            'success': True,
            'faqs': service.get('faqs', [])
        })
    
    except Exception as e:
        print(f"Error fetching FAQs: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@service_bp.route('/test', methods=['GET'])
def test_service():
    """Test endpoint to verify service routes are loaded"""
    return jsonify({
        'success': True,
        'message': 'Service routes are working!',
        'available_services': list(SERVICE_DATA.keys())
    })