// src/pages/tools/TextToPDF.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFileAlt, 
  FaFilePdf, FaCheckCircle, FaCircle, FaTimes, 
  FaTrash, FaPlus, FaCrown, FaRocket, FaShieldAlt,
  FaMagic, FaArrowRight, FaUpload, FaEdit,
  FaBold, FaItalic, FaUnderline, FaAlignLeft,
  FaAlignCenter, FaAlignRight, FaListUl, FaListOl,
  FaClock, FaHistory, FaChevronDown, FaChevronUp, FaCog,
  FaInfoCircle, FaRegFilePdf, FaSlidersH,
  FaFileWord, FaFileExport, FaPalette,
  FaFont, FaHeading, FaParagraph, FaQuoteRight,
  FaTable, FaImage, FaLink, FaCode, FaTerminal,
  FaFile, FaCopy, FaFolderOpen, FaGlobe, FaMapMarkerAlt,
  FaLanguage, FaHeadphones
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import PaymentModal from '../../components/PaymentModal';

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
// SEO + GEO DATA
// ============================================

const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://krynovatechnology.pythonanywhere.com';

const indianCities = [
  "Agra", "Lucknow", "Kanpur", "Varanasi", "Prayagraj", "Mathura", "Aligarh", "Bareilly",
  "Meerut", "Ghaziabad", "Noida", "Delhi", "Mumbai", "Pune", "Bengaluru", "Chennai",
  "Hyderabad", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Indore", "Bhopal", "Nagpur",
  "Patna", "Ranchi", "Bhubaneswar", "Guwahati", "Chandigarh", "Dehradun", "Shimla",
  "Srinagar", "Jammu", "Amritsar", "Ludhiana", "Jalandhar", "Panchkula", "Mohali",
  "Gurugram", "Faridabad", "Aurangabad", "Nashik", "Vadodara", "Rajkot",
  "Jodhpur", "Udaipur", "Kota", "Bikaner", "Gwalior", "Jabalpur", "Ujjain", "Sagar",
  "Raipur", "Bilaspur", "Durgapur", "Asansol", "Siliguri", "Dhanbad", "Bhagalpur",
  "Muzaffarpur", "Gaya", "Nanded", "Solapur", "Mysore", "Tiruchirappalli", "Coimbatore",
  "Madurai", "Kochi", "Thiruvananthapuram", "Goa", "Panaji", "Puducherry"
];

const globalCountries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "United Arab Emirates", "Saudi Arabia", "Singapore", "Malaysia", "Indonesia",
  "Philippines", "South Africa", "Nigeria", "Kenya", "Tanzania", "Uganda", "Rwanda",
  "Egypt", "Morocco", "Turkey", "Russia", "Japan", "South Korea", "China", "Hong Kong",
  "Brazil", "Argentina", "Mexico", "New Zealand", "Ireland", "Netherlands", "Italy",
  "Spain", "Portugal", "Sweden", "Norway", "Denmark", "Finland", "Switzerland", "Austria"
];

// ============================================
// TEMPLATES
// ============================================

const TEMPLATES = {
  letter: {
    id: 'letter',
    name: 'Formal Letter',
    icon: FaFileWord,
    description: 'Professional business letter template',
    content: `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email] | [Your Phone]

[Date]

[Recipient Name]
[Recipient Title]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Recipient Name],

I am writing to express my interest in [opportunity/position/project] at [Company Name]. With my [X]+ years of experience in [industry/field], I am confident in my ability to contribute meaningfully to your team.

Throughout my career, I have developed strong skills in [skill 1], [skill 2], and [skill 3]. I have successfully [achievement 1], [achievement 2], and [achievement 3]. I am particularly proud of [specific accomplishment].

I am very interested in [Company Name] because [reason for interest]. I would welcome the opportunity to discuss how my experience and skills align with your needs.

Thank you for your time and consideration.

Sincerely,
[Your Name]`
  },
  resume: {
    id: 'resume',
    name: 'Resume/CV',
    icon: FaFileAlt,
    description: 'Professional resume template',
    content: `RESUME

[Your Full Name]
[Your Email] | [Your Phone] | [Your LinkedIn]
[Your Location]

PROFESSIONAL SUMMARY
[2-3 sentences describing your experience, skills, and career goals]

SKILLS
• [Skill 1]
• [Skill 2]
• [Skill 3]
• [Skill 4]
• [Skill 5]

PROFESSIONAL EXPERIENCE
[Job Title] | [Company Name] | [Start Date] - [End Date]
• [Responsibility/achievement 1]
• [Responsibility/achievement 2]
• [Responsibility/achievement 3]

[Job Title] | [Company Name] | [Start Date] - [End Date]
• [Responsibility/achievement 1]
• [Responsibility/achievement 2]
• [Responsibility/achievement 3]

EDUCATION
[Degree] | [University Name] | [Graduation Year]
• [Relevant coursework or achievements]
• [GPA if high]

CERTIFICATIONS & AWARDS
• [Certification 1]
• [Certification 2]`
  },
  report: {
    id: 'report',
    name: 'Business Report',
    icon: FaFileExport,
    description: 'Professional business report template',
    content: `BUSINESS REPORT

Title: [Report Title]
Date: [Current Date]
Prepared By: [Your Name]
Department: [Your Department]

EXECUTIVE SUMMARY
[Brief overview of the report's key findings and recommendations]

INTRODUCTION
[Background information and purpose of the report]

FINDINGS AND ANALYSIS
Key Finding 1: [Description of finding]
• Supporting data: [Data/evidence]
• Impact: [Impact on business]

Key Finding 2: [Description of finding]
• Supporting data: [Data/evidence]
• Impact: [Impact on business]

Key Finding 3: [Description of finding]
• Supporting data: [Data/evidence]
• Impact: [Impact on business]

RECOMMENDATIONS
Recommendation 1: [Specific recommendation]
• Benefits: [Expected outcomes]
• Timeline: [Implementation timeline]

Recommendation 2: [Specific recommendation]
• Benefits: [Expected outcomes]
• Timeline: [Implementation timeline]

CONCLUSION
[Summary of the report and next steps]`
  },
  invoice: {
    id: 'invoice',
    name: 'Invoice',
    icon: FaFileExport,
    description: 'Professional invoice template',
    content: `INVOICE

Invoice Number: [INV-YYYY-XXXX]
Date: [Current Date]
Due Date: [Due Date]

FROM:
[Your Company Name]
[Your Address]
[City, State, ZIP Code]
[Your Email]
[Your Phone]

BILL TO:
[Client Company Name]
[Client Address]
[Client City, State, ZIP Code]
[Client Email]

DESCRIPTION OF SERVICES
Item | Description | Qty | Rate | Amount
1 | [Service Description] | [Qty] | [Rate] | [Total]
2 | [Service Description] | [Qty] | [Rate] | [Total]
3 | [Service Description] | [Qty] | [Rate] | [Total]

Subtotal: [Subtotal Amount]
Tax Rate: [Tax Rate]%
Tax Amount: [Tax Amount]
Total Amount: [Total Amount]

Payment Terms: [Payment Terms]
Payment Method: [Bank Transfer/UPI/Cheque]

Notes: [Additional notes or instructions]

Thank you for your business!
[Your Company Name]`
  },
  proposal: {
    id: 'proposal',
    name: 'Project Proposal',
    icon: FaFileWord,
    description: 'Professional project proposal template',
    content: `PROJECT PROPOSAL

Project Title: [Project Name]
Prepared For: [Client Company Name]
Prepared By: [Your Company Name]
Date: [Current Date]

EXECUTIVE SUMMARY
[Brief overview of the project and key benefits]

PROJECT OVERVIEW
[Description of the project, its purpose, and objectives]

SCOPE OF WORK
Phase 1: [Phase 1 Name]
• [Task 1]
• [Task 2]
• [Task 3]

Phase 2: [Phase 2 Name]
• [Task 1]
• [Task 2]
• [Task 3]

TIMELINE AND DELIVERABLES
Phase 1: [Timeline] - [Deliverables]
Phase 2: [Timeline] - [Deliverables]
Phase 3: [Timeline] - [Deliverables]

BUDGET ESTIMATE
Item | Description | Cost
1 | [Item 1] | [Cost 1]
2 | [Item 2] | [Cost 2]
3 | [Item 3] | [Cost 3]
Total Budget: [Total Cost]

TEAM COMPOSITION
Role 1: [Team Member Name] - [Expertise]
Role 2: [Team Member Name] - [Expertise]
Role 3: [Team Member Name] - [Expertise]

NEXT STEPS
1. [Step 1]
2. [Step 2]
3. [Step 3]

We look forward to working with you on this project!
[Your Company Name]`
  },
  newsletter: {
    id: 'newsletter',
    name: 'Newsletter',
    icon: FaFileAlt,
    description: 'Professional newsletter template',
    content: `[NEWSLETTER TITLE]

Issue: [Issue Number] | Date: [Current Date]

WELCOME MESSAGE
[Welcome message to subscribers]

FEATURE ARTICLE
[Article Title]
[Feature article content with key information]

INDUSTRY NEWS
• [News item 1]
• [News item 2]
• [News item 3]

TIPS & TRICKS
[Tip 1]: [Description]
[Tip 2]: [Description]
[Tip 3]: [Description]

UPCOMING EVENTS
• [Event 1] - [Date] - [Location]
• [Event 2] - [Date] - [Location]

RESOURCES
• [Resource 1]: [Brief description]
• [Resource 2]: [Brief description]
• [Resource 3]: [Brief description]

CONNECT WITH US
[Social Media Links]
[Website]
[Email]

Thank you for subscribing!
[Your Company Name]`
  },
  contract: {
    id: 'contract',
    name: 'Service Contract',
    icon: FaFileWord,
    description: 'Professional service contract template',
    content: `SERVICE CONTRACT

Contract Number: [CON-YYYY-XXXX]
Date: [Current Date]
Effective Date: [Effective Date]

BETWEEN:

[Service Provider Name]
[Provider Address]
[Provider City, State, ZIP Code]
[Provider Email]
[Provider Phone]
(Hereinafter referred to as "Service Provider")

AND:

[Client Name]
[Client Address]
[Client City, State, ZIP Code]
[Client Email]
[Client Phone]
(Hereinafter referred to as "Client")

1. SERVICES
The Service Provider agrees to provide the following services:
• [Service 1]
• [Service 2]
• [Service 3]
• [Service 4]

2. TERM AND TERMINATION
This contract shall commence on [Start Date] and continue until [End Date] unless terminated earlier.
Termination Conditions:
• [Condition 1]
• [Condition 2]

3. COMPENSATION
The Client agrees to pay the Service Provider as follows:
Service Fee: [Amount]
Payment Terms: [Payment Terms]
Payment Schedule: [Schedule]

4. RESPONSIBILITIES
Service Provider Responsibilities:
• [Responsibility 1]
• [Responsibility 2]

Client Responsibilities:
• [Responsibility 1]
• [Responsibility 2]

5. CONFIDENTIALITY
Both parties agree to maintain confidentiality regarding all business information.

6. GOVERNING LAW
This contract shall be governed by the laws of [State/Country].

IN WITNESS WHEREOF, the parties have executed this contract as of the date first written above.

Service Provider Signature: _______________________
Date: _________

Client Signature: _______________________
Date: _________`
  }
};

// ============================================
// PDF STYLES
// ============================================

const PDF_STYLES = [
  { id: 'classic', name: 'Classic', font: 'Times New Roman', size: 12 },
  { id: 'modern', name: 'Modern', font: 'Arial', size: 12 },
  { id: 'elegant', name: 'Elegant', font: 'Georgia', size: 12 },
  { id: 'minimal', name: 'Minimal', font: 'Helvetica', size: 11 },
  { id: 'tech', name: 'Tech', font: 'Consolas', size: 11 },
  { id: 'formal', name: 'Formal', font: 'Times New Roman', size: 12 },
];

// ============================================
// CONVERSION HISTORY
// ============================================

const ConversionHistory = ({ history, onReuse }) => {
  const [expanded, setExpanded] = useState(false);

  if (safeArray(history).length === 0) return null;

  const displayedHistory = expanded ? history : history.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          <FaHistory className="text-cyan-500" />
          <span className="font-semibold text-gray-700">Conversion History</span>
          <span className="text-xs text-gray-400">({safeArray(history).length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {expanded ? 'Show less' : 'Show more'}
          </span>
          {expanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </div>
      </button>
      
      {expanded && (
        <div className="border-t border-gray-200 p-3 space-y-2 max-h-60 overflow-y-auto">
          {safeArray(history).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3 min-w-0">
                <FaFilePdf className="text-red-400 flex-shrink-0" />
                <span className="text-sm truncate">{item.title}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {item.words} words
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.status === 'completed' && (
                  <>
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <FaCheckCircle className="text-xs" /> Done
                    </span>
                    <button
                      onClick={() => onReuse(item)}
                      className="text-xs text-cyan-500 hover:text-cyan-700 transition"
                    >
                      Reuse
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// TEXT TO PDF COMPONENT
// ============================================

const TextToPDF = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('Document');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);

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
          toast.success('🎉 Premium activated! Unlimited conversions.');
        }
      } catch (error) {
        console.error('Premium check failed:', error);
      }
    };
    checkPremiumStatus();
  }, []);

  // Load conversion history
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('textToPdfHistory');
      if (savedHistory) {
        setConversionHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  const saveToHistory = (title, status, resultData) => {
    const newEntry = {
      title,
      words: wordCount,
      timestamp: new Date().toISOString(),
      status,
    };
    const updatedHistory = [newEntry, ...conversionHistory].slice(0, 20);
    setConversionHistory(updatedHistory);
    try {
      localStorage.setItem('textToPdfHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('Could not save history:', e);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(newText.trim() ? newText.trim().split(/\s+/).length : 0);
    setCharCount(newText.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    // Check free limit for non-premium
    if (!isPremium) {
      const today = new Date().toDateString();
      const usage = JSON.parse(localStorage.getItem('textToPdfUsage') || '{"date":"","count":0}');
      if (usage.date === today && usage.count >= 5) {
        toast.error('Free limit reached! Upgrade to premium for unlimited conversions.');
        setShowPaymentModal(true);
        return;
      }
    }

    setLoading(true);
    setProgress(0);
    setProgressStatus('Starting conversion...');
    
    try {
      setProgress(30);
      setProgressStatus('Processing text...');
      
      const response = await api.textToPdf({
        text,
        title: title || 'Document',
        is_premium: isPremium,
        style: selectedStyle,
        template: selectedTemplate
      });
      
      setProgress(90);
      setProgressStatus('Generating PDF...');
      
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        
        // Track usage
        if (!isPremium) {
          const today = new Date().toDateString();
          const usage = JSON.parse(localStorage.getItem('textToPdfUsage') || '{"date":"","count":0}');
          if (usage.date === today) {
            usage.count += 1;
          } else {
            usage.date = today;
            usage.count = 1;
          }
          localStorage.setItem('textToPdfUsage', JSON.stringify(usage));
        }
        
        saveToHistory(title, 'completed', response.data);
        
        setProgress(100);
        setProgressStatus('✅ Conversion complete!');
        toast.success('✅ PDF generated successfully!');
        
        if (isPremium) {
          setTimeout(() => downloadFile(), 1000);
        }
      }
    } catch (error) {
      setProgress(0);
      setProgressStatus('❌ Conversion failed');
      if (error.response?.data?.limit_reached) {
        toast.error('Free limit reached! Upgrade to premium.');
        setUsageInfo({
          used: error.response.data.usage_count,
          remaining: 0,
          isPremium: false
        });
        setShowPaymentModal(true);
      } else {
        toast.error(error.response?.data?.error || 'Failed to generate PDF');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 3000);
    }
  };

  const downloadFile = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${result.file}`;
    link.download = result.filename || `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('PDF downloaded!');
  };

  const clearText = () => {
    setText('');
    setWordCount(0);
    setCharCount(0);
    setResult(null);
    setSelectedTemplate(null);
  };

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const reuseHistory = (item) => {
    toast.success(`Reusing "${item.title}" settings`);
    setTitle(item.title);
  };

  const applyTemplate = (templateId) => {
    const template = TEMPLATES[templateId];
    if (template) {
      setText(template.content);
      setSelectedTemplate(templateId);
      setWordCount(template.content.trim() ? template.content.trim().split(/\s+/).length : 0);
      setCharCount(template.content.length);
      toast.success(`Loaded "${template.name}" template`);
    }
    setShowTemplateDropdown(false);
  };

  const getCurrentStyle = () => {
    return PDF_STYLES.find(s => s.id === selectedStyle) || PDF_STYLES[0];
  };

  const getCurrentTemplate = () => {
    return selectedTemplate ? TEMPLATES[selectedTemplate] : null;
  };

  return (
    <>
      {/* ============================================ */}
      {/* SEO + AEO + GEO Helmet Implementation */}
      {/* ============================================ */}
      <Helmet>
        <title>Free Text to PDF Generator - Convert Text to PDF Online | Krynova Technologies</title>
        <meta name="description" content="Convert text to PDF online for free with Krynova Technologies. Generate professional PDF documents from text with 7 templates and 6 styles. Free users get 5 conversions per day. Premium users get unlimited conversions." />
        <meta name="keywords" content="text to PDF, convert text to PDF, text to PDF generator, free text to PDF, create PDF from text, online PDF generator, Krynova text to PDF, best text to PDF tool, text to PDF converter India" />
        <link rel="canonical" href={`${siteUrl}/tools/text-to-pdf`} />
        
        {/* GEO Meta Tags */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta name="serviceArea" content={`India, ${globalCountries.join(", ")}, Worldwide`} />
        <meta name="targetGeo" content="India" />
        
        {/* AEO Meta Tags */}
        <meta name="question" content="How to convert text to PDF for free in India?" />
        <meta name="answer" content="Krynova Technologies offers a free text to PDF generator in India. Enter your text, choose a template (Letter, Resume, Report, Invoice, Proposal, Newsletter, Contract), select a style, and generate your PDF. Free users get 5 conversions per day. Premium users get unlimited conversions." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="voice-search" content="true" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Text to PDF Generator - Convert Text to PDF Online | Krynova Technologies" />
        <meta property="og:description" content="Convert text to PDF online for free. Generate professional PDF documents from text with 7 templates and 6 styles. Free users get 5 conversions per day." />
        <meta property="og:url" content={`${siteUrl}/tools/text-to-pdf`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Text to PDF Generator - Convert Text to PDF Online" />
        <meta name="twitter:description" content="Convert text to PDF online for free with Krynova Technologies." />
      </Helmet>

      {/* ============================================ */}
      {/* Speakable Content for Voice Assistants */}
      {/* ============================================ */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Free Text to PDF Generator - Krynova Technologies</h2>
        <p>Convert text to PDF online for free. Generate professional PDF documents from text with templates and styles.</p>
        <ul>
          <li>Free text to PDF conversion - 5 conversions per day</li>
          <li>7 professional templates: Letter, Resume, Report, Invoice, Proposal, Newsletter, Contract</li>
          <li>6 PDF styles: Classic, Modern, Elegant, Minimal, Tech, Formal</li>
          <li>Premium - Unlimited conversions, all templates</li>
          <li>Rich text editing with formatting tools</li>
          <li>Secure and encrypted file processing</li>
        </ul>
        <p>Krynova Technologies is the best text to PDF generator in India, serving cities like Agra, Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, and all across India.</p>
      </div>

      {/* ============================================ */}
      {/* Schema.org WebApplication */}
      {/* ============================================ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Text to PDF Generator",
          "description": "Free online text to PDF generator. Convert text to professional PDF documents with 7 templates and 6 styles. Supports 5 free conversions per day.",
          "url": `${siteUrl}/tools/text-to-pdf`,
          "applicationCategory": "Utilities",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "description": "Free text to PDF generator with 5 conversions per day. Premium upgrade available for unlimited conversions."
          },
          "provider": {
            "@type": "Organization",
            "name": "Krynova Technologies",
            "url": siteUrl,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Agra",
              "addressRegion": "Uttar Pradesh",
              "addressCountry": "India"
            }
          },
          "areaServed": indianCities,
          "availableLanguage": ["English", "Hindi", "Marathi", "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam", "Gujarati", "Punjabi", "Urdu"],
          "potentialAction": {
            "@type": "CreateAction",
            "target": `${siteUrl}/tools/text-to-pdf`,
            "result": {
              "@type": "CreativeWork",
              "name": "PDF Document"
            }
          }
        })}
      </script>

      {/* ============================================ */}
      {/* FAQ Schema */}
      {/* ============================================ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How to convert text to PDF for free?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To convert text to PDF for free, visit Krynova Technologies' Text to PDF Generator, enter your text or use a template, choose a style, and click Generate PDF. Download your PDF instantly. Free users get 5 conversions per day."
              }
            },
            {
              "@type": "Question",
              "name": "What templates are available for text to PDF conversion?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies offers 7 professional templates: Formal Letter, Resume/CV, Business Report, Invoice, Project Proposal, Newsletter, and Service Contract. Each template is designed for professional document creation."
              }
            },
            {
              "@type": "Question",
              "name": "What PDF styles are available?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies' text to PDF generator offers 6 styles: Classic (Times New Roman), Modern (Arial), Elegant (Georgia), Minimal (Helvetica), Tech (Consolas), and Formal (Times New Roman). Each style has a different font and layout."
              }
            },
            {
              "@type": "Question",
              "name": "What is the best text to PDF generator in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies offers one of the best free text to PDF generators in India. It supports 7 templates, 6 styles, word count tracking, and serves users across all major Indian cities including Agra, Delhi, Mumbai, Bengaluru, Chennai, and Hyderabad."
              }
            },
            {
              "@type": "Question",
              "name": "Is it safe to generate PDF from text online?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Krynova Technologies ensures secure text to PDF conversion with encrypted processing. Your text content is never stored permanently and is automatically deleted after PDF generation."
              }
            },
            {
              "@type": "Question",
              "name": "Can I use the text to PDF generator for professional documents?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Krynova Technologies' text to PDF generator is designed for professional document creation. With templates like Formal Letter, Business Report, Invoice, and Project Proposal, you can create professional documents for business, education, and personal use."
              }
            }
          ]
        })}
      </script>

      {/* ============================================ */}
      {/* Main Component */}
      {/* ============================================ */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaFileAlt className="text-cyan-500" />
              Free Text to PDF Generator
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Text to <span className="gradient-text">PDF Generator</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Convert text into professional PDF documents with templates, styles, and formatting. Free users get 5 conversions per day.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="text-yellow-400" /> Free: 5/day
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCrown className="text-yellow-500" /> Premium: Unlimited
              </span>
              <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm">
                <FaFile className="text-cyan-500" /> 7 Templates
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <FaPalette className="text-purple-500" /> 6 Styles
              </span>
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                <FaGlobe className="text-indigo-500" /> Serving 60+ Indian Cities
              </span>
            </div>
          </div>

          {/* Usage Info */}
          {usageInfo && (
            <div className={`mb-6 p-4 rounded-lg flex flex-wrap items-center justify-between ${
              usageInfo.isPremium ? 'bg-green-50 border border-green-200' :
              usageInfo.remaining > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="text-sm flex flex-wrap items-center gap-2">
                {usageInfo.isPremium ? (
                  <><FaCrown className="text-yellow-500" /> <span className="font-semibold">Premium:</span> Unlimited conversions • All templates</>
                ) : (
                  <>
                    <FaClock className="text-blue-500" />
                    <span>{usageInfo.used || 0} used today • {usageInfo.remaining || 0} remaining</span>
                  </>
                )}
              </div>
              {!usageInfo.isPremium && (
                <button
                  onClick={handleUpgrade}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  <FaCrown /> Upgrade Now — ₹99/month
                </button>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className="mb-6 bg-white rounded-xl p-4 border border-cyan-200 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaSpinner className="animate-spin text-cyan-500" />
                  {progressStatus}
                </span>
                <span className="text-sm font-semibold text-cyan-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title & Template Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter document title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-cyan-400 transition"
                    >
                      <span className="flex items-center gap-2">
                        <FaFile className="text-cyan-500" />
                        {getCurrentTemplate() ? getCurrentTemplate().name : 'Select Template'}
                      </span>
                      <FaChevronDown className={`text-gray-400 transition ${showTemplateDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showTemplateDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-10">
                        {Object.entries(TEMPLATES).map(([key, template]) => {
                          const Icon = template.icon;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => applyTemplate(key)}
                              className="w-full px-4 py-2 text-left hover:bg-cyan-50 transition flex items-center gap-3 border-b border-gray-100 last:border-0"
                            >
                              <Icon className="text-cyan-500" />
                              <div>
                                <p className="text-sm font-medium">{template.name}</p>
                                <p className="text-xs text-gray-400">{template.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PDF Style</label>
                <div className="flex flex-wrap gap-2">
                  {safeArray(PDF_STYLES).map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition border ${
                        selectedStyle === style.id
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                          : 'border-gray-200 hover:border-cyan-300'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex flex-wrap gap-2">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Bold">
                      <FaBold className="text-sm text-gray-600" />
                    </button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Italic">
                      <FaItalic className="text-sm text-gray-600" />
                    </button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Underline">
                      <FaUnderline className="text-sm text-gray-600" />
                    </button>
                    <span className="w-px h-6 bg-gray-300 mx-1"></span>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Align Left">
                      <FaAlignLeft className="text-sm text-gray-600" />
                    </button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Align Center">
                      <FaAlignCenter className="text-sm text-gray-600" />
                    </button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Align Right">
                      <FaAlignRight className="text-sm text-gray-600" />
                    </button>
                    <span className="w-px h-6 bg-gray-300 mx-1"></span>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Bullet List">
                      <FaListUl className="text-sm text-gray-600" />
                    </button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded transition" title="Numbered List">
                      <FaListOl className="text-sm text-gray-600" />
                    </button>
                    {isPremium && (
                      <>
                        <span className="w-px h-6 bg-gray-300 mx-1"></span>
                        <button type="button" className="p-1 hover:bg-gray-200 rounded transition text-purple-500" title="Table (Premium)">
                          <FaTable className="text-sm" />
                        </button>
                        <button type="button" className="p-1 hover:bg-gray-200 rounded transition text-purple-500" title="Image (Premium)">
                          <FaImage className="text-sm" />
                        </button>
                      </>
                    )}
                  </div>
                  <textarea 
                    rows="12" 
                    value={text} 
                    onChange={handleTextChange} 
                    className="w-full px-4 py-3 focus:outline-none resize-y min-h-[300px] font-mono text-sm"
                    placeholder="Enter your text content here... Use bullet points with - or * for lists"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span>Words: {wordCount}</span>
                    <span>Characters: {charCount}</span>
                    {isPremium && <span className="text-purple-500">✨ Premium Editor</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setText('');
                        setSelectedTemplate(null);
                      }}
                      className="text-xs text-red-500 hover:text-red-700 transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Premium Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <label className="text-sm text-gray-700 flex items-center gap-1">
                  <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited • All Templates)
                </label>
                {!isPremium && (
                  <span className="text-xs text-gray-400 ml-2">
                    (Free: 5/day • 7 Templates)
                  </span>
                )}
              </div>

              {!isPremium && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs text-yellow-700 flex items-center gap-2">
                  <FaInfoCircle />
                  Free users get 5 conversions per day. Upgrade to premium for unlimited conversions and advanced features.
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaFilePdf />}
                {loading ? 'Generating...' : 'Generate PDF'}
              </button>
            </form>

            {/* Results */}
            {result && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-cyan-800">✅ PDF Generated!</p>
                      <p className="text-sm text-cyan-600">
                        Document "{title}" created with {wordCount} words
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-white p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Words</p>
                      <p className="font-bold text-gray-900">{wordCount}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Characters</p>
                      <p className="font-bold text-gray-900">{charCount}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Style</p>
                      <p className="font-bold text-gray-900">{getCurrentStyle().name}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={downloadFile}
                      className="flex-1 bg-cyan-500 text-white py-2.5 rounded-lg hover:bg-cyan-600 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
                    >
                      <FaDownload /> Download PDF
                    </button>
                    <button
                      onClick={() => {
                        clearText();
                        setResult(null);
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2 font-semibold"
                    >
                      <FaPlus /> Convert Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Conversion History */}
          <div className="mt-6">
            <ConversionHistory 
              history={conversionHistory} 
              onReuse={reuseHistory}
            />
          </div>

          {/* Features Section */}
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaFile className="text-3xl text-cyan-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">7 Templates</h4>
              <p className="text-xs text-gray-500">Letter, Resume, Report, Invoice, Proposal, Newsletter, Contract</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaPalette className="text-3xl text-cyan-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">6 PDF Styles</h4>
              <p className="text-xs text-gray-500">Classic, Modern, Elegant, Minimal, Tech, Formal</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaMagic className="text-3xl text-cyan-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Instant Conversion</h4>
              <p className="text-xs text-gray-500">Convert text to PDF in seconds</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaShieldAlt className="text-3xl text-cyan-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Secure & Private</h4>
              <p className="text-xs text-gray-500">Your content is safe and private</p>
            </div>
          </div>

          {/* Upgrade CTA */}
          {!isPremium && (
            <div className="mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">🚀 Unlock Premium Features</h3>
                <p className="text-cyan-100 mb-4">
                  Get unlimited conversions, all templates, advanced styling with tables and images, and priority support.
                </p>
                <button
                  onClick={handleUpgrade}
                  className="bg-white text-cyan-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5"
                >
                  Upgrade Now — ₹99/month
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          userEmail={localStorage.getItem('userEmail') || ''}
          userId={localStorage.getItem('userId') || ''}
        />

        <style dangerouslySetInnerHTML={{ __html: `
          .gradient-text {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animate-pulse {
            animation: pulse 1.5s ease-in-out infinite;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}} />
      </div>
    </>
  );
};

export default TextToPDF;