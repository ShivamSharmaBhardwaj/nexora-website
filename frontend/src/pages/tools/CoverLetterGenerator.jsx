// src/pages/tools/CoverLetterGenerator.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFileAlt, 
  FaCheckCircle, FaCircle, FaTimes, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaPenFancy,
  FaUser, FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaBuilding, FaGlobe, FaArrowRight, FaCopy, FaPrint,
  FaEye, FaEyeSlash, FaMagic, FaPalette, FaSearch,
  FaLightbulb, FaChartLine, FaClipboardCheck, FaInfoCircle,
  FaChevronDown, FaChevronUp, FaClock, FaRegFileExcel,
  FaFilePdf, FaTrophy, FaMedal, FaExclamationTriangle,
  FaCheckDouble, FaBullseye, FaRocket as FaRocketIcon,
  FaRegFileWord, FaMapPin, FaMicrophone, FaComments
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import PaymentModal from '../../components/PaymentModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

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
// TEMPLATES CONFIGURATION
// ============================================
const TEMPLATES = {
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, formal design for corporate roles',
    preview: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    styles: 'formal'
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with a fresh look',
    preview: 'bg-gradient-to-r from-purple-500 to-pink-500',
    styles: 'modern'
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for creative industries',
    preview: 'bg-gradient-to-r from-orange-500 to-red-500',
    styles: 'creative'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, simple, and elegant',
    preview: 'bg-gradient-to-r from-gray-600 to-gray-800',
    styles: 'minimal'
  }
};

// ============================================
// COVER LETTER ATS KEYWORDS
// ============================================
const COVER_LETTER_KEYWORDS = {
  'opening': ['I am writing to express', 'I am excited to apply', 'I am applying for', 'I am interested in', 'With great enthusiasm', 'I would like to apply'],
  'skills': ['expertise', 'proven track record', 'experience in', 'skilled in', 'proficient in', 'strong background', 'deep understanding', 'extensive experience', 'technical proficiency', 'strategic thinking'],
  'achievements': ['successfully delivered', 'exceeded expectations', 'improved efficiency', 'increased revenue', 'reduced costs', 'led teams', 'mentored junior', 'implemented solutions', 'drove growth', 'optimized processes'],
  'closing': ['Thank you for your consideration', 'I look forward to', 'I would welcome the opportunity', 'I am eager to contribute', 'I appreciate your time', 'I am confident in my ability']
};

// ============================================
// ATS SCORE COMPONENT FOR COVER LETTER
// ============================================
const CoverLetterATSScore = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false);

  const calculateATSScore = () => {
    const details = {
      keywords: { score: 0, max: 35, suggestions: [] },
      structure: { score: 0, max: 25, suggestions: [] },
      personalization: { score: 0, max: 20, suggestions: [] },
      length: { score: 0, max: 10, suggestions: [] },
      skills: { score: 0, max: 10, suggestions: [] }
    };

    const text = `${data.name || ''} ${data.position || ''} ${data.company || ''} ${data.skills || ''} ${data.experience || ''}`.toLowerCase();
    
    const allKeywords = Object.values(COVER_LETTER_KEYWORDS).flat();
    const foundKeywords = allKeywords.filter(kw => text.includes(kw.toLowerCase()));
    const keywordCount = foundKeywords.length;
    details.keywords.score = Math.min(35, (keywordCount / 8) * 35);
    if (keywordCount < 5) {
      details.keywords.suggestions.push('Use more professional phrases like "I am writing to express"');
      details.keywords.suggestions.push('Include action verbs like "successfully delivered", "led teams"');
      details.keywords.suggestions.push('Add closing phrases like "Thank you for your consideration"');
    }

    const hasIntroduction = data.experience?.length > 50 || data.position?.length > 0;
    const hasBody = data.experience?.length > 100;
    const hasClosing = data.experience?.toLowerCase().includes('thank you') || data.experience?.toLowerCase().includes('sincerely');
    
    details.structure.score += hasIntroduction ? 10 : 0;
    details.structure.score += hasBody ? 10 : 0;
    details.structure.score += hasClosing ? 5 : 0;
    
    if (!hasIntroduction) details.structure.suggestions.push('Add a strong introduction paragraph');
    if (!hasBody) details.structure.suggestions.push('Add more details to the body paragraph');
    if (!hasClosing) details.structure.suggestions.push('Add a professional closing statement');

    const hasCompany = data.company?.length > 0;
    const hasPosition = data.position?.length > 0;
    const hasName = data.name?.length > 0;
    
    details.personalization.score += hasCompany ? 8 : 0;
    details.personalization.score += hasPosition ? 7 : 0;
    details.personalization.score += hasName ? 5 : 0;
    
    if (!hasCompany) details.personalization.suggestions.push('Add the company name for personalization');
    if (!hasPosition) details.personalization.suggestions.push('Add the position you are applying for');

    const totalLength = data.experience?.length || 0;
    if (totalLength > 200 && totalLength < 800) {
      details.length.score = 10;
    } else if (totalLength > 100) {
      details.length.score = 5;
    } else {
      details.length.score = 0;
      details.length.suggestions.push('Cover letter is too short. Add more details (200-800 characters)');
    }

    const skillsArray = typeof data.skills === 'string' ? data.skills.split(',').filter(s => s.trim()) : [];
    details.skills.score = Math.min(10, skillsArray.length * 2);
    if (skillsArray.length < 3) {
      details.skills.suggestions.push('Add more relevant skills to the cover letter');
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
          <FaClipboardCheck className="text-purple-500" /> ATS Compatibility Score
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
              <span className="font-medium">{Math.round(result.details.keywords.score)}/35</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Structure</span>
              <span className="font-medium">{Math.round(result.details.structure.score)}/25</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Personalization</span>
              <span className="font-medium">{Math.round(result.details.personalization.score)}/20</span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setShowDetails(!showDetails)} className="mt-2 text-xs text-purple-600 hover:text-purple-800 transition flex items-center gap-1">
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
              <FaCheckCircle className="inline mr-1" /> Great job! Your cover letter is well-optimized.
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
  const [selectedCategory, setSelectedCategory] = useState('opening');
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const categories = [
    { id: 'opening', label: 'Opening Lines', icon: FaPenFancy },
    { id: 'skills', label: 'Skills', icon: FaBriefcase },
    { id: 'achievements', label: 'Achievements', icon: FaChartLine },
    { id: 'closing', label: 'Closing Phrases', icon: FaCheckDouble }
  ];

  const toggleKeyword = (keyword) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword) ? prev.filter(k => k !== keyword) : [...prev, keyword]
    );
  };

  const addSelected = () => {
    if (selectedKeywords.length === 0) {
      toast.error('Please select at least one keyword');
      return;
    }
    onAdd(selectedKeywords.join(' '));
    setSelectedKeywords([]);
    toast.success(`Added ${selectedKeywords.length} phrases to experience`);
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <FaSearch className="text-purple-500" /> Cover Letter Keywords
      </h4>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="text-xs" /> {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
        {COVER_LETTER_KEYWORDS[selectedCategory]?.map((keyword, index) => (
          <button
            key={`${selectedCategory}-${keyword}-${index}`}
            onClick={() => toggleKeyword(keyword)}
            className={`px-2 py-1 rounded text-xs transition ${
              selectedKeywords.includes(keyword)
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {keyword}
          </button>
        ))}
      </div>

      <button onClick={addSelected} className="mt-3 w-full px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition">
        Add Selected Phrases ({selectedKeywords.length})
      </button>
    </div>
  );
};

// ============================================
// COVER LETTER PREVIEW
// ============================================
const CoverLetterPreview = ({ data, template }) => {
  const templates = {
    professional: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200',
      header: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6',
      body: 'p-6',
      signature: 'mt-4 pt-4 border-t border-gray-200 text-gray-700',
      fontFamily: 'font-serif'
    },
    modern: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-purple-200',
      header: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6',
      body: 'p-6',
      signature: 'mt-4 pt-4 border-t border-purple-200 text-gray-700',
      fontFamily: 'font-sans'
    },
    creative: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-orange-200',
      header: 'bg-gradient-to-r from-orange-500 to-red-500 text-white p-6',
      body: 'p-6',
      signature: 'mt-4 pt-4 border-t border-orange-200 text-gray-700',
      fontFamily: 'font-mono'
    },
    minimal: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200',
      header: 'bg-gray-800 text-white p-6',
      body: 'p-6',
      signature: 'mt-4 pt-4 border-t border-gray-200 text-gray-700',
      fontFamily: 'font-sans'
    }
  };

  const styles = templates[template.id] || templates.professional;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className="text-2xl font-bold">{data.name || 'Your Name'}</h2>
        <div className="flex flex-wrap gap-3 mt-2 text-sm opacity-80">
          {data.email && <span className="flex items-center gap-1"><FaEnvelope className="text-xs" /> {data.email}</span>}
          {data.phone && <span className="flex items-center gap-1"><FaPhone className="text-xs" /> {data.phone}</span>}
          {data.location && <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-xs" /> {data.location}</span>}
        </div>
      </div>

      <div className={styles.body}>
        <p className="text-gray-500 text-sm mb-4">
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {data.company && (
          <div className="mb-4">
            <p className="font-semibold text-gray-900">Hiring Manager</p>
            <p className="text-gray-700">{data.company}</p>
          </div>
        )}

        <p className="text-gray-700 mb-3">Dear Hiring Manager,</p>

        <div className="space-y-3 text-gray-700">
          <p>
            I am writing to express my strong interest in the <strong>{data.position || '[Position]'}</strong> position at 
            {data.company ? <strong> {data.company}</strong> : ' your organization'}. 
            With my expertise in <strong>{data.skills || 'various technologies'}</strong>, 
            I am confident I can make significant contributions to your team.
          </p>
          
          <p>
            {data.experience || 'Throughout my career, I have developed strong skills and a passion for delivering high-quality work.'}
          </p>
          
          <p>
            I am particularly drawn to this opportunity because of your reputation for excellence and innovation. 
            I would welcome the opportunity to discuss how my experience aligns with the needs of your organization.
          </p>
        </div>

        <div className={styles.signature}>
          <p className="text-gray-700">Thank you for considering my application.</p>
          <p className="text-gray-700 mt-2">Sincerely,</p>
          <p className="font-semibold text-gray-900 mt-1">{data.name || 'Your Name'}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COVER LETTER GENERATOR
// ============================================
const CoverLetterGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    position: '',
    company: '',
    skills: '',
    experience: '',
    is_premium: false
  });
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('form');
  const [isPremium, setIsPremium] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleKeywordAdd = (keywords) => {
    const currentExperience = formData.experience || '';
    const newExperience = currentExperience ? `${currentExperience} ${keywords}` : keywords;
    setFormData(prev => ({ ...prev, experience: newExperience }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.position.trim()) {
      toast.error('Please enter the position');
      return;
    }
    if (!formData.company.trim()) {
      toast.error('Please enter the company name');
      return;
    }
    if (!formData.skills.trim()) {
      toast.error('Please enter your skills');
      return;
    }

    setLoading(true);
    
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        ...formData,
        skills: skillsArray,
        template: selectedTemplate,
        is_premium: isPremium || formData.is_premium
      };
      
      const response = await api.generateCoverLetter(payload);
      
      if (response.data.success) {
        setResult(response.data.cover_letter);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium || isPremium
        });
        
        if (response.data.is_premium) {
          setIsPremium(true);
          toast.success('🎉 Cover letter generated with premium features!');
        } else {
          toast.success('✅ Cover letter generated successfully!');
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
        toast.error(error.response?.data?.error || 'Failed to generate cover letter');
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // DOWNLOAD FUNCTIONS
  // ============================================
  const handleDownloadPDF = async () => {
    if (!result) {
      toast.error('Please generate a cover letter first');
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
      pdf.save(`${formData.name || 'cover-letter'}-cover-letter.pdf`);
      
      toast.dismiss(toastId);
      toast.success('✅ PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const handleDownloadWord = () => {
    if (!result) {
      toast.error('Please generate a cover letter first');
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
                  text: 'COVER LETTER',
                  size: 32,
                  bold: true,
                  font: 'Arial'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: formData.name || 'Your Name',
                  size: 24,
                  bold: true,
                  font: 'Arial'
                })
              ],
              spacing: { after: 100 }
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
              spacing: { after: 400 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                  size: 20,
                  font: 'Arial'
                })
              ],
              spacing: { after: 200 }
            }),
            ...(formData.company ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Hiring Manager',
                    size: 20,
                    bold: true,
                    font: 'Arial'
                  })
                ],
                spacing: { after: 50 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: formData.company,
                    size: 20,
                    font: 'Arial'
                  })
                ],
                spacing: { after: 200 }
              })
            ] : []),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Dear Hiring Manager,',
                  size: 20,
                  font: 'Arial'
                })
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `I am writing to express my strong interest in the ${formData.position || '[Position]'} position at ${formData.company || 'your organization'}. With my expertise in ${formData.skills || 'various technologies'}, I am confident I can make significant contributions to your team.`,
                  size: 20,
                  font: 'Arial'
                })
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: formData.experience || 'Throughout my career, I have developed strong skills and a passion for delivering high-quality work.',
                  size: 20,
                  font: 'Arial'
                })
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'I am particularly drawn to this opportunity because of your reputation for excellence and innovation. I would welcome the opportunity to discuss how my experience aligns with the needs of your organization.',
                  size: 20,
                  font: 'Arial'
                })
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Thank you for considering my application.',
                  size: 20,
                  font: 'Arial'
                })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Sincerely,',
                  size: 20,
                  font: 'Arial'
                })
              ],
              spacing: { after: 50 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: formData.name || 'Your Name',
                  size: 20,
                  bold: true,
                  font: 'Arial'
                })
              ],
              spacing: { after: 100 }
            })
          ]
        }]
      });

      Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${formData.name || 'cover-letter'}-cover-letter.docx`;
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
    if (!result) {
      toast.error('Please generate a cover letter first');
      return;
    }
    
    try {
      const data = [
        ['Cover Letter Details'],
        ['Field', 'Content'],
        ['Name', formData.name || ''],
        ['Position', formData.position || ''],
        ['Company', formData.company || ''],
        ['Email', formData.email || ''],
        ['Phone', formData.phone || ''],
        ['Location', formData.location || ''],
        ['Skills', formData.skills || ''],
        ['Experience', formData.experience || ''],
        ['Template Used', TEMPLATES[selectedTemplate]?.name || 'Professional'],
        ['Generated On', new Date().toLocaleString()]
      ];
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      ws['!cols'] = [{ wch: 20 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, ws, 'Cover Letter');
      XLSX.writeFile(wb, `${formData.name || 'cover-letter'}-cover-letter.xlsx`);
      
      toast.success('✅ Excel downloaded successfully!');
    } catch (error) {
      console.error('Excel generation error:', error);
      toast.error('Failed to generate Excel file');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name || 'cover-letter'}-cover-letter.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Cover letter downloaded!');
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success('Cover letter copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const currentTemplate = TEMPLATES[selectedTemplate] || TEMPLATES.professional;

  const skillsArray = useMemo(() => {
    return formData.skills.split(',').map(s => s.trim()).filter(Boolean);
  }, [formData.skills]);

  // Quick fill examples
  const examples = [
    { 
      label: 'Tech Professional', 
      data: {
        position: 'Full Stack Developer',
        company: 'Tech Innovations Inc.',
        skills: 'React, Node.js, Python, AWS, Docker',
        experience: 'With 5+ years of full-stack development experience, I have successfully delivered 10+ enterprise applications. I specialize in building scalable web solutions using modern technologies like React, Node.js, and cloud platforms. I have led teams of 5+ developers and mentored junior engineers.'
      }
    },
    { 
      label: 'Marketing Professional', 
      data: {
        position: 'Digital Marketing Manager',
        company: 'Brand Solutions Agency',
        skills: 'SEO, Social Media Marketing, Content Strategy, Analytics, PPC',
        experience: 'I have 4+ years of experience in digital marketing, managing campaigns for 20+ clients across various industries. I have increased organic traffic by 150% and improved conversion rates by 40%. I am passionate about data-driven marketing strategies.'
      }
    },
    { 
      label: 'Data Analyst', 
      data: {
        position: 'Senior Data Analyst',
        company: 'Data Insights Corporation',
        skills: 'Python, SQL, Tableau, Excel, Machine Learning',
        experience: 'I have 3+ years of experience in data analysis and business intelligence. I have helped companies make data-driven decisions by creating interactive dashboards and predictive models. I have improved reporting efficiency by 60% through automation.'
      }
    }
  ];

  const fillExample = (example) => {
    setFormData(prev => ({
      ...prev,
      position: example.position || prev.position,
      company: example.company || prev.company,
      skills: example.skills || prev.skills,
      experience: example.experience || prev.experience
    }));
  };

  return (
    <>
      {/* ========================================== */}
      {/* ✅ HELMET - SEO + AEO + GEO */}
      {/* ========================================== */}
      <Helmet>
        <title>Free Cover Letter Generator - Professional Cover Letter Maker | Krynova Technologies</title>
        <meta name="description" content="Create professional cover letters with our free cover letter generator. Get real-time ATS scoring, multiple templates, and download as PDF, Word, or Excel. No sign-up required. Best free cover letter maker in India and globally." />
        <meta name="keywords" content="free cover letter generator, cover letter maker, professional cover letter, ATS friendly cover letter, cover letter templates, best cover letter builder, cover letter India, Krynova cover letter, job application letter, cover letter online" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        <link rel="canonical" href={`${siteUrl}/tools/cover-letter`} />
        
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
        
        <meta name="question" content="What is the best free cover letter generator in India?" />
        <meta name="answer" content="Krynova Technologies offers the best free cover letter generator in India with real-time ATS scoring, multiple templates, and PDF/Word/Excel export. No sign-up required." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="free cover letter generator, cover letter maker, professional cover letter, ATS cover letter, best cover letter builder" />
        
        <meta name="rich-snippet" content="tool" />
        <meta name="structured-data" content="true" />
        <meta name="application-category" content="Cover Letter Generator" />
        <meta name="application-rating" content="4.8" />
        
        <meta property="og:title" content="Free Cover Letter Generator - Professional Cover Letter Maker | Krynova Technologies" />
        <meta property="og:description" content="Create professional cover letters with our free cover letter generator. Real-time ATS scoring, multiple templates. No sign-up required." />
        <meta property="og:url" content={`${siteUrl}/tools/cover-letter`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Cover Letter Generator - Professional Cover Letter Maker" />
        <meta name="twitter:description" content="Create professional cover letters with our free cover letter generator. No sign-up required." />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ========================================== */}
      {/* ✅ AEO SPEAKABLE CONTENT */}
      {/* ========================================== */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Free Cover Letter Generator - Krynova Technologies</h2>
        <p>Create professional cover letters with our free cover letter generator. Get real-time ATS scoring, multiple templates, and download as PDF, Word, or Excel.</p>
        <p>Available for users in Agra, Delhi, Mumbai, Bangalore, and all Indian cities, as well as globally in USA, UK, Canada, Australia, and more.</p>
        <ul>
          <li>4 professional templates</li>
          <li>Real-time ATS scoring</li>
          <li>PDF, Word, and Excel export</li>
          <li>Keyword suggestions</li>
          <li>No sign-up required for free tier</li>
        </ul>
        <p>Best free cover letter maker for job seekers worldwide.</p>
      </div>

      {/* ========================================== */}
      {/* ✅ SCHEMA.ORG - WebApplication */}
      {/* ========================================== */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Cover Letter Generator",
          "description": "Free online cover letter generator with 4 professional templates, real-time ATS scoring, and PDF/Word/Excel export.",
          "url": `${siteUrl}/tools/cover-letter`,
          "applicationCategory": "Productivity",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "description": "Free tier with 3 cover letters/day. Premium upgrade for unlimited access."
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "120"
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
              "name": "Is the cover letter generator free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Our cover letter generator offers a free tier with 3 cover letters per day. Premium upgrade available for unlimited access."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to sign up to use the cover letter generator?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No sign-up is required! You can create and download your cover letter instantly without creating an account."
              }
            },
            {
              "@type": "Question",
              "name": "What formats can I download my cover letter in?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can download your cover letter in PDF, Word (DOCX), and Excel (XLSX) formats."
              }
            },
            {
              "@type": "Question",
              "name": "How many templates are available?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our cover letter generator offers 4 professional templates: Professional, Modern, Creative, and Minimal."
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
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaPenFancy className="text-purple-500" />
              Professional Cover Letter Generator
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Cover Letter <span className="gradient-text">Generator</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create professional cover letters that stand out with ATS optimization and real-time scoring
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
                <button onClick={handleUpgrade} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2">
                  <FaCrown /> Upgrade Now
                </button>
              )}
            </div>
          )}

          {/* Template Dropdown */}
          <div className="mb-6 relative">
            <div className="flex items-center gap-4">
              <button onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)} className="flex-1 bg-white px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${currentTemplate.preview} flex items-center justify-center text-white`}>
                    <FaPenFancy className="text-lg" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{currentTemplate.name}</p>
                    <p className="text-xs text-gray-500">{currentTemplate.description}</p>
                  </div>
                </div>
                <FaChevronDown className={`text-gray-400 transition ${templateDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {templateDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                {Object.entries(TEMPLATES).map(([key, template]) => {
                  const isSelected = selectedTemplate === key;
                  return (
                    <button
                      key={key}
                      onClick={() => { setSelectedTemplate(key); setTemplateDropdownOpen(false); }}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-0 ${
                        isSelected ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${template.preview} flex items-center justify-center text-white flex-shrink-0`}>
                        <FaPenFancy className="text-lg" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-semibold text-sm ${isSelected ? 'text-purple-600' : 'text-gray-700'}`}>
                          {template.name}
                        </p>
                        <p className="text-xs text-gray-500">{template.description}</p>
                      </div>
                      {isSelected && <FaCheckCircle className="text-purple-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Examples */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
              <FaMagic className="text-purple-500" /> Quick Examples:
            </p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => fillExample(example.data)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 rounded-lg text-xs transition border border-gray-200 hover:border-purple-300"
                >
                  <FaRocketIcon className="inline mr-1 text-purple-500" />
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaUser className="text-purple-600" /> Your Details
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('form')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'form' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <FaFileAlt className="inline mr-1" /> Form
                  </button>
                  <button onClick={() => setActiveTab('preview')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'preview' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <FaEye className="inline mr-1" /> Preview
                  </button>
                </div>
              </div>

              {activeTab === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* ATS Score Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
                    <CoverLetterATSScore data={formData} />
                  </div>

                  {/* Personal Information */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaUser className="text-purple-500" /> Personal Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                        <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                        <input type="text" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" name="location" placeholder="Agra, India" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* Job Information */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaBriefcase className="text-purple-500" /> Job Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Position *</label>
                        <input type="text" name="position" placeholder="Full Stack Developer" value={formData.position} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Company *</label>
                        <input type="text" name="company" placeholder="Tech Innovations Inc." value={formData.company} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                      </div>
                    </div>
                  </div>

                  {/* Skills & Experience */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FaPenFancy className="text-purple-500" /> Skills & Experience
                      </h4>
                      <button type="button" onClick={() => setShowKeywords(!showKeywords)} className="text-xs text-purple-600 hover:text-purple-800 transition flex items-center gap-1">
                        <FaSearch /> {showKeywords ? 'Hide Keywords' : 'Show Keywords'}
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Skills (comma separated) *</label>
                      <input type="text" name="skills" placeholder="React, Python, Project Management" value={formData.skills} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
                      {skillsArray.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {skillsArray.map((skill, idx) => (
                            <span key={idx} className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-xs">{skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Experience / Body Text *</label>
                      <textarea name="experience" rows="4" placeholder="5+ years of experience in full-stack development, leading teams of 10+ engineers..." value={formData.experience} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y" required />
                      <p className="text-xs text-gray-400 mt-1">{formData.experience?.length || 0} characters (Recommended: 200-800)</p>
                    </div>
                    {showKeywords && (
                      <div className="mt-3">
                        <KeywordSuggestions onAdd={handleKeywordAdd} />
                      </div>
                    )}
                  </div>

                  {/* Premium Toggle */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                    <input type="checkbox" name="is_premium" checked={formData.is_premium} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                    <label className="text-sm text-gray-700 flex items-center gap-1">
                      <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited + All Templates)
                    </label>
                  </div>

                  <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <FaSpinner className="animate-spin" /> : <FaRocketIcon />}
                    {loading ? 'Generating...' : 'Generate Cover Letter'}
                  </button>
                </form>
              ) : (
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                  <CoverLetterPreview data={formData} template={currentTemplate} />
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <CoverLetterATSScore data={formData} />
                  </div>
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaEye className="text-purple-600" /> Live Preview
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full flex items-center gap-1">
                    <FaPalette className="text-xs" /> {currentTemplate.name}
                  </span>
                </div>
              </div>
              
              <div ref={printRef} className="max-h-[600px] overflow-y-auto custom-scrollbar">
                <CoverLetterPreview data={formData} template={currentTemplate} />
              </div>

              {result && (
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
                  <button onClick={handleCopy} className="flex-1 bg-gray-500 text-white py-2.5 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2 text-sm font-semibold">
                    <FaCopy /> Copy
                  </button>
                  <button onClick={handlePrint} className="flex-1 bg-gray-600 text-white py-2.5 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 text-sm font-semibold">
                    <FaPrint /> Print
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">🚀 Unlock Premium Features</h3>
              <p className="text-purple-100 mb-4">Get unlimited cover letter generation, access to all templates, ATS scoring, and priority support.</p>
              <button onClick={handleUpgrade} className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5">
                Upgrade Now — ₹499/month
              </button>
              <p className="text-purple-200 text-xs mt-3">Available in {indianCities.length}+ Indian cities and {globalCountries.length}+ countries worldwide</p>
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

export default CoverLetterGenerator;