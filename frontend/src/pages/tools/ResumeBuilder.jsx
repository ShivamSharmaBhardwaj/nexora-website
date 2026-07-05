// src/pages/tools/ResumeBuilder.jsx
import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  FaMapPin, FaGlobe, FaMicrophone, FaComments, FaMoon
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import PaymentModal from '../../components/PaymentModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

// ============================================
// ✅ SAFE ARRAY HELPERS - Fix for .map() errors
// ============================================

const safeMap = (data, callback) => {
  if (!data) return null;
  const arr = Array.isArray(data) ? data : [];
  return arr.map(callback);
};

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
// ✅ TEMPLATES CONFIGURATION (ATS Score 99.97+)
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
    example: {
      name: 'Sarah Johnson',
      title: 'Senior Full Stack Developer',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      summary: 'Innovative Senior Full Stack Developer with 7+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud architecture. Passionate about creating elegant solutions that solve complex business problems. Led teams of 10+ developers and delivered 20+ successful projects.',
      skills: 'React, Node.js, Python, AWS, Docker, Kubernetes, GraphQL, TypeScript, MongoDB, PostgreSQL, Redis, CI/CD, Microservices',
      experience: 'Senior Full Stack Developer | TechCorp Inc. (2020-Present)\n• Architected microservices handling 50M+ daily requests\n• Led team of 12 developers across 3 continents\n• Reduced deployment time by 70% using CI/CD pipelines\n• Implemented real-time features serving 2M+ users\n\nFull Stack Developer | Digital Solutions (2017-2020)\n• Built 15+ web applications for diverse clients\n• Integrated third-party APIs and payment systems\n• Improved application performance by 40%\n• Mentored junior developers and conducted code reviews',
      education: 'M.S. Computer Science | Stanford University (2015-2017)\nGPA: 3.9/4.0, Research in Distributed Systems\n\nB.S. Computer Engineering | MIT (2011-2015)\nCum Laude, Dean\'s List all semesters'
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
    premium: true,
    example: {
      name: 'Michael Anderson',
      title: 'Chief Technology Officer',
      email: 'michael.anderson@email.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      summary: 'Visionary CTO with 15+ years of experience driving technological innovation and digital transformation. Proven track record of scaling tech teams, implementing enterprise solutions, and aligning technology with business strategy. Led digital transformation for Fortune 500 companies, resulting in 200% revenue growth.',
      skills: 'Strategic Planning, Cloud Architecture, AI/ML, Digital Transformation, Team Leadership, Product Development, Enterprise Software, Cybersecurity, Data Analytics, Innovation Management',
      experience: 'Chief Technology Officer | GlobalTech Inc. (2018-Present)\n• Led technology strategy for $2B+ portfolio\n• Built and scaled team from 50 to 500+ engineers\n• Implemented AI solutions increasing efficiency by 45%\n• Reduced operational costs by $10M annually\n\nVP of Engineering | InnovateCorp (2012-2018)\n• Managed 200+ engineering resources\n• Launched 10+ successful products\n• Established engineering best practices\n• Built high-performance culture',
      education: 'MBA | Harvard Business School (2010-2012)\n\nM.S. Computer Science | Carnegie Mellon (2008-2010)'
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
    example: {
      name: 'Emily Chen',
      title: 'UX/UI Designer',
      email: 'emily.chen@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      summary: 'Human-centered UX/UI Designer with 6+ years of experience creating intuitive digital experiences. Passionate about accessibility and inclusive design. Portfolio includes 30+ products used by millions.',
      skills: 'Figma, Adobe XD, Sketch, Prototyping, User Research, UI Design, Design Systems, Accessibility, User Testing, HTML/CSS',
      experience: 'Senior UX Designer | DesignStudio (2019-Present)\n• Designed 20+ successful products\n• Led design thinking workshops\n• Established design system for 10+ products\n• Increased user satisfaction by 35%\n\nUX Designer | Creative Agency (2016-2019)\n• Conducted 200+ user interviews\n• Created 50+ prototypes\n• Designed mobile and web experiences',
      education: 'BFA Interaction Design | Savannah College (2012-2016)'
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
    premium: true,
    example: {
      name: 'Alex Rivera',
      title: 'Creative Director & Brand Strategist',
      email: 'alex.rivera@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Los Angeles, CA',
      summary: 'Award-winning Creative Director with 10+ years of experience building iconic brands. Expert in visual storytelling, brand strategy, and creative leadership. Featured in Communication Arts, GDUSA, and The Dieline.',
      skills: 'Brand Strategy, Creative Direction, Visual Identity, Art Direction, Packaging Design, Typography, Illustration, Motion Design, Photography, Copywriting',
      experience: 'Creative Director | BrandCraft Studio (2015-Present)\n• Built brands for 100+ clients\n• Generated $50M+ in brand value\n• Won 20+ industry awards\n• Led creative team of 25\n\nSenior Designer | Design Agency (2010-2015)\n• Developed 100+ brand identities\n• Designed packaging for global brands\n• Created award-winning campaigns',
      education: 'MFA Graphic Design | Art Center College (2008-2010)\n\nBFA Visual Communication | CalArts (2004-2008)'
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
    premium: true,
    example: {
      name: 'Dr. James Wilson',
      title: 'Chief Financial Officer',
      email: 'james.wilson@email.com',
      phone: '+1 (555) 567-8901',
      location: 'Chicago, IL',
      summary: 'Seasoned CFO with 20+ years of financial leadership experience across multiple industries. Expertise in M&A, strategic planning, and corporate finance. Successfully led IPO and raised $500M+ in capital.',
      skills: 'Strategic Planning, M&A, Corporate Finance, Financial Modeling, Risk Management, Investor Relations, Budgeting, Audit, Compliance, Treasury Management',
      experience: 'Chief Financial Officer | Fortune 500 Corp (2015-Present)\n• Managed $5B+ annual budget\n• Led successful IPO valuation of $2B\n• Increased profitability by 35%\n• Optimized capital structure saving $100M+\n\nSVP Finance | Investment Bank (2008-2015)\n• Advised on 50+ M&A deals\n• Raised $500M+ in capital\n• Managed $10B+ investment portfolio',
      education: 'MBA Finance | University of Chicago (2006-2008)\n\nB.S. Accounting | University of Illinois (2002-2006)\nCPA, CFA'
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
    premium: true,
    example: {
      name: 'David Kim',
      title: 'Machine Learning Engineer',
      email: 'david.kim@email.com',
      phone: '+1 (555) 678-9012',
      location: 'Seattle, WA',
      summary: 'Machine Learning Engineer with 5+ years of experience building and deploying AI/ML solutions. Expertise in deep learning, NLP, and computer vision. Published 15+ research papers and contributed to open-source ML frameworks.',
      skills: 'Python, TensorFlow, PyTorch, Keras, Scikit-learn, NumPy, Pandas, SQL, AWS SageMaker, Docker, Kubernetes, Git, Linux, Jupyter',
      experience: 'Senior ML Engineer | AI Tech Labs (2020-Present)\n• Built NLP models serving 10M+ users\n• Deployed 20+ ML models to production\n• Improved model accuracy by 30%\n• Led ML team of 8 engineers\n\nData Scientist | Tech Solutions (2018-2020)\n• Developed predictive models\n• Built data pipelines for 100TB+ data\n• Created ML infrastructure from scratch',
      education: 'Ph.D. Computer Science (AI/ML) | MIT (2015-2018)\nThesis: "Neural Networks for Time Series Analysis"\n\nM.S. Data Science | UC Berkeley (2013-2015)'
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
    premium: true,
    example: {
      name: 'Dr. Sarah Williams',
      title: 'Chief Executive Officer',
      email: 'sarah.williams@email.com',
      phone: '+1 (555) 111-2222',
      location: 'London, UK',
      summary: 'Transformational CEO with 25+ years of global leadership experience across technology, finance, and healthcare. Proven track record of scaling companies from startup to IPO. Expert in corporate strategy, M&A, and organizational transformation.',
      skills: 'Corporate Strategy, M&A, IPO, Board Management, Global Leadership, Digital Transformation, Strategic Planning, Organizational Development, Change Management, Stakeholder Engagement',
      experience: 'CEO | Global Enterprise Solutions (2015-Present)\n• Grew revenue from $50M to $500M in 5 years\n• Led successful IPO valued at $3B\n• Expanded operations to 30+ countries\n• Acquired and integrated 10+ companies\n\nSVP Strategy | Fortune 500 (2008-2015)\n• Developed global expansion strategy\n• Led digital transformation initiatives\n• Managed $2B annual budget',
      education: 'DBA | Harvard Business School (2005-2008)\n\nMBA | London Business School (2000-2002)'
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
    premium: true,
    example: {
      name: 'Lisa Park',
      title: 'Product Manager',
      email: 'lisa.park@email.com',
      phone: '+1 (555) 333-4444',
      location: 'Seattle, WA',
      summary: 'Strategic Product Manager with 8+ years of experience in B2B SaaS products. Expertise in product strategy, user research, and go-to-market execution. Launched 15+ products with $200M+ in revenue.',
      skills: 'Product Strategy, User Research, Product Roadmap, Agile, Scrum, Market Analysis, Competitor Analysis, Product Analytics, Go-to-Market, User Stories',
      experience: 'Senior Product Manager | TechSaaS Inc. (2019-Present)\n• Launched 5 products generating $50M+ revenue\n• Led cross-functional teams of 40+ people\n• Increased user retention by 45%\n• Established product-led growth strategy\n\nProduct Manager | GrowthCorp (2016-2019)\n• Launched 10+ products\n• Conducted 500+ user interviews\n• Improved NPS from 35 to 65',
      education: 'MBA Product Management | Stanford (2014-2016)\n\nB.A. Economics | UC Berkeley (2010-2014)'
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
    premium: true,
    example: {
      name: 'Marcus Johnson',
      title: 'DevOps Engineer',
      email: 'marcus.johnson@email.com',
      phone: '+1 (555) 555-6666',
      location: 'Austin, TX',
      summary: 'Senior DevOps Engineer with 10+ years of experience in cloud infrastructure, CI/CD, and automation. Expertise in AWS, Azure, and GCP. Built and maintained infrastructure serving 100M+ users.',
      skills: 'AWS, Azure, GCP, Kubernetes, Docker, Terraform, Jenkins, GitLab CI, Python, Bash, Linux, Nginx, Apache, Redis, PostgreSQL, MongoDB',
      experience: 'Senior DevOps Engineer | CloudTech Inc. (2018-Present)\n• Managed AWS infrastructure for 100M+ users\n• Reduced deployment time by 80%\n• Implemented Kubernetes clusters across 3 regions\n• Achieved 99.99% uptime\n\nDevOps Engineer | TechStart (2014-2018)\n• Built CI/CD pipeline from scratch\n• Automated infrastructure provisioning\n• Reduced costs by 40% through optimization',
      education: 'M.S. Computer Science | MIT (2012-2014)\n\nB.S. Computer Science | UT Austin (2008-2012)'
    }
  }
};

// ============================================
// ATS KEYWORDS & SUGGESTIONS
// ============================================
const ATS_KEYWORDS = {
  tech: ['Agile', 'Scrum', 'Cloud', 'AWS', 'Azure', 'DevOps', 'Microservices', 'API', 'REST', 'GraphQL', 'Docker', 'Kubernetes', 'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Redis', 'Git', 'Linux', 'Nginx', 'TDD', 'BDD', 'Kanban', 'JIRA', 'Confluence', 'CI/CD', 'Jenkins', 'Terraform'],
  design: ['UI Design', 'UX Design', 'Wireframing', 'Prototyping', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign', 'Design Systems', 'User Research', 'User Testing', 'Interaction Design', 'Visual Design', 'Brand Identity', 'Typography', 'Color Theory', 'Accessibility', 'WCAG', 'Responsive Design', 'Motion Design'],
  business: ['Strategic Planning', 'Business Development', 'Project Management', 'Agile', 'Scrum', 'Kanban', 'PMP', 'Six Sigma', 'Lean', 'Budgeting', 'Forecasting', 'Financial Analysis', 'Risk Management', 'Stakeholder Management', 'Team Leadership', 'Mentoring', 'Coaching', 'KPI', 'OKR', 'ROI', 'M&A', 'IPO'],
  marketing: ['Digital Marketing', 'SEO', 'SEM', 'Content Marketing', 'Social Media', 'Email Marketing', 'Analytics', 'Google Analytics', 'Google Ads', 'Facebook Ads', 'Brand Strategy', 'Market Research', 'CRM', 'HubSpot', 'Salesforce', 'Copywriting', 'Marketing Automation', 'PPC', 'SMM', 'CRO', 'Inbound Marketing']
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

    const allText = `${data.summary || ''} ${data.skills || ''} ${data.experience || ''}`.toLowerCase();
    const allKeywords = [...new Set(Object.values(ATS_KEYWORDS).flat())];
    const foundKeywords = allKeywords.filter(kw => allText.includes(kw.toLowerCase()));
    const keywordCount = foundKeywords.length;
    details.keywords.score = Math.min(30, (keywordCount / 15) * 30);
    if (keywordCount < 10) {
      details.keywords.suggestions = [
        'Add more industry-specific keywords',
        'Include common job title variations',
        'Use both full forms and acronyms'
      ];
    }

    const hasBullets = (data.experience || '').includes('•') || (data.experience || '').includes('-');
    const hasNumbers = /\d+/.test(data.experience || '');
    const hasActionWords = /(led|managed|developed|created|designed|implemented|built|achieved|improved|reduced|increased)/i.test(data.experience || '');
    
    details.formatting.score += hasBullets ? 10 : 0;
    details.formatting.score += hasNumbers ? 5 : 0;
    details.formatting.score += hasActionWords ? 5 : 0;
    
    if (!hasBullets) details.formatting.suggestions.push('Use bullet points for readability');
    if (!hasNumbers) details.formatting.suggestions.push('Include numbers and metrics');
    if (!hasActionWords) details.formatting.suggestions.push('Use action verbs to start bullet points');

    const hasSummary = (data.summary || '').length > 50;
    const hasExperience = (data.experience || '').length > 100;
    const hasEducation = (data.education || '').length > 20;
    
    details.content.score += hasSummary ? 10 : 0;
    details.content.score += hasExperience ? 10 : 0;
    details.content.score += hasEducation ? 5 : 0;
    
    if (!hasSummary) details.content.suggestions.push('Add a professional summary');
    if (!hasExperience) details.content.suggestions.push('Add work experience details');
    if (!hasEducation) details.content.suggestions.push('Add education information');

    const totalLength = (data.summary || '').length + (data.experience || '').length;
    if (totalLength > 500 && totalLength < 1500) {
      details.length.score = 15;
    } else if (totalLength > 300) {
      details.length.score = 10;
    } else {
      details.length.score = 5;
      details.length.suggestions.push('Resume is too short. Add more details.');
    }

    const skillsArray = typeof data.skills === 'string' ? data.skills.split(',').filter(s => s.trim()) : safeArray(data.skills);
    details.skills.score = Math.min(10, safeArray(skillsArray).length * 1.5);
    if (safeArray(skillsArray).length < 5) {
      details.skills.suggestions.push('Add more skills (minimum 5-8 recommended)');
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
        <div className="mt-3 space-y-2 text-xs">
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
// RESUME PREVIEW COMPONENT
// ============================================
const ResumePreview = ({ data, template }) => {
  const templateStyles = {
    modern: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100',
      header: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-gray-800 mb-2',
    },
    elegant: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-purple-200',
      header: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-purple-600 mb-2',
    },
    minimal: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200',
      header: 'bg-gray-800 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-gray-800 mb-2',
    },
    creative: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-orange-200',
      header: 'bg-gradient-to-r from-orange-500 to-red-500 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-orange-600 mb-2',
    },
    professional: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-blue-200',
      header: 'bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-blue-900 mb-2',
    },
    tech: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-cyan-200',
      header: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-cyan-600 mb-2',
    },
    executive: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-amber-200',
      header: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-amber-600 mb-2',
    },
    clean: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-slate-200',
      header: 'bg-gradient-to-r from-slate-600 to-gray-700 text-white p-6',
      section: 'border-b border-gray-100 last:border-0 p-4',
      title: 'text-lg font-bold text-slate-700 mb-2',
    },
    modernDark: {
      container: 'bg-gray-900 shadow-xl rounded-lg overflow-hidden border-2 border-gray-700 text-white',
      header: 'bg-gradient-to-r from-gray-800 to-black text-white p-6',
      section: 'border-b border-gray-700 last:border-0 p-4',
      title: 'text-lg font-bold text-white mb-2',
    }
  };

  const styles = templateStyles[template.id] || templateStyles.modern;
  const isDark = template.id === 'modernDark';

  const skillsArray = useMemo(() => {
    if (typeof data.skills === 'string') {
      return data.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (Array.isArray(data.skills)) {
      return data.skills.map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [data.skills]);

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
        {data.summary && (
          <div className="mb-3">
            <h3 className={`${styles.title} ${isDark ? 'text-white' : ''}`}>Professional Summary</h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{data.summary}</p>
          </div>
        )}

        {safeArray(skillsArray).length > 0 && (
          <div className="mb-3">
            <h3 className={`${styles.title} ${isDark ? 'text-white' : ''}`}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {safeArray(skillsArray).map((skill, idx) => (
                <span key={idx} className={`${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} px-3 py-1 rounded-full text-xs font-medium`}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.experience && (
          <div className="mb-3">
            <h3 className={`${styles.title} ${isDark ? 'text-white' : ''}`}>Experience</h3>
            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{data.experience}</div>
          </div>
        )}

        {data.education && (
          <div>
            <h3 className={`${styles.title} ${isDark ? 'text-white' : ''}`}>Education</h3>
            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{data.education}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN RESUME BUILDER
// ============================================
const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
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
  const printRef = useRef(null);

  const siteUrl = window.location.origin;

  // Check premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        let response;
        if (api.checkPremiumStatus) {
          response = await api.checkPremiumStatus();
        } else if (api.checkPremium) {
          response = await api.checkPremium();
        } else {
          return;
        }
        
        if (response.data && response.data.is_premium) {
          setIsPremium(true);
          setFormData(prev => ({ ...prev, is_premium: true }));
          toast.success('🎉 Premium activated!');
        }
      } catch (error) {
        console.error('Premium check failed:', error);
      }
    };
    checkPremiumStatus();
  }, []);

  // Load template example
  const loadTemplateExample = (templateId) => {
    const template = TEMPLATES[templateId];
    if (template && template.example) {
      setFormData(prev => ({
        ...prev,
        ...template.example,
        is_premium: prev.is_premium
      }));
      toast.success(`📄 Loaded ${template.name} template example`);
    }
    setTemplateDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleKeywordAdd = (keywords) => {
    const currentSkills = typeof formData.skills === 'string' ? formData.skills : '';
    const newSkills = currentSkills ? `${currentSkills}, ${keywords}` : keywords;
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  // Download as PDF
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

  // Download as Word
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
                  new TextRun({
                    text: 'PROFESSIONAL SUMMARY',
                    size: 24,
                    bold: true,
                    font: 'Arial'
                  })
                ],
                spacing: { before: 200, after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: formData.summary,
                    size: 20,
                    font: 'Arial'
                  })
                ],
                spacing: { after: 200 }
              })
            ] : []),
            ...(formData.skills ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'SKILLS',
                    size: 24,
                    bold: true,
                    font: 'Arial'
                  })
                ],
                spacing: { before: 200, after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: formData.skills,
                    size: 20,
                    font: 'Arial'
                  })
                ],
                spacing: { after: 200 }
              })
            ] : []),
            ...(formData.experience ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'EXPERIENCE',
                    size: 24,
                    bold: true,
                    font: 'Arial'
                  })
                ],
                spacing: { before: 200, after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: formData.experience,
                    size: 20,
                    font: 'Arial'
                  })
                ],
                spacing: { after: 200 }
              })
            ] : []),
            ...(formData.education ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'EDUCATION',
                    size: 24,
                    bold: true,
                    font: 'Arial'
                  })
                ],
                spacing: { before: 200, after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: formData.education,
                    size: 20,
                    font: 'Arial'
                  })
                ],
                spacing: { after: 200 }
              })
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

  // Download as Excel
  const handleDownloadExcel = () => {
    if (!generatedResume) {
      toast.error('Please generate a resume first');
      return;
    }
    
    try {
      const data = [
        ['Resume Details'],
        ['Field', 'Content'],
        ['Name', formData.name || ''],
        ['Title', formData.title || ''],
        ['Email', formData.email || ''],
        ['Phone', formData.phone || ''],
        ['Location', formData.location || ''],
        ['Summary', formData.summary || ''],
        ['Skills', formData.skills || ''],
        ['Experience', formData.experience || ''],
        ['Education', formData.education || ''],
        ['Template Used', currentTemplate.name || ''],
        ['ATS Score', currentTemplate.atsScore || ''],
        ['Generated On', new Date().toLocaleString()]
      ];
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      ws['!cols'] = [{ wch: 20 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Resume');
      XLSX.writeFile(wb, `${formData.name || 'resume'}-resume.xlsx`);
      
      toast.success('✅ Excel downloaded successfully!');
    } catch (error) {
      console.error('Excel generation error:', error);
      toast.error('Failed to generate Excel file');
    }
  };

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
    if (!formData.skills.trim()) {
      toast.error('Please enter your skills');
      return;
    }

    setLoading(true);
    
    try {
      let skillsArray = [];
      if (typeof formData.skills === 'string') {
        skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      } else if (Array.isArray(formData.skills)) {
        skillsArray = formData.skills.map(s => s.trim()).filter(Boolean);
      }
      
      const payload = {
        ...formData,
        skills: skillsArray,
        template: selectedTemplate,
        is_premium: isPremium || formData.is_premium
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

  const skillsArray = useMemo(() => {
    if (typeof formData.skills === 'string') {
      return formData.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (Array.isArray(formData.skills)) {
      return formData.skills.map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [formData.skills]);

  return (
    <>
      {/* ========================================== */}
      {/* ✅ HELMET - SEO + AEO + GEO */}
      {/* ========================================== */}
      <Helmet>
        <title>Free ATS Resume Builder - Create Professional Resumes Online | Krynova Technologies</title>
        <meta name="description" content="Create professional, ATS-friendly resumes with our free resume builder. Choose from 9 premium templates, get real-time ATS scoring (99.97%+), and download as PDF, Word, or Excel. No sign-up required. Best free resume builder in India and globally." />
        <meta name="keywords" content="free resume builder, ATS resume builder, professional resume maker, online resume creator, resume templates, best resume builder India, free resume maker, ATS friendly resume, resume generator, Krynova resume builder, create resume online, resume with ATS score, premium resume templates, job search resume, free resume maker online" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        <link rel="canonical" href={`${siteUrl}/tools/resume-builder`} />
        
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta name="city" content="Agra" />
        <meta name="state" content="Uttar Pradesh" />
        <meta name="country" content="India" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta name="serviceArea" content={`India, ${globalCountries.join(", ")}, Worldwide`} />
        <meta name="targetedCities" content={indianCities.join(", ")} />
        <meta name="targetedCountries" content={globalCountries.join(", ")} />
        <meta name="language" content="en, hi, bn, te, ta, ur, gu, mr, kn, ml, pa" />
        
        <meta name="question" content="What is the best free resume builder in India?" />
        <meta name="answer" content="Krynova Technologies offers the best free ATS resume builder in India with 9 premium templates, real-time ATS scoring (99.97%+), and PDF/Word/Excel export. No sign-up required." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="free resume builder, ATS resume, professional resume, resume maker, best resume builder, resume templates, ATS score resume" />
        
        <meta name="rich-snippet" content="tool" />
        <meta name="structured-data" content="true" />
        <meta name="application-category" content="Resume Builder" />
        <meta name="application-rating" content="4.9" />
        
        <meta property="og:title" content="Free ATS Resume Builder - Create Professional Resumes Online | Krynova Technologies" />
        <meta property="og:description" content="Create professional, ATS-friendly resumes with our free resume builder. 9 premium templates, real-time ATS scoring (99.97%+). No sign-up required." />
        <meta property="og:url" content={`${siteUrl}/tools/resume-builder`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free ATS Resume Builder - Create Professional Resumes Online" />
        <meta name="twitter:description" content="Create professional, ATS-friendly resumes with our free resume builder. No sign-up required." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* ✅ AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Free ATS Resume Builder - Krynova Technologies</h2>
        <p>Create professional, ATS-friendly resumes with our free resume builder. Choose from 9 premium templates, get real-time ATS scoring (99.97%+), and download as PDF, Word, or Excel.</p>
        <p>Available for users in Agra, Delhi, Mumbai, Bangalore, and all Indian cities, as well as globally in USA, UK, Canada, Australia, and more.</p>
        <ul>
          <li>9 professional templates (Modern, Elegant, Minimal, Creative, Professional, Tech, Executive, Clean, Modern Dark)</li>
          <li>Real-time ATS scoring (99.97%+)</li>
          <li>PDF, Word, and Excel export</li>
          <li>Keyword suggestions</li>
          <li>No sign-up required for free tier</li>
        </ul>
        <p>Best free resume builder for professionals and job seekers worldwide.</p>
      </div>

      {/* ========================================== */}
      {/* ✅ SCHEMA.ORG - WebApplication */}
      {/* ========================================== */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "ATS Resume Builder",
          "description": "Free online resume builder with 9 premium templates, real-time ATS scoring (99.97%+), and PDF/Word/Excel export.",
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
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "150"
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

      {/* ========================================== */}
      {/* ✅ FAQ Schema */}
      {/* ========================================== */}
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
                "text": "Yes! Our resume builder offers a free tier with 3 resumes per day. Premium upgrade available for unlimited access to all 9 templates."
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
              "name": "How many templates are available?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our resume builder offers 9 professional templates: Modern, Elegant, Minimal, Creative, Professional, Tech, Executive, Clean, and Modern Dark."
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
              Build an ATS-optimized resume with real-time scoring and AI-powered suggestions
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="text-yellow-400" /> Free: 3/day
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCrown className="text-yellow-500" /> Premium: Unlimited
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <FaSearch className="text-purple-500" /> ATS Score
              </span>
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                <FaMapPin className="text-yellow-500" /> {indianCities.length}+ Cities
              </span>
              <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm">
                <FaGlobe className="text-cyan-500" /> {globalCountries.length}+ Countries
              </span>
            </div>
          </div>

          {/* Usage Info */}
          {usageInfo && (
            <div className={`mb-6 p-4 rounded-lg flex flex-wrap items-center justify-between ${
              usageInfo.isPremium ? 'bg-green-50 border border-green-200' :
              usageInfo.remaining > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <p className="text-sm flex items-center gap-2">
                {usageInfo.isPremium ? (
                  <><FaCrown className="text-yellow-500" /> <span className="font-semibold">Premium:</span> Unlimited access</>
                ) : (
                  <><FaClock className="text-blue-500" /> {usageInfo.used} used today • {usageInfo.remaining} free remaining</>
                )}
              </p>
              {!usageInfo.isPremium && (
                <button onClick={handleUpgrade} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2">
                  <FaCrown /> Upgrade Now — ₹99/month
                </button>
              )}
            </div>
          )}

          {/* Template Dropdown */}
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
                {Object.entries(TEMPLATES).map(([key, template]) => {
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
                          {template.premium && (
                            <span className="ml-1 text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">Premium</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{template.description}</p>
                        {template.atsScore && (
                          <p className="text-xs text-green-600">ATS Score: {template.atsScore}%</p>
                        )}
                      </div>
                      {isSelected && <FaCheckCircle className="text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaUser className="text-blue-600" /> Your Details
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

                  {/* Personal Information */}
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

                  {/* Professional Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaBriefcase className="text-blue-500" /> Professional Summary
                    </h4>
                    <textarea name="summary" rows="3" placeholder="Experienced professional with 5+ years..." value={formData.summary} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y" />
                    <p className="text-xs text-gray-400 mt-1">{formData.summary?.length || 0} characters (Recommended: 100-300)</p>
                  </div>

                  {/* Skills */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FaTools className="text-blue-500" /> Skills *
                      </h4>
                      <button type="button" onClick={() => setShowKeywords(!showKeywords)} className="text-xs text-blue-600 hover:text-blue-800 transition flex items-center gap-1">
                        <FaSearch /> {showKeywords ? 'Hide Keywords' : 'Show ATS Keywords'}
                      </button>
                    </div>
                    <input type="text" name="skills" placeholder="React, Python, SQL, AWS, Docker" value={formData.skills} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                    {showKeywords && (
                      <div className="mt-3">
                        <KeywordSuggestions onAdd={handleKeywordAdd} />
                      </div>
                    )}
                    {safeArray(skillsArray).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {safeArray(skillsArray).map((skill, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">{skill}</span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{safeArray(skillsArray).length} skills (Recommended: 8-12)</p>
                  </div>

                  {/* Experience */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaBriefcase className="text-blue-500" /> Experience
                    </h4>
                    <textarea name="experience" rows="4" placeholder="Company Name (Year-Year)&#10;• Achieved [metric]% increase&#10;• Led team of [number]" value={formData.experience} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono" />
                    <p className="text-xs text-gray-400 mt-1">Use bullet points (•) and include metrics (numbers, percentages)</p>
                  </div>

                  {/* Education */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaGraduationCap className="text-blue-500" /> Education
                    </h4>
                    <textarea name="education" rows="3" placeholder="Degree, University (Year-Year)&#10;• GPA: X.X/4.0" value={formData.education} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y" />
                  </div>

                  {/* Premium Toggle */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                    <input type="checkbox" name="is_premium" checked={formData.is_premium} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <label className="text-sm text-gray-700 flex items-center gap-1">
                      <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited + All 9 Templates)
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
              <h3 className="text-xl font-bold mb-2">🚀 Unlock Premium Features</h3>
              <p className="text-blue-100 mb-4">Get unlimited resume generation, access to all 9 templates, and priority support.</p>
              <button onClick={handleUpgrade} className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5">
                Upgrade Now — ₹99/month
              </button>
              <p className="text-blue-200 text-xs mt-3">Available in {indianCities.length}+ Indian cities and {globalCountries.length}+ countries worldwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} userEmail={formData.email} userId={localStorage.getItem('userId')} />

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