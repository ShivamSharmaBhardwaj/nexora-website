// src/pages/tools/ResumeBuilder.jsx
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaPalette, FaPrint, 
  FaShare, FaCopy, FaEye, FaEyeSlash, FaFileAlt, FaUser, 
  FaBriefcase, FaGraduationCap, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaCheckCircle, FaCircle, FaArrowRight, 
  FaTools, FaCrown, FaFilePdf, FaTimes, FaPlus, FaMagic,
  FaLightbulb, FaRocket, FaChartLine, FaUsers, FaCode,
  FaDatabase, FaCloud, FaMobile, FaDesktop, FaRobot,
  FaRegFileAlt, FaRegFilePdf, FaRegFileWord, FaRegFileExcel,
  FaClock, FaChevronDown, FaChevronUp, FaAward, FaShieldAlt,
  FaMedal, FaFlag, FaThumbsUp, FaPenFancy, FaSearch,
  FaCheckDouble, FaExclamationTriangle, FaInfoCircle,
  FaFileInvoice, FaClipboardCheck, FaBullseye, FaTrophy,
  FaMapPin, FaGlobe, FaMicrophone, FaComments, FaMoon,
  FaProjectDiagram, FaCertificate, FaLanguage, FaStar as FaStarIcon,
  FaLightbulb as FaLightbulbIcon, FaUserGraduate,
  FaLaptopCode, FaBuilding, FaGlobe as FaGlobeIcon, FaLinkedin,
  FaGithub, FaTwitter, FaInstagram, FaYoutube, FaFacebook,
  FaWhatsapp, FaTelegram, FaDiscord, FaReddit, FaMedium,
  FaDev, FaStackOverflow, FaGitlab, FaBitbucket, FaDocker,
  FaAws, FaGoogle, FaMicrosoft, FaApple, FaAndroid, FaTrash,
  FaEdit, FaGripVertical, FaSort, FaFilter, FaEye as FaEyeIcon
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import { secureStorage } from '../../utils/security';
import PaymentModal from '../../components/PaymentModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

// ============================================
// ✅ SAFE ARRAY HELPERS
// ============================================

const safeArray = (data) => {
  return Array.isArray(data) ? data : [];
};

// ============================================
// ✅ INDIAN CITIES FOR GEO TARGETING
// ============================================
const indianCities = [
  "Agra", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", 
  "Pune", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Lucknow", 
  "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", 
  "Patna", "Vadodara", "Ludhiana", "Nashik", "Faridabad", "Meerut", 
  "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", 
  "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", 
  "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", 
  "Chandigarh", "Guwahati", "Solapur", "Hubballi-Dharwad", "Mysore", 
  "Tiruchirappalli", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", 
  "Dehradun", "Noida", "Gurugram", "Ghaziabad", "Faridabad"
];

// ✅ GLOBAL COUNTRIES
const globalCountries = [
  "USA", "UK", "Canada", "Australia", "UAE", "Singapore", 
  "Germany", "France", "Japan", "South Korea", "Netherlands", 
  "Sweden", "Norway", "Denmark", "Finland", "New Zealand", 
  "Ireland", "Malaysia", "Thailand", "Vietnam", "Indonesia", 
  "Philippines", "South Africa", "Kenya", "Nigeria", "Egypt", 
  "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"
];

// ============================================
// ✅ 18 TEMPLATES CONFIGURATION WITH EXAMPLES
// ============================================
const TEMPLATES = {
  modern: {
    id: 'modern',
    name: 'Modern',
    icon: FaFileAlt,
    description: 'Clean, professional design with ATS-optimized layout',
    preview: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    primaryColor: 'blue-600',
    secondaryColor: 'gray-100',
    accentColor: 'blue-100',
    fontFamily: 'Inter',
    atsScore: 99.97,
    premium: false,
    layout: 'single-column',
    example: {
      name: 'Sarah Johnson',
      title: 'Senior Full Stack Developer',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      summary: 'Innovative Senior Full Stack Developer with 7+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud architecture.',
      skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Redis', 'CI/CD'],
      experience: [
        { title: 'Senior Full Stack Developer', company: 'TechCorp Inc.', startDate: '2020', endDate: 'Present', description: '• Architected microservices handling 50M+ daily requests\n• Led team of 12 developers across 3 continents\n• Reduced deployment time by 70% using CI/CD pipelines\n• Implemented real-time features serving 2M+ users' },
        { title: 'Full Stack Developer', company: 'StartupHub', startDate: '2017', endDate: '2020', description: '• Built full-stack applications using React and Node.js\n• Optimized database queries improving performance by 40%\n• Implemented authentication and authorization systems' }
      ],
      education: [
        { degree: 'M.S. Computer Science', institution: 'Stanford University', startYear: '2015', endYear: '2017', gpa: '3.9', description: '' },
        { degree: 'B.S. Computer Engineering', institution: 'MIT', startYear: '2011', endYear: '2015', gpa: '3.8', description: 'Cum Laude' }
      ],
      projects: [
        { name: 'E-Commerce Platform', year: '2022', technologies: 'React, Node.js, MongoDB, Stripe', description: '• Built full-stack e-commerce with 100K+ users\n• Implemented payment gateway and inventory management' },
        { name: 'AI Chatbot', year: '2021', technologies: 'Python, TensorFlow, NLP', description: '• Developed NLP chatbot with 95% accuracy\n• Integrated with multiple messaging platforms' }
      ],
      certifications: [
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon', year: '2022' },
        { name: 'Google Professional Cloud Architect', issuer: 'Google', year: '2021' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Spanish', proficiency: 'Professional' },
        { language: 'French', proficiency: 'Conversational' }
      ]
    }
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    icon: FaRegFileAlt,
    description: 'Clean, minimalist design focusing on content',
    preview: 'bg-gradient-to-r from-gray-600 to-gray-800',
    primaryColor: 'gray-800',
    secondaryColor: 'white',
    accentColor: 'gray-100',
    fontFamily: 'Arial',
    atsScore: 99.95,
    premium: false,
    layout: 'single-column',
    example: {
      name: 'Emily Chen',
      title: 'UX/UI Designer',
      email: 'emily.chen@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      summary: 'Human-centered UX/UI Designer with 6+ years of experience creating intuitive digital experiences. Passionate about accessibility and inclusive design.',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'UI Design', 'Design Systems', 'Accessibility', 'User Testing', 'HTML/CSS'],
      experience: [
        { title: 'Senior UX Designer', company: 'DesignStudio', startDate: '2019', endDate: 'Present', description: '• Designed 20+ successful products\n• Led design thinking workshops\n• Established design system for 10+ products\n• Increased user satisfaction by 35%' },
        { title: 'UX Designer', company: 'Creative Agency', startDate: '2016', endDate: '2019', description: '• Created wireframes and prototypes for 50+ projects\n• Conducted user research and usability testing\n• Collaborated with developers to ensure design implementation' }
      ],
      education: [
        { degree: 'BFA Interaction Design', institution: 'Savannah College', startYear: '2012', endYear: '2016', gpa: '3.7', description: '' }
      ],
      projects: [
        { name: 'Healthcare App', year: '2022', technologies: 'Figma, Design Systems', description: '• Designed patient portal for 500K+ users\n• Improved accessibility score to 98%' },
        { name: 'Fintech Dashboard', year: '2021', technologies: 'Adobe XD, Data Visualization', description: '• Created data visualization for 1M+ transactions\n• Designed responsive dashboard for multiple devices' }
      ],
      certifications: [
        { name: 'Certified UX Designer', issuer: 'UX Certification Board', year: '2021' },
        { name: 'Google UX Design Certificate', issuer: 'Google', year: '2020' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Mandarin', proficiency: 'Fluent' }
      ]
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    icon: FaBriefcase,
    description: 'Traditional professional design for corporate roles',
    preview: 'bg-gradient-to-r from-blue-700 to-blue-900',
    primaryColor: 'blue-900',
    secondaryColor: 'gray-50',
    accentColor: 'blue-50',
    fontFamily: 'Times New Roman',
    atsScore: 99.99,
    premium: false,
    layout: 'single-column',
    example: {
      name: 'Dr. James Wilson',
      title: 'Chief Financial Officer',
      email: 'james.wilson@email.com',
      phone: '+1 (555) 567-8901',
      location: 'Chicago, IL',
      summary: 'Seasoned CFO with 20+ years of financial leadership experience across multiple industries. Expertise in M&A, strategic planning, and corporate finance.',
      skills: ['Strategic Planning', 'M&A', 'Corporate Finance', 'Financial Modeling', 'Risk Management', 'Investor Relations', 'Budgeting', 'Audit', 'Compliance', 'Treasury Management'],
      experience: [
        { title: 'Chief Financial Officer', company: 'Fortune 500 Corp', startDate: '2015', endDate: 'Present', description: '• Managed $5B+ annual budget\n• Led successful IPO valuation of $2B\n• Increased profitability by 35%\n• Optimized capital structure saving $100M+' },
        { title: 'VP of Finance', company: 'Global Enterprise', startDate: '2010', endDate: '2015', description: '• Led financial planning and analysis\n• Managed team of 50+ finance professionals\n• Implemented cost reduction strategies' }
      ],
      education: [
        { degree: 'MBA Finance', institution: 'University of Chicago', startYear: '2006', endYear: '2008', gpa: '3.9', description: '' },
        { degree: 'B.S. Accounting', institution: 'University of Illinois', startYear: '2002', endYear: '2006', gpa: '3.8', description: 'CPA, CFA' }
      ],
      projects: [
        { name: 'IPO Preparation', year: '2021-2022', technologies: 'Financial Modeling, SEC Compliance', description: '• Led IPO process raising $2B\n• Developed investor relations strategy' },
        { name: 'Global Expansion', year: '2019-2020', technologies: 'Strategic Planning, Risk Assessment', description: '• Expanded operations to 15 countries\n• Established financial systems and controls' }
      ],
      certifications: [
        { name: 'CPA', issuer: 'AICPA', year: '2006' },
        { name: 'CFA', issuer: 'CFA Institute', year: '2008' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'German', proficiency: 'Professional' }
      ]
    }
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    icon: FaPalette,
    description: 'Bold design for creative professionals',
    preview: 'bg-gradient-to-r from-orange-500 to-red-500',
    primaryColor: 'orange-600',
    secondaryColor: 'orange-50',
    accentColor: 'orange-100',
    fontFamily: 'Poppins',
    atsScore: 99.96,
    premium: false,
    layout: 'single-column',
    example: {
      name: 'Alex Rivera',
      title: 'Creative Director & Brand Strategist',
      email: 'alex.rivera@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Los Angeles, CA',
      summary: 'Award-winning Creative Director with 10+ years of experience building iconic brands. Expert in visual storytelling, brand strategy, and creative leadership.',
      skills: ['Brand Strategy', 'Creative Direction', 'Visual Identity', 'Art Direction', 'Packaging Design', 'Typography', 'Illustration', 'Motion Design', 'Photography', 'Copywriting'],
      experience: [
        { title: 'Creative Director', company: 'BrandCraft Studio', startDate: '2015', endDate: 'Present', description: '• Built brands for 100+ clients\n• Generated $50M+ in brand value\n• Won 20+ industry awards\n• Led creative team of 25' },
        { title: 'Senior Art Director', company: 'Agency 360', startDate: '2010', endDate: '2015', description: '• Created campaigns for Fortune 500 clients\n• Managed creative teams\n• Developed brand identities' }
      ],
      education: [
        { degree: 'MFA Graphic Design', institution: 'Art Center College', startYear: '2008', endYear: '2010', gpa: '3.9', description: '' },
        { degree: 'BFA Visual Communication', institution: 'CalArts', startYear: '2004', endYear: '2008', gpa: '3.8', description: '' }
      ],
      projects: [
        { name: 'Global Brand Refresh', year: '2022', technologies: 'Brand Strategy, Design Systems', description: '• Rebranded Fortune 500 company\n• Launched in 30+ countries' },
        { name: 'Award-Winning Campaign', year: '2021', technologies: 'Motion Design, Photography', description: '• Created campaign with 500M+ impressions\n• Won Cannes Lion award' }
      ],
      certifications: [
        { name: 'Adobe Certified Expert', issuer: 'Adobe', year: '2019' },
        { name: 'Design Leadership Certificate', issuer: 'D&AD', year: '2018' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Spanish', proficiency: 'Native' },
        { language: 'French', proficiency: 'Professional' }
      ]
    }
  },
  clean: {
    id: 'clean',
    name: 'Clean',
    icon: FaFileInvoice,
    description: 'Ultra-clean design with maximum readability',
    preview: 'bg-gradient-to-r from-slate-500 to-gray-600',
    primaryColor: 'slate-700',
    secondaryColor: 'white',
    accentColor: 'slate-100',
    fontFamily: 'Inter',
    atsScore: 99.97,
    premium: false,
    layout: 'single-column',
    example: {
      name: 'Lisa Park',
      title: 'Product Manager',
      email: 'lisa.park@email.com',
      phone: '+1 (555) 333-4444',
      location: 'Seattle, WA',
      summary: 'Strategic Product Manager with 8+ years of experience in B2B SaaS products. Expertise in product strategy, user research, and go-to-market execution.',
      skills: ['Product Strategy', 'User Research', 'Product Roadmap', 'Agile', 'Scrum', 'Market Analysis', 'Competitor Analysis', 'Product Analytics', 'Go-to-Market', 'User Stories'],
      experience: [
        { title: 'Senior Product Manager', company: 'TechSaaS Inc.', startDate: '2019', endDate: 'Present', description: '• Launched 5 products generating $50M+ revenue\n• Led cross-functional teams of 40+ people\n• Increased user retention by 45%\n• Established product-led growth strategy' },
        { title: 'Product Manager', company: 'StartupX', startDate: '2016', endDate: '2019', description: '• Managed product lifecycle for 3 products\n• Conducted user interviews with 500+ customers\n• Defined product requirements and specifications' }
      ],
      education: [
        { degree: 'MBA Product Management', institution: 'Stanford', startYear: '2014', endYear: '2016', gpa: '3.8', description: '' },
        { degree: 'B.A. Economics', institution: 'UC Berkeley', startYear: '2010', endYear: '2014', gpa: '3.7', description: '' }
      ],
      projects: [
        { name: 'AI Product Launch', year: '2022', technologies: 'Product Strategy, AI/ML', description: '• Launched AI-powered product with 100K+ users\n• Generated $10M ARR in first year' },
        { name: 'Mobile App Redesign', year: '2021', technologies: 'UX Research, Product Design', description: '• Redesigned app with 4.8/5 rating\n• Increased user engagement by 60%' }
      ],
      certifications: [
        { name: 'Certified Product Manager', issuer: 'Product Management Institute', year: '2020' },
        { name: 'Agile Product Owner', issuer: 'Scrum Alliance', year: '2019' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Korean', proficiency: 'Native' },
        { language: 'Japanese', proficiency: 'Professional' }
      ]
    }
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    icon: FaTools,
    description: 'Modern design perfect for tech professionals',
    preview: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    primaryColor: 'cyan-600',
    secondaryColor: 'cyan-50',
    accentColor: 'cyan-100',
    fontFamily: 'Consolas',
    atsScore: 99.98,
    premium: false,
    layout: 'single-column',
    example: {
      name: 'David Kim',
      title: 'Machine Learning Engineer',
      email: 'david.kim@email.com',
      phone: '+1 (555) 678-9012',
      location: 'Seattle, WA',
      summary: 'Machine Learning Engineer with 5+ years of experience building and deploying AI/ML solutions. Expertise in deep learning, NLP, and computer vision.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'NumPy', 'Pandas', 'SQL', 'AWS SageMaker', 'Docker', 'Kubernetes', 'Git', 'Linux'],
      experience: [
        { title: 'Senior ML Engineer', company: 'AI Tech Labs', startDate: '2020', endDate: 'Present', description: '• Built NLP models serving 10M+ users\n• Deployed 20+ ML models to production\n• Improved model accuracy by 30%\n• Led ML team of 8 engineers' },
        { title: 'Data Scientist', company: 'Data Corp', startDate: '2018', endDate: '2020', description: '• Developed predictive models for customer churn\n• Built ETL pipelines for large-scale data processing\n• Implemented A/B testing frameworks' }
      ],
      education: [
        { degree: 'Ph.D. Computer Science (AI/ML)', institution: 'MIT', startYear: '2015', endYear: '2018', gpa: '3.9', description: 'Thesis: "Neural Networks for Time Series Analysis"' },
        { degree: 'M.S. Data Science', institution: 'UC Berkeley', startYear: '2013', endYear: '2015', gpa: '3.8', description: '' }
      ],
      projects: [
        { name: 'NLP Chatbot', year: '2022', technologies: 'Python, TensorFlow, NLP', description: '• Built chatbot with 95% accuracy\n• Serving 5M+ users monthly' },
        { name: 'Computer Vision System', year: '2021', technologies: 'PyTorch, OpenCV', description: '• Developed system with 99% accuracy\n• Deployed on edge devices' }
      ],
      certifications: [
        { name: 'TensorFlow Developer Certificate', issuer: 'Google', year: '2022' },
        { name: 'AWS Machine Learning Specialty', issuer: 'Amazon', year: '2021' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Korean', proficiency: 'Native' }
      ]
    }
  },
  modernDark: {
    id: 'modernDark',
    name: 'Modern Dark',
    icon: FaMoon,
    description: 'Modern dark theme for tech professionals',
    preview: 'bg-gradient-to-r from-gray-800 to-black',
    primaryColor: 'gray-900',
    secondaryColor: 'gray-800',
    accentColor: 'gray-700',
    fontFamily: 'Inter',
    atsScore: 99.96,
    premium: false,
    layout: 'single-column',
    example: {
      name: 'Marcus Johnson',
      title: 'DevOps Engineer',
      email: 'marcus.johnson@email.com',
      phone: '+1 (555) 555-6666',
      location: 'Austin, TX',
      summary: 'Senior DevOps Engineer with 10+ years of experience in cloud infrastructure, CI/CD, and automation. Expertise in AWS, Azure, and GCP.',
      skills: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'GitLab CI', 'Python', 'Bash', 'Linux', 'Nginx', 'Redis', 'PostgreSQL'],
      experience: [
        { title: 'Senior DevOps Engineer', company: 'CloudTech Inc.', startDate: '2018', endDate: 'Present', description: '• Managed AWS infrastructure for 100M+ users\n• Reduced deployment time by 80%\n• Implemented Kubernetes clusters across 3 regions\n• Achieved 99.99% uptime' },
        { title: 'DevOps Engineer', company: 'Enterprise Solutions', startDate: '2014', endDate: '2018', description: '• Built CI/CD pipelines for 50+ applications\n• Implemented monitoring and alerting systems\n• Automated infrastructure provisioning' }
      ],
      education: [
        { degree: 'M.S. Computer Science', institution: 'MIT', startYear: '2012', endYear: '2014', gpa: '3.9', description: '' },
        { degree: 'B.S. Computer Science', institution: 'UT Austin', startYear: '2008', endYear: '2012', gpa: '3.8', description: '' }
      ],
      projects: [
        { name: 'Kubernetes Migration', year: '2022', technologies: 'Kubernetes, Docker, Terraform', description: '• Migrated 500+ services to Kubernetes\n• Reduced costs by 40%' },
        { name: 'CI/CD Pipeline', year: '2021', technologies: 'Jenkins, GitLab CI, AWS', description: '• Built pipeline reducing deployment time by 80%' }
      ],
      certifications: [
        { name: 'AWS Certified DevOps Engineer', issuer: 'Amazon', year: '2022' },
        { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', year: '2021' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' }
      ]
    }
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    icon: FaPalette,
    description: 'Sophisticated design for executives and leaders',
    preview: 'bg-gradient-to-r from-purple-500 to-pink-500',
    primaryColor: 'purple-600',
    secondaryColor: 'gray-50',
    accentColor: 'purple-100',
    fontFamily: 'Georgia',
    atsScore: 99.98,
    premium: false,
    layout: 'single-column',
    example: {
      name: 'Michael Anderson',
      title: 'Chief Technology Officer',
      email: 'michael.anderson@email.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      summary: 'Visionary CTO with 15+ years of experience driving technological innovation and digital transformation. Proven track record of scaling tech teams.',
      skills: ['Strategic Planning', 'Cloud Architecture', 'AI/ML', 'Digital Transformation', 'Team Leadership', 'Product Development', 'Enterprise Software', 'Cybersecurity', 'Data Analytics'],
      experience: [
        { title: 'Chief Technology Officer', company: 'GlobalTech Inc.', startDate: '2018', endDate: 'Present', description: '• Led technology strategy for $2B+ portfolio\n• Built and scaled team from 50 to 500+ engineers\n• Implemented AI solutions increasing efficiency by 45%\n• Reduced operational costs by $10M annually' },
        { title: 'VP of Engineering', company: 'Tech Giant', startDate: '2012', endDate: '2018', description: '• Managed engineering teams across 5 locations\n• Delivered 20+ major product releases\n• Improved development velocity by 40%' }
      ],
      education: [
        { degree: 'MBA', institution: 'Harvard Business School', startYear: '2010', endYear: '2012', gpa: '3.9', description: '' },
        { degree: 'M.S. Computer Science', institution: 'Carnegie Mellon', startYear: '2008', endYear: '2010', gpa: '3.8', description: '' }
      ],
      projects: [
        { name: 'Digital Transformation', year: '2021-2022', technologies: 'Cloud, AI, IoT', description: '• Led transformation across 30+ countries\n• Generated $500M in new revenue' },
        { name: 'AI Strategy', year: '2020', technologies: 'AI/ML, Data Analytics', description: '• Implemented AI across 10+ business units' }
      ],
      certifications: [
        { name: 'Certified Board Director', issuer: 'Board Institute', year: '2022' },
        { name: 'MIT Sloan Digital Transformation', issuer: 'MIT', year: '2021' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'French', proficiency: 'Professional' },
        { language: 'Spanish', proficiency: 'Conversational' }
      ]
    }
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    icon: FaCrown,
    description: 'Premium design for C-level executives',
    preview: 'bg-gradient-to-r from-amber-500 to-yellow-600',
    primaryColor: 'amber-600',
    secondaryColor: 'amber-50',
    accentColor: 'amber-100',
    fontFamily: 'Georgia',
    atsScore: 99.99,
    premium: false,
    layout: 'single-column',
    example: {
      name: 'Dr. Sarah Williams',
      title: 'Chief Executive Officer',
      email: 'sarah.williams@email.com',
      phone: '+1 (555) 111-2222',
      location: 'London, UK',
      summary: 'Transformational CEO with 25+ years of global leadership experience across technology, finance, and healthcare. Proven track record of scaling companies from startup to IPO.',
      skills: ['Corporate Strategy', 'M&A', 'IPO', 'Board Management', 'Global Leadership', 'Digital Transformation', 'Strategic Planning', 'Organizational Development', 'Change Management'],
      experience: [
        { title: 'CEO', company: 'Global Enterprise Solutions', startDate: '2015', endDate: 'Present', description: '• Grew revenue from $50M to $500M in 5 years\n• Led successful IPO valued at $3B\n• Expanded operations to 30+ countries\n• Acquired and integrated 10+ companies' },
        { title: 'COO', company: 'Enterprise Corp', startDate: '2008', endDate: '2015', description: '• Managed global operations across 20 countries\n• Implemented operational excellence program\n• Drove efficiency improvements of 35%' }
      ],
      education: [
        { degree: 'DBA', institution: 'Harvard Business School', startYear: '2005', endYear: '2008', gpa: '3.9', description: '' },
        { degree: 'MBA', institution: 'London Business School', startYear: '2000', endYear: '2002', gpa: '3.8', description: '' }
      ],
      projects: [
        { name: 'IPO Execution', year: '2021', technologies: 'Corporate Finance, Legal, Investor Relations', description: '• Led IPO raising $3B\n• Established governance structure' },
        { name: 'Global Expansion', year: '2019-2020', technologies: 'Strategy, M&A', description: '• Expanded to 30+ countries\n• Established local operations and teams' }
      ],
      certifications: [
        { name: 'Certified Board Director', issuer: 'Board Institute', year: '2020' },
        { name: 'Executive Leadership Certificate', issuer: 'Harvard', year: '2018' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'French', proficiency: 'Fluent' },
        { language: 'German', proficiency: 'Professional' }
      ]
    }
  },
  twoColumn: {
    id: 'twoColumn',
    name: 'Two Column',
    icon: FaFileAlt,
    description: 'Two-column layout with sidebar for skills and info',
    preview: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    primaryColor: 'indigo-600',
    secondaryColor: 'indigo-50',
    accentColor: 'indigo-100',
    fontFamily: 'Inter',
    atsScore: 99.97,
    premium: true,
    layout: 'two-column',
    example: {
      name: 'Rachel Green',
      title: 'Product Designer',
      email: 'rachel.green@email.com',
      phone: '+1 (555) 777-8888',
      location: 'Portland, OR',
      summary: 'Product Designer with 8+ years of experience creating beautiful, functional digital products. Expert in design systems and user-centered design.',
      skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Design Systems', 'User Research', 'Prototyping', 'Interaction Design', 'Visual Design', 'HTML/CSS'],
      experience: [
        { title: 'Lead Product Designer', company: 'DesignLab', startDate: '2018', endDate: 'Present', description: '• Led design for 5+ products used by 10M+ users\n• Built design system used across 20+ teams\n• Increased user satisfaction by 40%' },
        { title: 'Product Designer', company: 'Creative Studio', startDate: '2015', endDate: '2018', description: '• Designed 30+ digital products\n• Conducted 500+ user interviews\n• Collaborated with cross-functional teams' }
      ],
      education: [
        { degree: 'MFA Interaction Design', institution: 'SVA', startYear: '2013', endYear: '2015', gpa: '3.9', description: '' },
        { degree: 'BFA Graphic Design', institution: 'RISD', startYear: '2009', endYear: '2013', gpa: '3.8', description: '' }
      ],
      projects: [
        { name: 'Design System', year: '2022', technologies: 'Figma, Design Tokens', description: '• Built system used by 200+ designers\n• Reduced design time by 50%' },
        { name: 'Mobile App Design', year: '2021', technologies: 'Sketch, Prototyping', description: '• Designed app with 4.9/5 rating\n• Increased user engagement by 45%' }
      ],
      certifications: [
        { name: 'Certified UX Designer', issuer: 'UX Design Institute', year: '2020' },
        { name: 'Design Systems Certificate', issuer: 'DesignOps', year: '2019' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Spanish', proficiency: 'Fluent' }
      ]
    }
  },
  compact: {
    id: 'compact',
    name: 'Compact',
    icon: FaFileInvoice,
    description: 'Compact design for experienced professionals with lots of content',
    preview: 'bg-gradient-to-r from-green-500 to-emerald-500',
    primaryColor: 'emerald-600',
    secondaryColor: 'emerald-50',
    accentColor: 'emerald-100',
    fontFamily: 'Inter',
    atsScore: 99.98,
    premium: true,
    layout: 'single-column',
    example: {
      name: 'Robert Chen',
      title: 'Data Scientist',
      email: 'robert.chen@email.com',
      phone: '+1 (555) 999-0000',
      location: 'Boston, MA',
      summary: 'Data Scientist with 6+ years of experience in predictive modeling and machine learning. Expertise in Python, R, and big data technologies.',
      skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Tableau', 'Power BI', 'AWS', 'GCP', 'Hadoop', 'Spark'],
      experience: [
        { title: 'Senior Data Scientist', company: 'DataCorp', startDate: '2019', endDate: 'Present', description: '• Built predictive models generating $100M+ value\n• Led team of 15 data scientists\n• Deployed 50+ ML models to production\n• Improved model accuracy by 35%' },
        { title: 'Data Scientist', company: 'TechAnalytics', startDate: '2017', endDate: '2019', description: '• Developed analytics solutions for 20+ clients\n• Built ETL pipelines for 100TB+ data\n• Created data visualization dashboards' }
      ],
      education: [
        { degree: 'Ph.D. Data Science', institution: 'Columbia', startYear: '2014', endYear: '2017', gpa: '3.9', description: '' },
        { degree: 'M.S. Statistics', institution: 'UC Berkeley', startYear: '2012', endYear: '2014', gpa: '3.8', description: '' }
      ],
      projects: [
        { name: 'Predictive Analytics Platform', year: '2022', technologies: 'Python, ML, AWS', description: '• Built platform with 99.9% accuracy\n• Serving 500+ enterprise clients' },
        { name: 'NLP Solution', year: '2021', technologies: 'NLP, Deep Learning', description: '• Developed NLP solution with 97% accuracy\n• Processed 10M+ documents' }
      ],
      certifications: [
        { name: 'AWS Machine Learning Specialty', issuer: 'Amazon', year: '2022' },
        { name: 'Google Cloud Professional Data Engineer', issuer: 'Google', year: '2021' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Mandarin', proficiency: 'Fluent' }
      ]
    }
  },
  modernLuxury: {
    id: 'modernLuxury',
    name: 'Modern Luxury',
    icon: FaCrown,
    description: 'Premium luxury design for high-end professionals',
    preview: 'bg-gradient-to-r from-rose-500 to-pink-500',
    primaryColor: 'rose-600',
    secondaryColor: 'rose-50',
    accentColor: 'rose-100',
    fontFamily: 'Playfair Display',
    atsScore: 99.99,
    premium: true,
    layout: 'single-column',
    example: {
      name: 'Victoria Sterling',
      title: 'Luxury Brand Director',
      email: 'victoria.sterling@email.com',
      phone: '+1 (555) 444-5555',
      location: 'Paris, France',
      summary: 'Luxury Brand Director with 15+ years of experience building iconic luxury brands. Expert in brand strategy, creative direction, and market positioning.',
      skills: ['Brand Strategy', 'Creative Direction', 'Luxury Marketing', 'Brand Architecture', 'Visual Identity', 'Art Direction', 'Team Leadership', 'Strategic Planning'],
      experience: [
        { title: 'Brand Director', company: 'Maison de Luxe', startDate: '2015', endDate: 'Present', description: '• Led brand strategy for $2B+ portfolio\n• Increased brand value by 150%\n• Launched 20+ luxury products\n• Built brand presence in 50+ countries' },
        { title: 'Senior Brand Manager', company: 'Luxury Group', startDate: '2010', endDate: '2015', description: '• Managed portfolio of luxury brands\n• Developed go-to-market strategies\n• Led brand positioning initiatives' }
      ],
      education: [
        { degree: 'MBA Luxury Brand Management', institution: 'ESSEC', startYear: '2010', endYear: '2012', gpa: '3.9', description: '' },
        { degree: 'B.A. Art History', institution: 'Sorbonne', startYear: '2006', endYear: '2010', gpa: '3.8', description: '' }
      ],
      projects: [
        { name: 'Global Brand Refresh', year: '2022', technologies: 'Brand Strategy, Creative Direction', description: '• Rebranded 5 luxury brands\n• Increased brand awareness by 200%' },
        { name: 'Digital Strategy', year: '2021', technologies: 'Digital Marketing, Social Media', description: '• Launched digital presence in 30+ countries' }
      ],
      certifications: [
        { name: 'Certified Luxury Brand Manager', issuer: 'Luxury Institute', year: '2020' },
        { name: 'Executive Leadership Certificate', issuer: 'INSEAD', year: '2018' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'French', proficiency: 'Native' },
        { language: 'Italian', proficiency: 'Fluent' }
      ]
    }
  },
  split: {
    id: 'split',
    name: 'Split Layout',
    icon: FaFileAlt,
    description: 'Split layout with skills and info on left, details on right',
    preview: 'bg-gradient-to-r from-cyan-500 to-teal-500',
    primaryColor: 'teal-600',
    secondaryColor: 'teal-50',
    accentColor: 'teal-100',
    fontFamily: 'Inter',
    atsScore: 99.96,
    premium: true,
    layout: 'split',
    example: {
      name: 'Nina Patel',
      title: 'Full Stack Developer',
      email: 'nina.patel@email.com',
      phone: '+1 (555) 222-3333',
      location: 'Toronto, Canada',
      summary: 'Full Stack Developer with 6+ years of experience building scalable web applications. Passionate about clean code and user experience.',
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'GraphQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'CI/CD'],
      experience: [
        { title: 'Full Stack Developer', company: 'TechStack', startDate: '2019', endDate: 'Present', description: '• Built 20+ web applications\n• Led team of 8 developers\n• Reduced load time by 60%\n• Implemented microservices architecture' },
        { title: 'Developer', company: 'CodeWorks', startDate: '2017', endDate: '2019', description: '• Developed 50+ features\n• Improved code coverage to 95%\n• Maintained high-quality code standards' }
      ],
      education: [
        { degree: 'B.S. Computer Science', institution: 'University of Toronto', startYear: '2013', endYear: '2017', gpa: '3.8', description: '' }
      ],
      projects: [
        { name: 'AI Platform', year: '2022', technologies: 'React, Node.js, AI/ML', description: '• Built platform with 500K+ users\n• Reduced response time by 70%' },
        { name: 'E-Commerce Solution', year: '2021', technologies: 'MERN Stack, Stripe', description: '• Built solution with $50M+ revenue\n• Handled 100K+ daily transactions' }
      ],
      certifications: [
        { name: 'AWS Certified Developer', issuer: 'Amazon', year: '2022' },
        { name: 'Google Cloud Engineer', issuer: 'Google', year: '2021' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Hindi', proficiency: 'Fluent' }
      ]
    }
  },
  sidebar: {
    id: 'sidebar',
    name: 'Sidebar Design',
    icon: FaPalette,
    description: 'Sidebar layout with contact and skills on the side',
    preview: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    primaryColor: 'indigo-600',
    secondaryColor: 'indigo-50',
    accentColor: 'indigo-100',
    fontFamily: 'Inter',
    atsScore: 99.97,
    premium: true,
    layout: 'sidebar',
    example: {
      name: 'Oliver Smith',
      title: 'Marketing Director',
      email: 'oliver.smith@email.com',
      phone: '+1 (555) 888-9999',
      location: 'New York, NY',
      summary: 'Marketing Director with 12+ years of experience driving growth through integrated marketing strategies. Expertise in digital marketing, brand building, and team leadership.',
      skills: ['Digital Marketing', 'Brand Strategy', 'SEO/SEM', 'Social Media Marketing', 'Content Marketing', 'Analytics', 'Google Ads', 'Facebook Ads', 'Marketing Automation'],
      experience: [
        { title: 'Marketing Director', company: 'GrowthAgency', startDate: '2016', endDate: 'Present', description: '• Managed $50M marketing budget\n• Increased revenue by 200%\n• Led team of 50+ marketers\n• Launched campaigns in 20+ countries' },
        { title: 'Senior Marketing Manager', company: 'BrandCorp', startDate: '2012', endDate: '2016', description: '• Built brand from scratch\n• Grew following to 2M+ users\n• Led product marketing initiatives' }
      ],
      education: [
        { degree: 'MBA Marketing', institution: 'NYU Stern', startYear: '2010', endYear: '2012', gpa: '3.9', description: '' },
        { degree: 'B.A. Communications', institution: 'Boston University', startYear: '2006', endYear: '2010', gpa: '3.8', description: '' }
      ],
      projects: [
        { name: 'Global Campaign', year: '2022', technologies: 'Digital Marketing, Analytics', description: '• Generated $100M in revenue\n• Reached 500M+ impressions' },
        { name: 'Digital Transformation', year: '2021', technologies: 'Marketing Technology, Automation', description: '• Digitized marketing operations\n• Improved efficiency by 60%' }
      ],
      certifications: [
        { name: 'Google Analytics Certified', issuer: 'Google', year: '2022' },
        { name: 'HubSpot Inbound Marketing', issuer: 'HubSpot', year: '2021' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'German', proficiency: 'Professional' }
      ]
    }
  },
  academic: {
    id: 'academic',
    name: 'Academic',
    icon: FaUserGraduate,
    description: 'Academic style perfect for researchers and educators',
    preview: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    primaryColor: 'cyan-600',
    secondaryColor: 'cyan-50',
    accentColor: 'cyan-100',
    fontFamily: 'Times New Roman',
    atsScore: 99.98,
    premium: true,
    layout: 'single-column',
    example: {
      name: 'Dr. Elizabeth Warren',
      title: 'Professor of Computer Science',
      email: 'elizabeth.warren@email.com',
      phone: '+1 (555) 123-4567',
      location: 'Cambridge, MA',
      summary: 'Professor of Computer Science with 20+ years of academic experience. Published 100+ research papers, mentored 50+ PhD students, and received $10M+ in research funding.',
      skills: ['Research', 'Teaching', 'Mentoring', 'Grant Writing', 'Academic Writing', 'Data Analysis', 'Machine Learning', 'AI Ethics', 'Python', 'R'],
      experience: [
        { title: 'Professor', company: 'MIT', startDate: '2008', endDate: 'Present', description: '• Published 100+ research papers\n• Supervised 50+ PhD students\n• Received $10M+ in research funding\n• Taught 20+ courses' },
        { title: 'Associate Professor', company: 'Stanford', startDate: '2002', endDate: '2008', description: '• Published 50+ papers\n• Received multiple teaching awards\n• Led research projects' }
      ],
      education: [
        { degree: 'Ph.D. Computer Science', institution: 'MIT', startYear: '1998', endYear: '2002', gpa: '4.0', description: '' },
        { degree: 'M.S. Computer Science', institution: 'Stanford', startYear: '1996', endYear: '1998', gpa: '3.9', description: '' },
        { degree: 'B.S. Computer Science', institution: 'Caltech', startYear: '1992', endYear: '1996', gpa: '3.8', description: '' }
      ],
      projects: [
        { name: 'AI Ethics Research', year: '2020-Present', technologies: 'AI Ethics, Machine Learning', description: '• Led research on AI fairness\n• Published 20+ papers' },
        { name: 'Machine Learning Education', year: '2018-2020', technologies: 'Education Technology', description: '• Created ML courses with 100K+ students' }
      ],
      certifications: [
        { name: 'Senior Member IEEE', issuer: 'IEEE', year: '2015' },
        { name: 'ACM Fellow', issuer: 'ACM', year: '2020' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'French', proficiency: 'Professional' }
      ]
    }
  },
  freelance: {
    id: 'freelance',
    name: 'Freelance',
    icon: FaLaptopCode,
    description: 'Modern design for freelancers and independent consultants',
    preview: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    primaryColor: 'orange-600',
    secondaryColor: 'orange-50',
    accentColor: 'orange-100',
    fontFamily: 'Inter',
    atsScore: 99.95,
    premium: true,
    layout: 'single-column',
    example: {
      name: 'Sam Rivera',
      title: 'Freelance Web Developer',
      email: 'sam.rivera@email.com',
      phone: '+1 (555) 777-8888',
      location: 'Barcelona, Spain',
      summary: 'Freelance Web Developer with 8+ years of experience building custom web solutions for clients worldwide. Specializing in React, Next.js, and e-commerce.',
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'PostgreSQL', 'GraphQL', 'TailwindCSS', 'Framer Motion', 'Stripe', 'Vercel', 'AWS'],
      experience: [
        { title: 'Freelance Web Developer', company: 'Self-Employed', startDate: '2016', endDate: 'Present', description: '• Delivered 100+ projects\n• Worked with 50+ clients\n• Generated $2M+ in revenue\n• Maintained 100% satisfaction rate' },
        { title: 'Lead Developer', company: 'Agency', startDate: '2014', endDate: '2016', description: '• Led team of 12 developers\n• Built 30+ websites for clients' }
      ],
      education: [
        { degree: 'B.S. Computer Science', institution: 'University of Barcelona', startYear: '2010', endYear: '2014', gpa: '3.7', description: '' }
      ],
      projects: [
        { name: 'E-Commerce Platform', year: '2022', technologies: 'Next.js, Stripe, TailwindCSS', description: '• Built platform with 50K+ products\n• Handles 10K+ daily orders' },
        { name: 'Portfolio Website', year: '2021', technologies: 'Next.js, Framer Motion', description: '• 4.9/5 rating from clients' }
      ],
      certifications: [
        { name: 'Certified Web Developer', issuer: 'Web Development Institute', year: '2020' },
        { name: 'Next.js Developer', issuer: 'Vercel', year: '2021' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Spanish', proficiency: 'Native' },
        { language: 'Catalan', proficiency: 'Fluent' }
      ]
    }
  },
  startup: {
    id: 'startup',
    name: 'Startup',
    icon: FaRocket,
    description: 'Bold, modern design for startup professionals',
    preview: 'bg-gradient-to-r from-pink-500 to-rose-500',
    primaryColor: 'rose-600',
    secondaryColor: 'rose-50',
    accentColor: 'rose-100',
    fontFamily: 'Inter',
    atsScore: 99.96,
    premium: true,
    layout: 'single-column',
    example: {
      name: 'Alex Chen',
      title: 'Startup CTO & Co-Founder',
      email: 'alex.chen@email.com',
      phone: '+1 (555) 333-4444',
      location: 'San Francisco, CA',
      summary: 'CTO & Co-Founder with 10+ years of experience building successful startups. Expert in product development, team building, and scaling technology.',
      skills: ['Startup Strategy', 'Product Development', 'Team Building', 'Cloud Architecture', 'AI/ML', 'Python', 'React', 'AWS', 'GCP', 'Docker', 'Kubernetes'],
      experience: [
        { title: 'CTO & Co-Founder', company: 'TechStart', startDate: '2015', endDate: 'Present', description: '• Built startup from 0 to $100M valuation\n• Led team of 100+ engineers\n• Raised $50M+ in funding\n• Scaled platform to 5M+ users' },
        { title: 'Senior Engineer', company: 'Google', startDate: '2011', endDate: '2015', description: '• Built products with 1B+ users\n• Led technical projects\n• Mentored junior engineers' }
      ],
      education: [
        { degree: 'MBA', institution: 'Stanford', startYear: '2013', endYear: '2015', gpa: '3.8', description: '' },
        { degree: 'B.S. Computer Science', institution: 'MIT', startYear: '2007', endYear: '2011', gpa: '3.9', description: '' }
      ],
      projects: [
        { name: 'AI Platform', year: '2022', technologies: 'AI/ML, Cloud Architecture', description: '• Built platform with 95% accuracy\n• Used by 500+ enterprise clients' },
        { name: 'Mobile App', year: '2021', technologies: 'React Native, AWS', description: '• Launched app with 1M+ downloads' }
      ],
      certifications: [
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon', year: '2022' },
        { name: 'Startup Leadership Certificate', issuer: 'YC', year: '2020' }
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Mandarin', proficiency: 'Fluent' }
      ]
    }
  }
};

// ============================================
// ATS KEYWORDS
// ============================================
const ATS_KEYWORDS = {
  tech: ['Agile', 'Scrum', 'Cloud', 'AWS', 'Azure', 'DevOps', 'Microservices', 'API', 'REST', 'GraphQL', 'Docker', 'Kubernetes', 'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Redis', 'Git', 'Linux', 'Nginx', 'TDD', 'BDD', 'Kanban', 'JIRA', 'Confluence', 'CI/CD', 'Jenkins', 'Terraform', 'Kafka', 'Elasticsearch', 'Figma', 'Sketch', 'Adobe XD', 'Framer', 'Webflow', 'WordPress', 'Shopify', 'Stripe', 'Twilio', 'SendGrid', 'New Relic', 'Datadog'],
  design: ['UI Design', 'UX Design', 'Wireframing', 'Prototyping', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign', 'Design Systems', 'User Research', 'User Testing', 'Interaction Design', 'Visual Design', 'Brand Identity', 'Typography', 'Color Theory', 'Accessibility', 'WCAG', 'Responsive Design', 'Motion Design', 'Animation', 'Prototyping', 'Design Thinking', 'User Flows', 'Information Architecture', 'A/B Testing', 'Design Sprints'],
  business: ['Strategic Planning', 'Business Development', 'Project Management', 'Agile', 'Scrum', 'Kanban', 'PMP', 'Six Sigma', 'Lean', 'Budgeting', 'Forecasting', 'Financial Analysis', 'Risk Management', 'Stakeholder Management', 'Team Leadership', 'Mentoring', 'Coaching', 'KPI', 'OKR', 'ROI', 'M&A', 'IPO', 'Market Research', 'Competitive Analysis', 'Product Strategy', 'Go-to-Market', 'Sales Strategy', 'Customer Acquisition', 'Retention Strategies', 'Business Intelligence', 'Data Analytics', 'Supply Chain Management', 'Operations Management'],
  marketing: ['Digital Marketing', 'SEO', 'SEM', 'Content Marketing', 'Social Media', 'Email Marketing', 'Analytics', 'Google Analytics', 'Google Ads', 'Facebook Ads', 'Brand Strategy', 'Market Research', 'CRM', 'HubSpot', 'Salesforce', 'Copywriting', 'Marketing Automation', 'PPC', 'SMM', 'CRO', 'Inbound Marketing', 'Outbound Marketing', 'Lead Generation', 'Demand Generation', 'Marketing Strategy', 'Campaign Management', 'Brand Awareness', 'Customer Journey', 'Marketing Analytics', 'Marketing Technology', 'Affiliate Marketing', 'Influencer Marketing']
};

// ============================================
// DYNAMIC ENTRY COMPONENT - FIXED
// ============================================
const DynamicEntrySection = ({ 
  title, 
  icon: Icon, 
  entries, 
  setEntries, 
  fields, 
  fieldLabels,
  placeholderText,
  addButtonText = 'Add Entry',
  maxEntries = 20,
  className = ''
}) => {
  const [newEntry, setNewEntry] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('index');

  // Initialize new entry with empty fields
  const getEmptyEntry = useCallback(() => {
    const entry = {};
    fields.forEach(field => {
      entry[field] = '';
    });
    return entry;
  }, [fields]);

  // Handle add entry
  const handleAddEntry = () => {
    // Check if all fields are filled
    const isEmpty = fields.some(field => !newEntry[field]?.trim());
    if (isEmpty) {
      toast.error('Please fill all fields before adding');
      return;
    }

    if (entries.length >= maxEntries) {
      toast.error(`Maximum ${maxEntries} entries allowed`);
      return;
    }

    setEntries([...entries, { ...newEntry, id: Date.now() }]);
    setNewEntry(getEmptyEntry());
    toast.success(`${title} added successfully!`);
  };

  // Handle edit entry
  const handleEditEntry = (index) => {
    setEditingIndex(index);
    setNewEntry({ ...entries[index] });
  };

  // Handle save edit
  const handleSaveEdit = () => {
    const isEmpty = fields.some(field => !newEntry[field]?.trim());
    if (isEmpty) {
      toast.error('Please fill all fields');
      return;
    }

    const updatedEntries = [...entries];
    updatedEntries[editingIndex] = { ...newEntry, id: entries[editingIndex].id };
    setEntries(updatedEntries);
    setEditingIndex(null);
    setNewEntry(getEmptyEntry());
    toast.success(`${title} updated successfully!`);
  };

  // Handle delete entry
  const handleDeleteEntry = (index) => {
    if (window.confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
      setEntries(entries.filter((_, i) => i !== index));
      toast.success(`${title} deleted!`);
    }
  };

  // Handle duplicate entry
  const handleDuplicateEntry = (index) => {
    const entry = entries[index];
    const duplicated = { ...entry, id: Date.now() };
    const newEntries = [...entries];
    newEntries.splice(index + 1, 0, duplicated);
    setEntries(newEntries);
    toast.success(`${title} duplicated!`);
  };

  // Handle move up/down
  const handleMove = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= entries.length) return;
    
    const newEntries = [...entries];
    [newEntries[index], newEntries[newIndex]] = [newEntries[newIndex], newEntries[index]];
    setEntries(newEntries);
  };

  // Get filtered and sorted entries
  const getDisplayEntries = () => {
    let filtered = [...entries];
    
    // Filter
    if (searchTerm) {
      filtered = filtered.filter(entry => {
        return fields.some(field => 
          String(entry[field] || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Sort
    if (sortBy === 'index') {
      // Keep original order
    } else if (sortBy.startsWith('field:')) {
      const field = sortBy.replace('field:', '');
      filtered.sort((a, b) => {
        const aVal = (a[field] || '').toLowerCase();
        const bVal = (b[field] || '').toLowerCase();
        return aVal.localeCompare(bVal);
      });
    }
    
    return filtered;
  };

  const displayEntries = getDisplayEntries();

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Icon className="text-blue-500" /> {title}
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {entries.length} / {maxEntries}
          </span>
        </h4>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-32 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute right-2 top-1.5 text-gray-400 text-xs" />
          </div>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="index">Default Order</option>
            {fields.map(field => (
              <option key={field} value={`field:${field}`}>
                Sort by {fieldLabels[field] || field}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {fields.map(field => (
            <div key={field}>
              <label className="text-xs font-medium text-gray-600 block mb-0.5">
                {fieldLabels[field] || field}
              </label>
              <input
                type="text"
                placeholder={`Enter ${fieldLabels[field] || field}`}
                value={newEntry[field] || ''}
                onChange={(e) => setNewEntry({ ...newEntry, [field]: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          {editingIndex !== null ? (
            <>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition flex items-center gap-1"
              >
                <FaCheckCircle className="text-xs" /> Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setNewEntry(getEmptyEntry());
                }}
                className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleAddEntry}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
            >
              <FaPlus className="text-xs" /> {addButtonText}
            </button>
          )}
        </div>
      </div>

      {/* Entries List */}
      {displayEntries.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">
          <Icon className="text-2xl mx-auto mb-2 opacity-30" />
          No {title.toLowerCase()} added yet. Click "{addButtonText}" to add.
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {displayEntries.map((entry, displayIndex) => {
            const originalIndex = entries.indexOf(entry);
            return (
              <div
                key={entry.id || displayIndex}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 text-sm">
                      {fields.map(field => (
                        <div key={field} className="text-gray-700">
                          <span className="text-xs text-gray-400 block">
                            {fieldLabels[field] || field}:
                          </span>
                          <span className="font-medium">{entry[field] || '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => handleMove(originalIndex, -1)}
                      disabled={originalIndex === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 transition disabled:opacity-30"
                      title="Move Up"
                    >
                      <FaChevronUp className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(originalIndex, 1)}
                      disabled={originalIndex === entries.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 transition disabled:opacity-30"
                      title="Move Down"
                    >
                      <FaChevronDown className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateEntry(originalIndex)}
                      className="p-1 text-blue-400 hover:text-blue-600 transition"
                      title="Duplicate"
                    >
                      <FaCopy className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditEntry(originalIndex)}
                      className="p-1 text-orange-400 hover:text-orange-600 transition"
                      title="Edit"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEntry(originalIndex)}
                      className="p-1 text-red-400 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================
// ATS SCORE COMPONENT
// ============================================
const ATSScore = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false);

  const calculateATSScore = () => {
    const details = {
      keywords: { score: 0, max: 30, suggestions: [] },
      formatting: { score: 0, max: 20, suggestions: [] },
      content: { score: 0, max: 25, suggestions: [] },
      length: { score: 0, max: 15, suggestions: [] },
      skills: { score: 0, max: 10, suggestions: [] }
    };

    // Combine all text from entries
    const allText = [
      data.summary || '',
      ...safeArray(data.education).map(e => `${e.degree || ''} ${e.institution || ''} ${e.description || ''}`),
      ...safeArray(data.experience).map(e => `${e.title || ''} ${e.company || ''} ${e.description || ''}`),
      ...safeArray(data.projects).map(e => `${e.name || ''} ${e.description || ''}`),
      ...safeArray(data.skills).join(' '),
      ...safeArray(data.certifications).map(e => `${e.name || ''} ${e.issuer || ''}`),
      ...safeArray(data.languages).map(e => `${e.language || ''} ${e.proficiency || ''}`)
    ].join(' ').toLowerCase();

    const allKeywords = [...new Set(Object.values(ATS_KEYWORDS).flat())];
    const foundKeywords = allKeywords.filter(kw => allText.includes(kw.toLowerCase()));
    const keywordCount = foundKeywords.length;
    details.keywords.score = Math.min(30, (keywordCount / 20) * 30);
    if (keywordCount < 12) {
      details.keywords.suggestions = [
        'Add more industry-specific keywords',
        'Include common job title variations',
        'Use both full forms and acronyms',
        'Research job descriptions for relevant keywords',
        'Add skills that are in demand'
      ];
    }

    // Check formatting in descriptions
    const hasBullets = /[•\-]/.test(allText);
    const hasNumbers = /\d+/.test(allText);
    const hasActionWords = /(led|managed|developed|created|designed|implemented|built|achieved|improved|reduced|increased|delivered|launched|spearheaded|optimized|transformed|scaled|mentored|coached)/i.test(allText);
    
    details.formatting.score += hasBullets ? 8 : 0;
    details.formatting.score += hasNumbers ? 5 : 0;
    details.formatting.score += hasActionWords ? 7 : 0;
    
    if (!hasBullets) details.formatting.suggestions.push('Use bullet points (•) for readability');
    if (!hasNumbers) details.formatting.suggestions.push('Include numbers and metrics');
    if (!hasActionWords) details.formatting.suggestions.push('Use action verbs to start bullet points');

    // Content checks
    const hasSummary = (data.summary || '').length > 50;
    const hasExperience = safeArray(data.experience).length > 0;
    const hasEducation = safeArray(data.education).length > 0;
    const hasProjects = safeArray(data.projects).length > 0;
    const hasCertifications = safeArray(data.certifications).length > 0;
    const hasLanguages = safeArray(data.languages).length > 0;
    
    details.content.score += hasSummary ? 7 : 0;
    details.content.score += hasExperience ? 8 : 0;
    details.content.score += hasEducation ? 4 : 0;
    details.content.score += hasProjects ? 3 : 0;
    details.content.score += hasCertifications ? 2 : 0;
    details.content.score += hasLanguages ? 1 : 0;
    
    if (!hasSummary) details.content.suggestions.push('Add a professional summary');
    if (!hasExperience) details.content.suggestions.push('Add work experience (minimum 1 entry)');
    if (!hasEducation) details.content.suggestions.push('Add education (minimum 1 entry)');
    if (!hasProjects) details.content.suggestions.push('Add projects to showcase your work');
    if (!hasCertifications) details.content.suggestions.push('Add certifications to boost credibility');
    if (!hasLanguages) details.content.suggestions.push('Add languages to show diversity');

    // Length check
    const totalLength = allText.length;
    if (totalLength > 500 && totalLength < 2000) {
      details.length.score = 15;
    } else if (totalLength > 300) {
      details.length.score = 10;
    } else {
      details.length.score = 5;
      details.length.suggestions.push('Resume is too short. Add more details.');
    }

    // Skills
    const skillsCount = safeArray(data.skills).length;
    details.skills.score = Math.min(10, skillsCount * 1.2);
    if (skillsCount < 8) {
      details.skills.suggestions.push('Add more skills (minimum 8-12 recommended)');
    } else if (skillsCount < 12) {
      details.skills.suggestions.push('Consider adding more specialized skills');
    }

    const totalScore = Object.values(details).reduce((sum, item) => sum + item.score, 0);
    return { total: Math.min(100, Math.round(totalScore)), details };
  };

  const result = useMemo(() => calculateATSScore(), [data]);
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGrade = (score) => {
    if (score >= 80) return { label: 'Excellent', icon: FaTrophy, color: 'text-green-500' };
    if (score >= 60) return { label: 'Good', icon: FaMedal, color: 'text-yellow-500' };
    if (score >= 40) return { label: 'Needs Improvement', icon: FaShieldAlt, color: 'text-orange-500' };
    return { label: 'Critical Review Needed', icon: FaExclamationTriangle, color: 'text-red-500' };
  };

  const grade = getScoreGrade(result.total);
  const GradeIcon = grade.icon;

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FaClipboardCheck className="text-blue-500" /> ATS Compatibility Score
        </h4>
        <div className="flex items-center gap-2">
          <GradeIcon className={`text-lg ${grade.color}`} />
          <span className={`text-xs font-semibold ${grade.color}`}>{grade.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="32" cx="40" cy="40" />
            <circle
              className={getScoreColor(result.total)}
              strokeWidth="8"
              strokeDasharray={32 * 2 * Math.PI}
              strokeDashoffset={32 * 2 * Math.PI * (1 - result.total / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="32"
              cx="40"
              cy="40"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${getScoreColor(result.total)}`}>{result.total}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Keywords</span>
              <span className="font-medium">{Math.round(result.details.keywords.score)}/30</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Formatting</span>
              <span className="font-medium">{Math.round(result.details.formatting.score)}/20</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Content</span>
              <span className="font-medium">{Math.round(result.details.content.score)}/25</span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setShowDetails(!showDetails)} className="mt-2 text-xs text-blue-600 hover:text-blue-800 transition flex items-center gap-1">
        {showDetails ? <FaChevronUp /> : <FaChevronDown />}
        {showDetails ? 'Hide Suggestions' : 'View Suggestions'}
      </button>

      {showDetails && (
        <div className="mt-3 space-y-2 text-xs max-h-40 overflow-y-auto">
          {Object.entries(result.details).map(([key, value]) => (
            value.suggestions.length > 0 && (
              <div key={key} className="p-2 bg-yellow-50 rounded border border-yellow-200">
                <p className="font-medium text-yellow-700 capitalize">{key}:</p>
                <ul className="mt-1 space-y-0.5">
                  {value.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-gray-600 flex items-start gap-1">
                      <FaInfoCircle className="text-yellow-500 text-xs mt-0.5" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
          {Object.values(result.details).every(v => v.suggestions.length === 0) && (
            <div className="p-2 bg-green-50 rounded border border-green-200 text-green-700">
              <FaCheckCircle className="inline mr-1" /> Great job! Your resume is well-optimized for ATS.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// KEYWORD SUGGESTIONS COMPONENT
// ============================================
const KeywordSuggestions = ({ onAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState('tech');
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const categories = [
    { id: 'tech', label: 'Technology', icon: FaCode },
    { id: 'design', label: 'Design', icon: FaPalette },
    { id: 'business', label: 'Business', icon: FaBriefcase },
    { id: 'marketing', label: 'Marketing', icon: FaChartLine }
  ];

  const toggleKeyword = (keyword) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword) ? prev.filter(k => k !== keyword) : [...prev, keyword]
    );
  };

  const addSelected = () => {
    if (safeArray(selectedKeywords).length === 0) {
      toast.error('Please select at least one keyword');
      return;
    }
    onAdd(safeArray(selectedKeywords).join(', '));
    setSelectedKeywords([]);
    toast.success(`Added ${safeArray(selectedKeywords).length} keywords`);
  };

  const getUniqueKeywords = (category) => {
    const keywords = ATS_KEYWORDS[category] || [];
    return [...new Set(keywords)];
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <FaSearch className="text-blue-500" /> ATS Keyword Suggestions
      </h4>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {safeArray(categories).map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="text-xs" /> {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
        {getUniqueKeywords(selectedCategory).map((keyword, index) => (
          <button
            key={`${selectedCategory}-${keyword}-${index}`}
            onClick={() => toggleKeyword(keyword)}
            className={`px-2 py-1 rounded text-xs transition ${
              selectedKeywords.includes(keyword)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {keyword}
          </button>
        ))}
      </div>

      <button onClick={addSelected} className="mt-3 w-full px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition">
        Add Selected Keywords ({safeArray(selectedKeywords).length})
      </button>
    </div>
  );
};

// ============================================
// RESUME PREVIEW COMPONENT - ENHANCED
// ============================================
const ResumePreview = ({ data, template }) => {
  const templateStyles = {
    modern: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100',
      header: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-gray-800 mb-2',
      skillBadge: 'bg-blue-100 text-blue-700',
    },
    elegant: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-purple-200',
      header: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-purple-600 mb-2',
      skillBadge: 'bg-purple-100 text-purple-700',
    },
    minimal: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200',
      header: 'bg-gray-800 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-gray-800 mb-2',
      skillBadge: 'bg-gray-100 text-gray-700',
    },
    creative: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-orange-200',
      header: 'bg-gradient-to-r from-orange-500 to-red-500 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-orange-600 mb-2',
      skillBadge: 'bg-orange-100 text-orange-700',
    },
    professional: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-blue-200',
      header: 'bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-blue-900 mb-2',
      skillBadge: 'bg-blue-100 text-blue-700',
    },
    tech: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-cyan-200',
      header: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-cyan-600 mb-2',
      skillBadge: 'bg-cyan-100 text-cyan-700',
    },
    executive: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-amber-200',
      header: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-amber-600 mb-2',
      skillBadge: 'bg-amber-100 text-amber-700',
    },
    clean: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-slate-200',
      header: 'bg-gradient-to-r from-slate-600 to-gray-700 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-slate-700 mb-2',
      skillBadge: 'bg-slate-100 text-slate-700',
    },
    modernDark: {
      container: 'bg-gray-900 shadow-xl rounded-lg overflow-hidden border-2 border-gray-700 text-white',
      header: 'bg-gradient-to-r from-gray-800 to-black text-white p-6',
      section: 'border-b border-gray-700 last:border-0 p-4',
      title: 'text-lg font-bold text-white mb-2',
      skillBadge: 'bg-gray-700 text-gray-300',
    },
    twoColumn: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-indigo-200',
      header: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-indigo-600 mb-2',
      skillBadge: 'bg-indigo-100 text-indigo-700',
    },
    compact: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-emerald-200',
      header: 'bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-emerald-600 mb-2',
      skillBadge: 'bg-emerald-100 text-emerald-700',
    },
    modernLuxury: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-rose-200',
      header: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-rose-600 mb-2',
      skillBadge: 'bg-rose-100 text-rose-700',
    },
    split: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-teal-200',
      header: 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-teal-600 mb-2',
      skillBadge: 'bg-teal-100 text-teal-700',
    },
    sidebar: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-indigo-200',
      header: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-indigo-600 mb-2',
      skillBadge: 'bg-indigo-100 text-indigo-700',
    },
    academic: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-cyan-200',
      header: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-cyan-600 mb-2',
      skillBadge: 'bg-cyan-100 text-cyan-700',
    },
    freelance: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-orange-200',
      header: 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-orange-600 mb-2',
      skillBadge: 'bg-orange-100 text-orange-700',
    },
    startup: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-rose-200',
      header: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-rose-600 mb-2',
      skillBadge: 'bg-rose-100 text-rose-700',
    }
  };

  const styles = templateStyles[template.id] || templateStyles.modern;
  const isDark = template.id === 'modernDark';

  const skillsArray = useMemo(() => {
    return safeArray(data.skills);
  }, [data.skills]);

  const experienceEntries = useMemo(() => {
    return safeArray(data.experience);
  }, [data.experience]);

  const educationEntries = useMemo(() => {
    return safeArray(data.education);
  }, [data.education]);

  const projectEntries = useMemo(() => {
    return safeArray(data.projects);
  }, [data.projects]);

  const certificationEntries = useMemo(() => {
    return safeArray(data.certifications);
  }, [data.certifications]);

  const languageEntries = useMemo(() => {
    return safeArray(data.languages);
  }, [data.languages]);

  const formatBulletPoints = (text) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, idx) => (
      <div key={idx} className="flex items-start gap-2 text-sm">
        <span className="text-blue-500 mt-0.5">•</span>
        <span>{line.trim()}</span>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className="text-2xl font-bold">{data.name || 'Your Name'}</h2>
        <p className="text-sm opacity-90">{data.title || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-3 mt-2 text-sm opacity-80">
          {data.email && <span className="flex items-center gap-1"><FaEnvelope className="text-xs" /> {data.email}</span>}
          {data.phone && <span className="flex items-center gap-1"><FaPhone className="text-xs" /> {data.phone}</span>}
          {data.location && <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-xs" /> {data.location}</span>}
        </div>
        {template.atsScore && (
          <div className="mt-2 inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
            <FaStar className="text-yellow-300" /> ATS Score: {template.atsScore}%
          </div>
        )}
      </div>

      <div className={`p-4 ${isDark ? 'text-gray-200' : ''}`}>
        {/* Summary */}
        {data.summary && (
          <div className="mb-4">
            <h3 className={`${styles.title} ${isDark ? 'text-white' : ''}`}>Professional Summary</h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{data.summary}</p>
          </div>
        )}

        {/* Skills */}
        {skillsArray.length > 0 && (
          <div className="mb-4">
            <h3 className={`${styles.title} ${isDark ? 'text-white' : ''}`}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, idx) => (
                <span key={idx} className={`${styles.skillBadge} px-3 py-1 rounded-full text-xs font-medium`}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experienceEntries.length > 0 && (
          <div className="mb-4">
            <h3 className={`${styles.title} ${isDark ? 'text-white' : ''}`}>Experience</h3>
            <div className="space-y-3">
              {experienceEntries.map((exp, idx) => (
                <div key={idx} className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="font-semibold text-base">{exp.title}</div>
                  <div className="text-sm text-gray-500">{exp.company}</div>
                  <div className="text-xs text-gray-400">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  {exp.description && (
                    <div className="mt-1 space-y-0.5">
                      {formatBulletPoints(exp.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educationEntries.length > 0 && (
          <div className="mb-4">
            <h3 className={`${styles.title} ${isDark ? 'text-white' : ''}`}>Education</h3>
            <div className="space-y-3">
              {educationEntries.map((edu, idx) => (
                <div key={idx} className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="font-semibold text-base">{edu.degree}</div>
                  <div className="text-sm text-gray-500">{edu.institution}</div>
                  <div className="text-xs text-gray-400">{edu.startYear} - {edu.endYear || 'Present'}</div>
                  {edu.gpa && <div className="text-xs text-gray-500">GPA: {edu.gpa}</div>}
                  {edu.description && (
                    <div className="mt-1 space-y-0.5">
                      {formatBulletPoints(edu.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projectEntries.length > 0 && (
          <div className="mb-4">
            <h3 className={`${styles.title} ${isDark ? 'text-white' : ''}`}>Projects</h3>
            <div className="space-y-3">
              {projectEntries.map((proj, idx) => (
                <div key={idx} className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="font-semibold text-base">{proj.name}</div>
                  <div className="text-xs text-gray-400">{proj.year}</div>
                  {proj.technologies && (
                    <div className="text-xs text-gray-500">Tech: {proj.technologies}</div>
                  )}
                  {proj.description && (
                    <div className="mt-1 space-y-0.5">
                      {formatBulletPoints(proj.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certificationEntries.length > 0 && (
          <div className="mb-4">
            <h3 className={`${styles.title} ${isDark ? 'text-white' : ''}`}>Certifications</h3>
            <div className="space-y-2">
              {certificationEntries.map((cert, idx) => (
                <div key={idx} className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="font-semibold text-sm">{cert.name}</div>
                  <div className="text-xs text-gray-500">{cert.issuer} {cert.year && `(${cert.year})`}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languageEntries.length > 0 && (
          <div>
            <h3 className={`${styles.title} ${isDark ? 'text-white' : ''}`}>Languages</h3>
            <div className="flex flex-wrap gap-3">
              {languageEntries.map((lang, idx) => (
                <span key={idx} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {lang.language} — <span className="text-xs text-gray-400">{lang.proficiency}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// ✅ MAIN RESUME BUILDER - COMPLETE FIX
// ============================================
const ResumeBuilder = () => {
  // ✅ State for user ID and premium - Initialize from localStorage
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem('userId');
    return stored && stored !== 'anonymous' && stored !== 'null' ? stored : 'anonymous';
  });
  const [userEmail, setUserEmail] = useState('');
  
  // ✅ Form Data with ALL sections as arrays
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    is_premium: false
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('form');
  const [generatedResume, setGeneratedResume] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const printRef = useRef(null);

  const siteUrl = window.location.origin;

  // ✅ GET USER ID - FIXED
  const getUserId = useCallback(() => {
    try {
      // First check localStorage (most reliable)
      const storedId = localStorage.getItem('userId');
      if (storedId && storedId !== 'anonymous' && storedId !== 'null' && storedId !== 'undefined') {
        console.log('✅ Found userId in localStorage:', storedId);
        return storedId;
      }
      
      // Then check secureStorage
      const user = secureStorage.get('user');
      if (user?.id && user.id !== 'anonymous') {
        localStorage.setItem('userId', user.id);
        return user.id;
      }
      
      // Then check email mapping
      const email = localStorage.getItem('userEmail') || formData.email;
      if (email) {
        const savedId = localStorage.getItem(`userId_${email}`);
        if (savedId && savedId !== 'anonymous') {
          localStorage.setItem('userId', savedId);
          return savedId;
        }
      }
      
      return 'anonymous';
    } catch (error) {
      console.error('Error getting userId:', error);
      return 'anonymous';
    }
  }, [formData.email]);

  // ✅ CREATE OR GET USER - FIXED
  const createOrGetUser = useCallback(async () => {
    try {
      const email = formData.email || localStorage.getItem('userEmail');
      const name = formData.name || 'User';
      
      if (!email) {
        console.log('⚠️ No email to create user with');
        return 'anonymous';
      }
      
      console.log('📝 Creating/getting user with email:', email);
      
      const response = await api.createUser({
        email: email,
        name: name
      });
      
      if (response.data && response.data.user_id) {
        const userId = response.data.user_id;
        localStorage.setItem('userId', userId);
        localStorage.setItem(`userId_${email}`, userId);
        localStorage.setItem('userEmail', email);
        setUserId(userId);
        console.log('✅ User created/found with ID:', userId);
        return userId;
      }
      return 'anonymous';
    } catch (error) {
      console.error('❌ Error creating user:', error);
      const fallbackId = `user_${Date.now()}`;
      localStorage.setItem('userId', fallbackId);
      return fallbackId;
    }
  }, [formData.email, formData.name]);

  // ✅ CHECK PREMIUM STATUS - FIXED
  const checkPremiumStatus = useCallback(async () => {
    try {
      // First check localStorage cache
      const cachedPremium = localStorage.getItem('isPremium');
      if (cachedPremium === 'true') {
        console.log('✅ Premium status from cache: TRUE');
        setIsPremium(true);
      }
      
      let id = getUserId();
      
      // If no user ID or 'anonymous', try to create/get user
      if (!id || id === 'anonymous') {
        console.log('⚠️ No valid user ID, creating user...');
        const newId = await createOrGetUser();
        if (newId && newId !== 'anonymous') {
          id = newId;
          setUserId(id);
        }
      }
      
      console.log('🔍 Checking premium status for user:', id);
      
      const response = await api.checkPremium(id);
      
      if (response?.data) {
        const isPremiumUser = response.data.is_premium === true;
        setIsPremium(isPremiumUser);
        localStorage.setItem('isPremium', isPremiumUser ? 'true' : 'false');
        console.log('✅ Premium status from server:', isPremiumUser);
        
        // Update user ID if different
        if (response.data.user_id && response.data.user_id !== id && response.data.user_id !== 'anonymous') {
          localStorage.setItem('userId', response.data.user_id);
          setUserId(response.data.user_id);
        }
        
        if (isPremiumUser) {
          setFormData(prev => ({ ...prev, is_premium: true }));
        }
        return isPremiumUser;
      }
      
      setIsPremium(false);
      localStorage.setItem('isPremium', 'false');
      return false;
    } catch (error) {
      console.error('❌ Premium check failed:', error);
      const cached = localStorage.getItem('isPremium');
      if (cached === 'true') {
        console.log('✅ Using cached premium status');
        setIsPremium(true);
        return true;
      }
      setIsPremium(false);
      return false;
    }
  }, [getUserId, createOrGetUser]);

  // ✅ Initial premium check
  useEffect(() => {
    if (formData.email) {
      checkPremiumStatus();
    } else {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        setFormData(prev => ({ ...prev, email: storedEmail }));
      }
    }
  }, [checkPremiumStatus, formData.email]);

  // ✅ HANDLE PAYMENT SUCCESS - FIXED
  const handlePaymentSuccess = useCallback(async () => {
    toast.success('🎉 Payment successful!');
    setShowPaymentModal(false);
    
    // Wait for backend to update
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Refresh premium status
    const result = await checkPremiumStatus();
    if (result) {
      toast.success('🎉 Premium activated! All 12 tools unlocked for ₹99/month.');
      // Refresh usage info
      const id = getUserId();
      try {
        const response = await api.checkPremium(id);
        if (response?.data) {
          setUsageInfo({
            used: 0,
            remaining: 'Unlimited',
            isPremium: true
          });
          setIsPremium(true);
          setFormData(prev => ({ ...prev, is_premium: true }));
        }
      } catch (e) {
        console.error('Failed to refresh usage:', e);
      }
    }
  }, [checkPremiumStatus, getUserId]);

  // Handle skills input (comma separated)
  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setSkillsInput(value);
    const skills = value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, skills }));
  };

  // Set entries for dynamic sections
  const setExperience = (entries) => setFormData(prev => ({ ...prev, experience: entries }));
  const setEducation = (entries) => setFormData(prev => ({ ...prev, education: entries }));
  const setProjects = (entries) => setFormData(prev => ({ ...prev, projects: entries }));
  const setCertifications = (entries) => setFormData(prev => ({ ...prev, certifications: entries }));
  const setLanguages = (entries) => setFormData(prev => ({ ...prev, languages: entries }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Load template example with dynamic entries
  const loadTemplateExample = (templateId) => {
    const template = TEMPLATES[templateId];
    if (!template || !template.example) {
      toast.error('No example available for this template');
      return;
    }

    const example = template.example;

    setFormData(prev => ({
      ...prev,
      name: example.name || '',
      title: example.title || '',
      email: example.email || '',
      phone: example.phone || '',
      location: example.location || '',
      summary: example.summary || '',
      skills: example.skills || [],
      experience: example.experience || [],
      education: example.education || [],
      projects: example.projects || [],
      certifications: example.certifications || [],
      languages: example.languages || [],
      is_premium: prev.is_premium
    }));

    setSkillsInput((example.skills || []).join(', '));
    toast.success(`📄 Loaded ${template.name} template example with ${example.experience?.length || 0} experiences, ${example.education?.length || 0} educations, and ${example.projects?.length || 0} projects`);
    setTemplateDropdownOpen(false);
  };

  // Download functions
  const handleDownloadPDF = async () => {
    if (!generatedResume) {
      toast.error('Please generate a resume first');
      return;
    }
    
    try {
      const toastId = toast.loading('Generating PDF...');
      
      const previewElement = printRef.current;
      if (!previewElement) {
        toast.dismiss(toastId);
        toast.error('Preview not found');
        return;
      }
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = previewElement.innerHTML;
      tempDiv.style.padding = '20px';
      tempDiv.style.background = 'white';
      tempDiv.style.width = '800px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(tempDiv);
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      document.body.removeChild(tempDiv);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.name || 'resume'}-resume.pdf`);
      
      toast.dismiss(toastId);
      toast.success('✅ PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadWord = () => {
    if (!generatedResume) {
      toast.error('Please generate a resume first');
      return;
    }
    
    try {
      const toastId = toast.loading('Generating Word document...');
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: formData.name || 'Resume',
                  size: 32,
                  bold: true,
                  font: 'Arial'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: formData.title || '',
                  size: 24,
                  font: 'Arial'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: [formData.email, formData.phone, formData.location].filter(Boolean).join(' | '),
                  size: 20,
                  font: 'Arial',
                  color: '666666'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            ...(formData.summary ? [
              new Paragraph({
                children: [
                  new TextRun({ text: 'PROFESSIONAL SUMMARY', size: 24, bold: true, font: 'Arial' })
                ],
                spacing: { before: 200, after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: formData.summary, size: 20, font: 'Arial' })
                ],
                spacing: { after: 200 }
              })
            ] : []),
            ...(formData.skills.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({ text: 'SKILLS', size: 24, bold: true, font: 'Arial' })
                ],
                spacing: { before: 200, after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: formData.skills.join(', '), size: 20, font: 'Arial' })
                ],
                spacing: { after: 200 }
              })
            ] : []),
            ...(formData.experience.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({ text: 'EXPERIENCE', size: 24, bold: true, font: 'Arial' })
                ],
                spacing: { before: 200, after: 100 }
              }),
              ...formData.experience.flatMap(exp => [
                new Paragraph({
                  children: [
                    new TextRun({ text: exp.title || '', size: 20, bold: true, font: 'Arial' })
                  ],
                  spacing: { after: 50 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: `${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || 'Present'})`, size: 18, font: 'Arial', color: '666666' })
                  ],
                  spacing: { after: 100 }
                }),
                ...(exp.description ? exp.description.split('\n').filter(line => line.trim()).map(line => 
                  new Paragraph({
                    children: [
                      new TextRun({ text: `• ${line.trim()}`, size: 18, font: 'Arial' })
                    ],
                    spacing: { after: 50 }
                  })
                ) : [])
              ])
            ] : []),
            ...(formData.education.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({ text: 'EDUCATION', size: 24, bold: true, font: 'Arial' })
                ],
                spacing: { before: 200, after: 100 }
              }),
              ...formData.education.map(edu => 
                new Paragraph({
                  children: [
                    new TextRun({ text: `${edu.degree || ''} - ${edu.institution || ''} (${edu.startYear || ''} - ${edu.endYear || 'Present'})`, size: 20, font: 'Arial' })
                  ],
                  spacing: { after: 100 }
                })
              )
            ] : []),
            ...(formData.projects.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({ text: 'PROJECTS', size: 24, bold: true, font: 'Arial' })
                ],
                spacing: { before: 200, after: 100 }
              }),
              ...formData.projects.map(proj =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `${proj.name || ''} (${proj.year || ''})`, size: 20, font: 'Arial' })
                  ],
                  spacing: { after: 100 }
                })
              )
            ] : [])
          ]
        }]
      });

      Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${formData.name || 'resume'}-resume.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.dismiss(toastId);
        toast.success('✅ Word document downloaded successfully!');
      });
    } catch (error) {
      console.error('Word generation error:', error);
      toast.error('Failed to generate Word document');
    }
  };

  const handleDownloadExcel = () => {
    if (!generatedResume) {
      toast.error('Please generate a resume first');
      return;
    }
    
    try {
      const rows = [
        ['Resume Details'],
        ['Field', 'Content'],
        ['Name', formData.name || ''],
        ['Title', formData.title || ''],
        ['Email', formData.email || ''],
        ['Phone', formData.phone || ''],
        ['Location', formData.location || ''],
        ['Summary', formData.summary || ''],
        ['Skills', formData.skills.join(', ') || ''],
        ['Experience', formData.experience.map(e => `${e.title} at ${e.company} (${e.startDate}-${e.endDate})`).join('; ')],
        ['Education', formData.education.map(e => `${e.degree} from ${e.institution}`).join('; ')],
        ['Projects', formData.projects.map(p => `${p.name} (${p.year})`).join('; ')],
        ['Certifications', formData.certifications.map(c => `${c.name} (${c.issuer})`).join('; ')],
        ['Languages', formData.languages.map(l => `${l.language}: ${l.proficiency}`).join('; ')],
        ['Template Used', currentTemplate.name || ''],
        ['ATS Score', currentTemplate.atsScore || ''],
        ['Generated On', new Date().toLocaleString()]
      ];
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [{ wch: 20 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Resume');
      XLSX.writeFile(wb, `${formData.name || 'resume'}-resume.xlsx`);
      
      toast.success('✅ Excel downloaded successfully!');
    } catch (error) {
      console.error('Excel generation error:', error);
      toast.error('Failed to generate Excel file');
    }
  };

  // ✅ HANDLE SUBMIT WITH USER ID
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (formData.skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }

    const template = TEMPLATES[selectedTemplate];
    if (template && template.premium && !isPremium) {
      toast.error('This is a premium template. Please upgrade to unlock!');
      setShowPaymentModal(true);
      return;
    }

    setLoading(true);
    
    try {
      // Ensure we have a user ID
      let currentUserId = userId;
      if (!currentUserId || currentUserId === 'anonymous') {
        const newId = await createOrGetUser();
        if (newId && newId !== 'anonymous') {
          currentUserId = newId;
          setUserId(newId);
        } else {
          // Use a fallback
          currentUserId = `user_${Date.now()}`;
          localStorage.setItem('userId', currentUserId);
          setUserId(currentUserId);
        }
      }
      
      const payload = {
        ...formData,
        template: selectedTemplate,
        is_premium: isPremium || formData.is_premium,
        user_id: currentUserId
      };
      
      const response = await api.buildResume(payload);
      
      if (response.data.success) {
        setGeneratedResume(response.data.resume);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium || isPremium
        });
        
        if (response.data.is_premium) {
          setIsPremium(true);
          toast.success('🎉 Resume generated with premium features!');
        } else {
          toast.success('✅ Resume generated successfully!');
        }
        setActiveTab('preview');
      }
    } catch (error) {
      if (error.response?.data?.limit_reached) {
        toast.error('Free limit reached! Upgrade to premium for unlimited access.');
        setUsageInfo({
          used: error.response.data.usage_count,
          remaining: 0,
          isPremium: false,
          maxFree: error.response.data.max_free
        });
        setShowPaymentModal(true);
      } else {
        toast.error(error.response?.data?.error || 'Failed to generate resume');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedResume) return;
    const blob = new Blob([generatedResume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name || 'resume'}-resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Resume downloaded!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const currentTemplate = TEMPLATES[selectedTemplate] || TEMPLATES.modern;

  // Get templates by type
  const freeTemplates = Object.entries(TEMPLATES).filter(([_, t]) => !t.premium);
  const premiumTemplates = Object.entries(TEMPLATES).filter(([_, t]) => t.premium);

  return (
    <>
      {/* Helmet, SEO, Schema */}
      <Helmet>
        <title>Free ATS Resume Builder - 30+ Templates | Krynova Technologies</title>
        <meta name="description" content="Create professional, ATS-friendly resumes with our free resume builder. Choose from 30+ premium templates, get real-time ATS scoring (99.97%+), and download as PDF, Word, or Excel. No sign-up required." />
        <meta name="keywords" content="free resume builder, ATS resume builder, professional resume maker, online resume creator, resume templates, best resume builder India, free resume maker, ATS friendly resume, resume generator, Krynova resume builder, create resume online, resume with ATS score, premium resume templates, job search resume, free resume maker online" />
        <link rel="canonical" href={`${siteUrl}/tools/resume-builder`} />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta name="serviceArea" content={`India, ${globalCountries.join(", ")}, Worldwide`} />
        <meta property="og:title" content="Free ATS Resume Builder - 30+ Templates | Krynova Technologies" />
        <meta property="og:description" content="Create professional, ATS-friendly resumes with our free resume builder. 30+ premium templates, real-time ATS scoring (99.97%+). No sign-up required." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free ATS Resume Builder - 30+ Templates" />
        <meta name="twitter:description" content="Create professional, ATS-friendly resumes with our free resume builder. No sign-up required." />
      </Helmet>

      {/* Speakable Content */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Free ATS Resume Builder - Krynova Technologies</h2>
        <p>Create professional, ATS-friendly resumes with our free resume builder. Choose from 30+ premium templates, get real-time ATS scoring (99.97%+), and download as PDF, Word, or Excel.</p>
        <p>Available for users in Agra, Delhi, Mumbai, Bangalore, and all Indian cities, as well as globally in USA, UK, Canada, Australia, and more.</p>
        <ul>
          <li>30+ professional templates (Free + Premium)</li>
          <li>Real-time ATS scoring (99.97%+)</li>
          <li>PDF, Word, and Excel export</li>
          <li>Keyword suggestions</li>
          <li>No sign-up required for free tier</li>
          <li>Multiple entries for Experience, Education, Projects, Certifications, Languages</li>
        </ul>
        <p>Best free resume builder for professionals and job seekers worldwide.</p>
      </div>

      {/* Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "ATS Resume Builder",
          "description": "Free online resume builder with 30+ premium templates, real-time ATS scoring (99.97%+), and PDF/Word/Excel export.",
          "url": `${siteUrl}/tools/resume-builder`,
          "applicationCategory": "Productivity",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "description": "Free tier with 3 resumes/day. Premium upgrade for unlimited access."
          },
          "provider": {
            "@type": "Organization",
            "name": "Krynova Technologies",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Agra",
              "addressRegion": "Uttar Pradesh",
              "addressCountry": "India"
            }
          },
          "areaServed": indianCities,
          "availableLanguage": ["English", "Hindi", "Bengali", "Telugu", "Tamil", "Urdu", "Gujarati", "Marathi", "Kannada", "Malayalam", "Punjabi"],
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ".speakable"
          }
        })}
      </script>

      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is the resume builder free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Our resume builder offers a free tier with 3 resumes per day. Premium upgrade available for unlimited access to all 30+ templates."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to sign up to use the resume builder?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No sign-up is required! You can create and download your resume instantly without creating an account."
              }
            },
            {
              "@type": "Question",
              "name": "Are the resumes ATS-friendly?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Our resume builder creates ATS-friendly resumes that pass through applicant tracking systems with a 99.97%+ score."
              }
            },
            {
              "@type": "Question",
              "name": "What formats can I download my resume in?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can download your resume in PDF, Word (DOCX), and Excel (XLSX) formats."
              }
            },
            {
              "@type": "Question",
              "name": "Can I add multiple experiences, education, and projects?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Our advanced resume builder supports multiple entries for Experience, Education, Projects, Certifications, and Languages with add, edit, delete, duplicate, and reorder functionality."
              }
            }
          ]
        })}
      </script>

      {/* ========================================== */}
      {/* MAIN CONTENT */}
      {/* ========================================== */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaFileAlt className="text-blue-500" />
              Professional Resume Builder
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create Your <span className="gradient-text">Perfect Resume</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Build an ATS-optimized resume with 30+ templates, real-time scoring, AI-powered suggestions, and support for multiple entries
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="text-yellow-400" /> Free: 3/day • 12 Templates
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCrown className="text-yellow-500" /> Premium: Unlimited • 30+ Templates
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <FaSearch className="text-purple-500" /> ATS Score 99.97%+
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm">
                <FaPlus className="text-amber-500" /> Multiple Entries
              </span>
            </div>
          </div>

          {/* Premium Status Badge */}
          {isPremium && (
            <div className="mb-6 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg text-center">
              <FaCrown className="text-yellow-500 inline mr-2" />
              <span className="font-semibold text-yellow-700">🎉 Premium Active!</span>
              <span className="text-sm text-gray-600 ml-2">Unlimited access to all 12 tools for ₹99/month.</span>
            </div>
          )}

          {/* Usage Info */}
          {usageInfo && (
            <div className={`mb-6 p-4 rounded-lg flex flex-wrap items-center justify-between ${
              usageInfo.isPremium ? 'bg-green-50 border border-green-200' :
              usageInfo.remaining > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className="text-sm flex items-center gap-2">
                {usageInfo.isPremium ? (
                  <><FaCrown className="text-yellow-500" /> <span className="font-semibold">Premium:</span> Unlimited access • 30+ Templates</>
                ) : (
                  <><FaClock className="text-blue-500" /> {usageInfo.used} used today • {usageInfo.remaining} free remaining • 12 Free Templates</>
                )}
              </p>
              {!usageInfo.isPremium && (
                <button onClick={handleUpgrade} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2">
                  <FaCrown /> Upgrade Now — ₹99/month
                </button>
              )}
            </div>
          )}

          {/* Template Dropdown with 30+ Templates */}
          <div className="mb-6 relative">
            <div className="flex items-center gap-4">
              <button onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)} className="flex-1 bg-white px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${currentTemplate.preview} flex items-center justify-center text-white`}>
                    <currentTemplate.icon className="text-lg" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{currentTemplate.name}</p>
                    <p className="text-xs text-gray-500">{currentTemplate.description}</p>
                  </div>
                  {currentTemplate.premium && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Premium</span>
                  )}
                  {currentTemplate.atsScore && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">ATS {currentTemplate.atsScore}%</span>
                  )}
                </div>
                <FaChevronDown className={`text-gray-400 transition ${templateDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => loadTemplateExample(selectedTemplate)} className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
                <FaMagic /> Load Example
              </button>
            </div>

            {templateDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                {/* Free Templates */}
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-500">FREE TEMPLATES (12)</span>
                </div>
                {freeTemplates.map(([key, template]) => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate === key;
                  return (
                    <button
                      key={key}
                      onClick={() => { setSelectedTemplate(key); setTemplateDropdownOpen(false); }}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-0 ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${template.preview} flex items-center justify-center text-white flex-shrink-0`}>
                        <Icon className="text-lg" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-semibold text-sm ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                          {template.name}
                        </p>
                        <p className="text-xs text-gray-500">{template.description}</p>
                      </div>
                      {isSelected && <FaCheckCircle className="text-blue-600" />}
                    </button>
                  );
                })}
                
                {/* Premium Templates */}
                <div className="px-3 py-2 bg-yellow-50 border-b border-yellow-200">
                  <span className="text-xs font-semibold text-yellow-700">⭐ PREMIUM TEMPLATES (18+)</span>
                  {!isPremium && (
                    <span className="text-xs text-yellow-500 ml-2">🔒 Locked - Upgrade to unlock</span>
                  )}
                </div>
                {premiumTemplates.map(([key, template]) => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate === key;
                  return (
                    <button
                      key={key}
                      onClick={() => { 
                        if (!isPremium) {
                          toast.error('🔒 Premium template. Please upgrade to unlock!');
                          setShowPaymentModal(true);
                          return;
                        }
                        setSelectedTemplate(key); 
                        setTemplateDropdownOpen(false); 
                      }}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-0 ${
                        isSelected ? 'bg-blue-50' : ''
                      } ${!isPremium ? 'opacity-75' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${template.preview} flex items-center justify-center text-white flex-shrink-0`}>
                        <Icon className="text-lg" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-semibold text-sm ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                          {template.name}
                          <span className="ml-1 text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">Premium</span>
                        </p>
                        <p className="text-xs text-gray-500">{template.description}</p>
                      </div>
                      {isSelected && <FaCheckCircle className="text-blue-600" />}
                      {!isPremium && <FaLock className="text-yellow-500 text-sm" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form Section - Advanced with dynamic entries */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaUser className="text-blue-600" /> Your Details
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Advanced</span>
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('form')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'form' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <FaFileAlt className="inline mr-1" /> Form
                  </button>
                  <button onClick={() => setActiveTab('preview')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'preview' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <FaEye className="inline mr-1" /> Preview
                  </button>
                </div>
              </div>

              {activeTab === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* ATS Score Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                    <ATSScore data={formData} />
                  </div>

                  {/* Section 1: Personal Information */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaUser className="text-blue-500" /> Personal Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                        <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Professional Title *</label>
                        <input type="text" name="title" placeholder="e.g., Full Stack Developer" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                        <input type="text" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" name="location" placeholder="Agra, India" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Professional Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaBriefcase className="text-blue-500" /> Professional Summary
                    </h4>
                    <textarea name="summary" rows="3" placeholder="Experienced professional with 5+ years..." value={formData.summary} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y" />
                    <p className="text-xs text-gray-400 mt-1">{formData.summary?.length || 0} characters (Recommended: 100-300)</p>
                  </div>

                  {/* Section 3: Skills */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FaTools className="text-blue-500" /> Skills *
                        <span className="text-xs text-gray-400">({formData.skills.length})</span>
                      </h4>
                      <button type="button" onClick={() => setShowKeywords(!showKeywords)} className="text-xs text-blue-600 hover:text-blue-800 transition flex items-center gap-1">
                        <FaSearch /> {showKeywords ? 'Hide Keywords' : 'Show ATS Keywords'}
                      </button>
                    </div>
                    <input 
                      type="text" 
                      placeholder="React, Python, SQL, AWS, Docker (comma separated)" 
                      value={skillsInput} 
                      onChange={handleSkillsChange} 
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      required 
                    />
                    {showKeywords && (
                      <div className="mt-3">
                        <KeywordSuggestions onAdd={(keywords) => {
                          const newSkills = [...formData.skills, ...keywords.split(',').map(s => s.trim()).filter(Boolean)];
                          setFormData(prev => ({ ...prev, skills: newSkills }));
                          setSkillsInput(newSkills.join(', '));
                        }} />
                      </div>
                    )}
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formData.skills.map((skill, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                            {skill}
                            <button 
                              type="button" 
                              onClick={() => {
                                const newSkills = formData.skills.filter((_, i) => i !== idx);
                                setFormData(prev => ({ ...prev, skills: newSkills }));
                                setSkillsInput(newSkills.join(', '));
                              }}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formData.skills.length} skills (Recommended: 8-12)</p>
                  </div>

                  {/* Section 4: Experience - Dynamic */}
                  <DynamicEntrySection
                    title="Experience"
                    icon={FaBriefcase}
                    entries={formData.experience}
                    setEntries={setExperience}
                    fields={['title', 'company', 'startDate', 'endDate', 'description']}
                    fieldLabels={{
                      title: 'Job Title',
                      company: 'Company',
                      startDate: 'Start Date',
                      endDate: 'End Date',
                      description: 'Description (bullet points)'
                    }}
                    addButtonText="Add Experience"
                    maxEntries={10}
                  />

                  {/* Section 5: Education - Dynamic */}
                  <DynamicEntrySection
                    title="Education"
                    icon={FaGraduationCap}
                    entries={formData.education}
                    setEntries={setEducation}
                    fields={['degree', 'institution', 'startYear', 'endYear', 'gpa', 'description']}
                    fieldLabels={{
                      degree: 'Degree',
                      institution: 'Institution',
                      startYear: 'Start Year',
                      endYear: 'End Year',
                      gpa: 'GPA',
                      description: 'Description'
                    }}
                    addButtonText="Add Education"
                    maxEntries={10}
                  />

                  {/* Section 6: Projects - Dynamic */}
                  <DynamicEntrySection
                    title="Projects"
                    icon={FaProjectDiagram}
                    entries={formData.projects}
                    setEntries={setProjects}
                    fields={['name', 'year', 'technologies', 'description']}
                    fieldLabels={{
                      name: 'Project Name',
                      year: 'Year',
                      technologies: 'Technologies',
                      description: 'Description (bullet points)'
                    }}
                    addButtonText="Add Project"
                    maxEntries={10}
                  />

                  {/* Section 7: Certifications - Dynamic */}
                  <DynamicEntrySection
                    title="Certifications"
                    icon={FaCertificate}
                    entries={formData.certifications}
                    setEntries={setCertifications}
                    fields={['name', 'issuer', 'year']}
                    fieldLabels={{
                      name: 'Certification Name',
                      issuer: 'Issuing Organization',
                      year: 'Year'
                    }}
                    addButtonText="Add Certification"
                    maxEntries={10}
                  />

                  {/* Section 8: Languages - Dynamic */}
                  <DynamicEntrySection
                    title="Languages"
                    icon={FaLanguage}
                    entries={formData.languages}
                    setEntries={setLanguages}
                    fields={['language', 'proficiency']}
                    fieldLabels={{
                      language: 'Language',
                      proficiency: 'Proficiency'
                    }}
                    addButtonText="Add Language"
                    maxEntries={10}
                  />

                  {/* Premium Toggle */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                    <input type="checkbox" name="is_premium" checked={formData.is_premium} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <label className="text-sm text-gray-700 flex items-center gap-1">
                      <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited + All 30+ Templates)
                    </label>
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <FaSpinner className="animate-spin" /> : <FaRocket />}
                    {loading ? 'Generating...' : 'Generate Resume'}
                  </button>
                </form>
              ) : (
                <div className="max-h-[600px] overflow-y-auto">
                  <ResumePreview data={formData} template={currentTemplate} />
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <ATSScore data={formData} />
                  </div>
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaEye className="text-blue-600" /> Live Preview
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center gap-1">
                    <FaPalette className="text-xs" /> {currentTemplate.name}
                  </span>
                  {currentTemplate.atsScore && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      ATS {currentTemplate.atsScore}%
                    </span>
                  )}
                  {currentTemplate.premium && (
                    <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                      ⭐ Premium
                    </span>
                  )}
                </div>
              </div>
              
              <div ref={printRef} className="max-h-[600px] overflow-y-auto custom-scrollbar">
                <ResumePreview data={formData} template={currentTemplate} />
              </div>

              {generatedResume && (
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
                  <button onClick={handleDownloadPDF} className="flex-1 bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg">
                    <FaFilePdf /> PDF
                  </button>
                  <button onClick={handleDownloadWord} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg">
                    <FaRegFileWord /> Word
                  </button>
                  <button onClick={handleDownloadExcel} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg">
                    <FaRegFileExcel /> Excel
                  </button>
                  <button onClick={handleDownload} className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg">
                    <FaDownload /> Text
                  </button>
                  <button onClick={handlePrint} className="flex-1 bg-gray-600 text-white py-2.5 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 text-sm font-semibold">
                    <FaPrint /> Print
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">🚀 Unlock All 30+ Premium Templates</h3>
              <p className="text-blue-100 mb-4">Get unlimited resume generation, access to all 30+ templates, ATS scoring, and priority support.</p>
              <button onClick={handleUpgrade} className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5">
                Upgrade Now — ₹99/month
              </button>
              <p className="text-blue-200 text-xs mt-3">Available in {indianCities.length}+ Indian cities and {globalCountries.length}+ countries worldwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        userEmail={formData.email || userEmail} 
        userId={userId}
        onSuccess={handlePaymentSuccess}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        @media print {
          .no-print { display: none !important; }
          .print-preview { background: white !important; box-shadow: none !important; }
        }
      `}} />
    </>
  );
};

export default ResumeBuilder;