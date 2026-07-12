// src/pages/tools/TextToPDF.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  FaLanguage, FaHeadphones, FaStrikethrough, FaHighlighter,
  FaTextHeight, FaTextWidth, FaUndo, FaRedo, FaEraser,
  FaSave, FaEye, FaEyeSlash, FaPrint, FaFileCode,
  FaFileImage, FaFilePdf as FaFilePdfIcon
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import { secureStorage } from '../../utils/security';
import PaymentModal from '../../components/PaymentModal';

// ============================================
// ✅ SAFE ARRAY HELPERS
// ============================================

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
// ADVANCED TEMPLATES
// ============================================

const ADVANCED_TEMPLATES = {
  business_letter: {
    id: 'business_letter',
    name: 'Business Letter',
    icon: FaFileWord,
    description: 'Professional business letter with proper formatting',
    category: 'Business',
    content: `[Your Company Name]
[Your Address]
[City, State, ZIP Code]
[Phone] | [Email]

[Date]

[Recipient Name]
[Recipient Title]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Recipient Name],

Subject: [Subject Line]

I am writing to formally [state the purpose of your letter]. This letter serves as [explain the context and importance].

[Paragraph 2: Provide details, background, or supporting information]

[Paragraph 3: State your request, recommendation, or next steps]

[Paragraph 4: Conclude with a call to action or next steps]

Thank you for your time and consideration. I look forward to your response.

Yours sincerely,
[Your Full Name]
[Your Title]
[Your Signature]`
  },
  modern_resume: {
    id: 'modern_resume',
    name: 'Modern Resume',
    icon: FaFileAlt,
    description: 'Clean, modern resume design',
    category: 'Career',
    content: `[YOUR FULL NAME]
[Title/Position]
[Phone] • [Email] • [LinkedIn] • [Location]

───────────────────────────────────────

PROFESSIONAL SUMMARY
───────────────────────────────────────
[2-3 sentences highlighting your experience, key skills, and career goals]

CORE COMPETENCIES
───────────────────────────────────────
• [Skill 1] • [Skill 2] • [Skill 3] • [Skill 4]
• [Skill 5] • [Skill 6] • [Skill 7] • [Skill 8]

PROFESSIONAL EXPERIENCE
───────────────────────────────────────
[Job Title] | [Company Name] | [Start Date] – [End Date]
• [Key achievement with measurable result]
• [Key achievement with measurable result]
• [Key achievement with measurable result]

[Job Title] | [Company Name] | [Start Date] – [End Date]
• [Key achievement with measurable result]
• [Key achievement with measurable result]
• [Key achievement with measurable result]

EDUCATION
───────────────────────────────────────
[Degree] | [University Name] | [Year]
• [Relevant coursework or achievements]
• [GPA or honors]

CERTIFICATIONS & AWARDS
───────────────────────────────────────
• [Certification 1] – [Issuing Organization]
• [Certification 2] – [Issuing Organization]

ADDITIONAL INFORMATION
───────────────────────────────────────
• Languages: [Language 1] ([Proficiency]), [Language 2] ([Proficiency])
• Technical Skills: [Skill 1], [Skill 2], [Skill 3]
• Interests: [Interest 1], [Interest 2]`
  },
  project_proposal: {
    id: 'project_proposal',
    name: 'Project Proposal',
    icon: FaFileExport,
    description: 'Comprehensive project proposal template',
    category: 'Business',
    content: `PROJECT PROPOSAL
───────────────────────────────────────

Project Title: [Project Name]
Prepared For: [Client/Organization Name]
Prepared By: [Your Company Name]
Date: [Current Date]
Version: 1.0

EXECUTIVE SUMMARY
───────────────────────────────────────
[Brief overview of the project, its purpose, and key benefits]

PROJECT BACKGROUND
───────────────────────────────────────
[Background information about the project context and need]

OBJECTIVES
───────────────────────────────────────
• [Objective 1]
• [Objective 2]
• [Objective 3]

SCOPE OF WORK
───────────────────────────────────────
Phase 1: [Phase Name]
• [Task 1]
• [Task 2]
• [Task 3]

Phase 2: [Phase Name]
• [Task 1]
• [Task 2]
• [Task 3]

Phase 3: [Phase Name]
• [Task 1]
• [Task 2]
• [Task 3]

DELIVERABLES
───────────────────────────────────────
• [Deliverable 1] – [Description and format]
• [Deliverable 2] – [Description and format]
• [Deliverable 3] – [Description and format]

TIMELINE
───────────────────────────────────────
Phase 1: [Start Date] – [End Date]
Phase 2: [Start Date] – [End Date]
Phase 3: [Start Date] – [End Date]

BUDGET
───────────────────────────────────────
Item | Description | Quantity | Unit Price | Total
[Item 1] | [Description] | [Qty] | [Price] | [Total]
[Item 2] | [Description] | [Qty] | [Price] | [Total]
[Item 3] | [Description] | [Qty] | [Price] | [Total]

Total Budget: [Total Amount]

TEAM COMPOSITION
───────────────────────────────────────
• [Role 1]: [Name] – [Expertise/Experience]
• [Role 2]: [Name] – [Expertise/Experience]
• [Role 3]: [Name] – [Expertise/Experience]

RISK ASSESSMENT
───────────────────────────────────────
Risk 1: [Description] – [Mitigation Strategy]
Risk 2: [Description] – [Mitigation Strategy]

NEXT STEPS
───────────────────────────────────────
1. [Step 1]
2. [Step 2]
3. [Step 3]

We look forward to the opportunity to work with you.

[Your Name]
[Your Title]
[Your Company]`
  },
  invoice: {
    id: 'invoice',
    name: 'Professional Invoice',
    icon: FaFileExport,
    description: 'Professional invoice with tax calculations',
    category: 'Finance',
    content: `INVOICE
───────────────────────────────────────

Invoice #: [INV-YYYY-XXXX]
Invoice Date: [Current Date]
Due Date: [Due Date]

FROM:
[Your Company Name]
[Your Address]
[City, State, ZIP Code]
[Phone] | [Email]
GST/TIN: [Tax ID]

BILL TO:
[Client Company Name]
[Client Address]
[Client City, State, ZIP Code]
[Client Email] | [Client Phone]

DESCRIPTION OF SERVICES
───────────────────────────────────────
Item | Description | Qty | Rate | Amount
[1] | [Service Description] | [Qty] | [Rate] | [Total]
[2] | [Service Description] | [Qty] | [Rate] | [Total]
[3] | [Service Description] | [Qty] | [Rate] | [Total]

Subtotal: [Subtotal Amount]
Tax Rate: [Tax Rate]%
Tax Amount: [Tax Amount]
Shipping/Handling: [Amount]
Discount: [Amount]

TOTAL AMOUNT: [Total Amount]

PAYMENT TERMS
───────────────────────────────────────
Payment Method: [Bank Transfer/UPI/Cheque]
Payment Due: [Due Date]
Bank Details: [Bank Name] – [Account Number] – [IFSC Code]

NOTES
───────────────────────────────────────
[Additional notes or instructions]

Thank you for your business!

[Your Signature]
[Your Name]
[Your Title]`
  },
  meeting_agenda: {
    id: 'meeting_agenda',
    name: 'Meeting Agenda',
    icon: FaListUl,
    description: 'Professional meeting agenda template',
    category: 'Meeting',
    content: `MEETING AGENDA
───────────────────────────────────────

Meeting Title: [Meeting Name]
Date: [Date]
Time: [Start Time] – [End Time]
Location: [Location/Virtual Link]
Chair: [Chair Name]
Attendees: [List of Attendees]

OBJECTIVES
───────────────────────────────────────
• [Objective 1]
• [Objective 2]
• [Objective 3]

AGENDA
───────────────────────────────────────
1. Call to Order
   - [Time allocated: X min]
   - [Description]

2. Approval of Previous Minutes
   - [Time allocated: X min]
   - [Description]

3. [Agenda Item 1]
   - [Time allocated: X min]
   - [Presenter: Name]
   - [Description and discussion points]

4. [Agenda Item 2]
   - [Time allocated: X min]
   - [Presenter: Name]
   - [Description and discussion points]

5. [Agenda Item 3]
   - [Time allocated: X min]
   - [Presenter: Name]
   - [Description and discussion points]

6. New Business
   - [Time allocated: X min]
   - [Discussion items]

7. Next Steps and Action Items
   - [Time allocated: X min]
   - [List action items]

8. Adjournment
   - [Time allocated: X min]

PRE-READING MATERIALS
───────────────────────────────────────
• [Document 1] – [Description]
• [Document 2] – [Description]

ACTION ITEMS
───────────────────────────────────────
Action Item | Owner | Due Date | Status
[Item 1] | [Name] | [Date] | [Status]
[Item 2] | [Name] | [Date] | [Status]

NOTES
───────────────────────────────────────
[Additional notes or special instructions]

Meeting prepared by: [Preparer Name]`
  },
  memo: {
    id: 'memo',
    name: 'Business Memo',
    icon: FaFileWord,
    description: 'Professional internal memo template',
    category: 'Business',
    content: `INTERNAL MEMO
───────────────────────────────────────

TO: [Recipient/Department]
FROM: [Your Name/Department]
DATE: [Current Date]
SUBJECT: [Memo Subject]

[Opening paragraph stating the purpose of the memo]

[Background/Context paragraph]

[Key Discussion/Information paragraph]

[Action Items/Recommendations]

[Closing paragraph with next steps]

CONTACT INFORMATION
───────────────────────────────────────
[Your Name]
[Your Title]
[Phone] | [Email]

CC: [CC Recipients]

───────────────────────────────────────
This memo is for internal use only.`
  }
};

// ============================================
// ADVANCED PDF STYLES
// ============================================

const ADVANCED_PDF_STYLES = [
  { id: 'classic', name: 'Classic', font: 'Times New Roman', size: 12, color: '#333333', lineHeight: 1.5, spacing: 'normal' },
  { id: 'modern', name: 'Modern', font: 'Arial', size: 12, color: '#2c3e50', lineHeight: 1.6, spacing: 'normal' },
  { id: 'elegant', name: 'Elegant', font: 'Georgia', size: 12, color: '#1a1a2e', lineHeight: 1.6, spacing: 'normal' },
  { id: 'minimal', name: 'Minimal', font: 'Helvetica', size: 11, color: '#2d2d2d', lineHeight: 1.5, spacing: 'compact' },
  { id: 'tech', name: 'Tech', font: 'Consolas', size: 11, color: '#1a1a1a', lineHeight: 1.4, spacing: 'compact' },
  { id: 'formal', name: 'Formal', font: 'Times New Roman', size: 12, color: '#000000', lineHeight: 1.5, spacing: 'normal' },
  { id: 'creative', name: 'Creative', font: 'Poppins', size: 12, color: '#2d1b69', lineHeight: 1.7, spacing: 'relaxed' },
  { id: 'newsletter', name: 'Newsletter', font: 'Georgia', size: 11, color: '#333333', lineHeight: 1.5, spacing: 'normal' },
];

// ============================================
// RICH TEXT EDITOR COMPONENT - FULLY WORKING
// ============================================

const RichTextEditor = ({ value, onChange, isPremium }) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [alignment, setAlignment] = useState('left');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const textareaRef = useRef(null);

  // Save to history
  const saveToHistory = (text) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(text);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onChange(history[historyIndex - 1]);
      toast.success('Undo');
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onChange(history[historyIndex + 1]);
      toast.success('Redo');
    }
  };

  // ✅ FIXED: Get selected text from textarea
  const getSelectedText = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, text: '' };
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    return { start, end, text: selectedText };
  };

  // ✅ FIXED: Replace selected text with formatted text
  const replaceSelectedText = (start, end, replacement) => {
    const newText = value.substring(0, start) + replacement + value.substring(end);
    onChange(newText);
    saveToHistory(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        const newCursorPos = start + replacement.length;
        textarea.selectionStart = newCursorPos;
        textarea.selectionEnd = newCursorPos;
        textarea.focus();
      }
    }, 10);
  };

  // ✅ FIXED: Format text with proper selection handling
  const formatText = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end, text: selectedText } = getSelectedText();

    if (!selectedText) {
      // If no text selected, insert the formatting at cursor position
      let prefix = '';
      let suffix = '';
      
      switch (format) {
        case 'bold': prefix = '**'; suffix = '**'; break;
        case 'italic': prefix = '*'; suffix = '*'; break;
        case 'underline': prefix = '__'; suffix = '__'; break;
        case 'strikethrough': prefix = '~~'; suffix = '~~'; break;
        case 'heading1': prefix = '# '; suffix = '\n'; break;
        case 'heading2': prefix = '## '; suffix = '\n'; break;
        case 'heading3': prefix = '### '; suffix = '\n'; break;
        case 'code': prefix = '`'; suffix = '`'; break;
        case 'blockquote': prefix = '> '; suffix = '\n'; break;
        default: return;
      }
      
      // Insert at cursor position
      const newText = value.substring(0, start) + prefix + suffix + value.substring(end);
      onChange(newText);
      saveToHistory(newText);
      
      // Set cursor between prefix and suffix
      setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          const newPos = start + prefix.length;
          textarea.selectionStart = newPos;
          textarea.selectionEnd = newPos;
          textarea.focus();
        }
      }, 10);
      
      toast.success(`Inserted ${format}`);
      return;
    }

    // If text is selected, wrap it with formatting
    let prefix = '';
    let suffix = '';

    switch (format) {
      case 'bold': prefix = '**'; suffix = '**'; break;
      case 'italic': prefix = '*'; suffix = '*'; break;
      case 'underline': prefix = '__'; suffix = '__'; break;
      case 'strikethrough': prefix = '~~'; suffix = '~~'; break;
      case 'heading1': prefix = '# '; suffix = ''; break;
      case 'heading2': prefix = '## '; suffix = ''; break;
      case 'heading3': prefix = '### '; suffix = ''; break;
      case 'code': prefix = '`'; suffix = '`'; break;
      case 'blockquote': prefix = '> '; suffix = ''; break;
      default: return;
    }

    const formattedText = prefix + selectedText + suffix;
    replaceSelectedText(start, end, formattedText);
    
    // Update button states
    switch (format) {
      case 'bold': setIsBold(!isBold); break;
      case 'italic': setIsItalic(!isItalic); break;
      case 'underline': setIsUnderline(!isUnderline); break;
      case 'strikethrough': setIsStrikethrough(!isStrikethrough); break;
      default: break;
    }
    
    toast.success(`Applied ${format}`);
  };

  // Insert list - FIXED
  const insertList = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end } = getSelectedText();
    let listText = '';
    let prefix = '';

    if (type === 'bullet') {
      prefix = '• ';
    } else if (type === 'numbered') {
      const lines = value.split('\n');
      const num = lines.filter(l => l.match(/^\d+\. /)).length + 1;
      prefix = `${num}. `;
    } else if (type === 'todo') {
      prefix = '☐ ';
    }

    // Insert at current position or on new line
    const before = value.substring(0, start);
    const after = value.substring(start);
    const newText = before + prefix + after;
    onChange(newText);
    saveToHistory(newText);
    
    // Move cursor after the prefix
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        const newPos = start + prefix.length;
        textarea.selectionStart = newPos;
        textarea.selectionEnd = newPos;
        textarea.focus();
      }
    }, 10);
  };

  // Insert table - FIXED
  const insertTable = (rows = 3, cols = 3) => {
    if (!isPremium) {
      toast.error('Tables are a premium feature. Upgrade to unlock!');
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    let table = '\n';
    table += '| ' + Array(cols).fill('Column').join(' | ') + ' |\n';
    table += '|' + Array(cols).fill('---').join('|') + '|\n';
    for (let i = 0; i < rows; i++) {
      table += '| ' + Array(cols).fill('').join(' | ') + ' |\n';
    }
    table += '\n';

    const newText = value.substring(0, cursorPos) + table + value.substring(cursorPos);
    onChange(newText);
    saveToHistory(newText);
    toast.success(`Inserted ${rows}x${cols} table`);
  };

  // Insert divider
  const insertDivider = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const divider = '\n---\n';
    const newText = value.substring(0, cursorPos) + divider + value.substring(cursorPos);
    onChange(newText);
    saveToHistory(newText);
    toast.success('Divider inserted');
  };

  // Insert placeholder
  const insertPlaceholder = (type) => {
    const placeholders = {
      date: '[Current Date]',
      name: '[Your Name]',
      company: '[Company Name]',
      address: '[Your Address]',
      phone: '[Phone Number]',
      email: '[Email Address]',
      signature: '[Your Signature]',
    };
    const placeholder = placeholders[type] || `[${type}]`;
    
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const newText = value.substring(0, cursorPos) + placeholder + value.substring(cursorPos);
    onChange(newText);
    saveToHistory(newText);
    
    // Move cursor after the placeholder
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        const newPos = cursorPos + placeholder.length;
        textarea.selectionStart = newPos;
        textarea.selectionEnd = newPos;
        textarea.focus();
      }
    }, 10);
  };

  // Toolbar Button
  const ToolbarButton = ({ icon: Icon, onClick, title, active = false, premium = false }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded transition ${
        active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'
      } ${premium && !isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title + (premium && !isPremium ? ' (Premium)' : '')}
      disabled={premium && !isPremium}
    >
      <Icon className="text-sm" />
    </button>
  );

  // Placeholder dropdown
  const [showPlaceholderDropdown, setShowPlaceholderDropdown] = useState(false);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
      {/* Toolbar */}
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex flex-wrap items-center gap-1">
        {/* Undo/Redo */}
        <ToolbarButton icon={FaUndo} onClick={handleUndo} title="Undo" />
        <ToolbarButton icon={FaRedo} onClick={handleRedo} title="Redo" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text Formatting */}
        <ToolbarButton icon={FaBold} onClick={() => formatText('bold')} title="Bold" active={isBold} />
        <ToolbarButton icon={FaItalic} onClick={() => formatText('italic')} title="Italic" active={isItalic} />
        <ToolbarButton icon={FaUnderline} onClick={() => formatText('underline')} title="Underline" active={isUnderline} />
        <ToolbarButton icon={FaStrikethrough} onClick={() => formatText('strikethrough')} title="Strikethrough" active={isStrikethrough} />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Headings */}
        <ToolbarButton icon={FaHeading} onClick={() => formatText('heading1')} title="Heading 1" />
        <ToolbarButton icon={FaHeading} onClick={() => formatText('heading2')} title="Heading 2" />
        <ToolbarButton icon={FaHeading} onClick={() => formatText('heading3')} title="Heading 3" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <ToolbarButton icon={FaAlignLeft} onClick={() => setAlignment('left')} title="Align Left" active={alignment === 'left'} />
        <ToolbarButton icon={FaAlignCenter} onClick={() => setAlignment('center')} title="Align Center" active={alignment === 'center'} />
        <ToolbarButton icon={FaAlignRight} onClick={() => setAlignment('right')} title="Align Right" active={alignment === 'right'} />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <ToolbarButton icon={FaListUl} onClick={() => insertList('bullet')} title="Bullet List" />
        <ToolbarButton icon={FaListOl} onClick={() => insertList('numbered')} title="Numbered List" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Premium Features */}
        <ToolbarButton icon={FaTable} onClick={() => insertTable(3, 3)} title="Insert Table" premium={true} />
        <ToolbarButton icon={FaCode} onClick={() => formatText('code')} title="Code Block" premium={true} />
        <ToolbarButton icon={FaQuoteRight} onClick={() => formatText('blockquote')} title="Blockquote" premium={true} />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Insert */}
        <ToolbarButton icon={FaPlus} onClick={() => insertDivider()} title="Insert Divider" />
        
        {/* Placeholder Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPlaceholderDropdown(!showPlaceholderDropdown)}
            className="p-1.5 hover:bg-gray-200 rounded transition text-gray-600"
            title="Insert Placeholder"
          >
            <FaMagic className="text-sm" />
          </button>
          {showPlaceholderDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[150px]">
              {Object.entries({
                date: '📅 Date',
                name: '👤 Name',
                company: '🏢 Company',
                address: '📍 Address',
                phone: '📞 Phone',
                email: '✉️ Email',
                signature: '✍️ Signature'
              }).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    insertPlaceholder(key);
                    setShowPlaceholderDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-cyan-50 transition text-sm flex items-center gap-2"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Premium badge */}
        {!isPremium && (
          <span className="ml-auto text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
            <FaCrown className="inline mr-1 text-yellow-500" /> Premium features locked
          </span>
        )}
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          saveToHistory(e.target.value);
        }}
        className="w-full px-4 py-3 focus:outline-none resize-y min-h-[300px] font-mono text-sm"
        placeholder="Enter your text content here... Use bullet points with - or * for lists"
        style={{ fontFamily: 'monospace' }}
        onSelect={(e) => {
          // Update button states based on selection
          const { start, end, text } = getSelectedText();
          // You can add logic here to detect if selected text has formatting
        }}
      />

      {/* Status Bar */}
      <div className="bg-gray-50 px-3 py-1.5 border-t border-gray-200 flex justify-between text-xs text-gray-400">
        <div className="flex gap-3">
          <span>Words: {value.trim() ? value.trim().split(/\s+/).length : 0}</span>
          <span>Characters: {value.length}</span>
          <span>Lines: {value.split('\n').length}</span>
        </div>
        <div>
          {isPremium && <span className="text-purple-500">✨ Premium Editor</span>}
        </div>
      </div>
    </div>
  );
};

// ============================================
// LIVE PREVIEW COMPONENT
// ============================================

const LivePreview = ({ text, style, template }) => {
  const previewRef = useRef(null);

  const currentStyle = ADVANCED_PDF_STYLES.find(s => s.id === style) || ADVANCED_PDF_STYLES[0];

  const renderText = (text) => {
    if (!text) return <span className="text-gray-400 italic">No content to preview</span>;
    
    // Split by lines and render
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Skip empty lines
      if (!line.trim()) {
        return <br key={index} />;
      }

      // Check for headings
      if (line.startsWith('# ')) {
        return <h2 key={index} className="text-xl font-bold mt-2">{line.slice(2)}</h2>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={index} className="text-lg font-bold mt-2">{line.slice(3)}</h3>;
      }
      if (line.startsWith('### ')) {
        return <h4 key={index} className="text-base font-bold mt-2">{line.slice(4)}</h4>;
      }

      // Check for bold/italic
      let processedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const italicRegex = /\*(.*?)\*/g;
      const underlineRegex = /__(.*?)__/g;
      const strikeRegex = /~~(.*?)~~/g;
      
      // Replace formatting
      const parts = [];
      let lastIndex = 0;
      let match;
      
      // Simple rendering - convert markdown-like syntax
      processedLine = processedLine.replace(boldRegex, '<strong>$1</strong>');
      processedLine = processedLine.replace(italicRegex, '<em>$1</em>');
      processedLine = processedLine.replace(underlineRegex, '<u>$1</u>');
      processedLine = processedLine.replace(strikeRegex, '<del>$1</del>');
      
      // Check for lists
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        return <div key={index} className="flex items-start gap-2 pl-4">
          <span className="text-blue-500">•</span>
          <span dangerouslySetInnerHTML={{ __html: processedLine.replace(/^[•\-]\s*/, '') }} />
        </div>;
      }
      if (line.trim().match(/^\d+\. /)) {
        const num = line.trim().match(/^(\d+)\. /)[1];
        return <div key={index} className="flex items-start gap-2 pl-4">
          <span className="text-gray-500 font-medium">{num}.</span>
          <span dangerouslySetInnerHTML={{ __html: processedLine.replace(/^\d+\.\s*/, '') }} />
        </div>;
      }

      // Check for blockquotes
      if (line.trim().startsWith('> ')) {
        return <div key={index} className="border-l-4 border-blue-400 pl-4 my-2 text-gray-600">
          <span dangerouslySetInnerHTML={{ __html: processedLine.replace(/^>\s*/, '') }} />
        </div>;
      }

      // Check for dividers
      if (line.trim() === '---' || line.trim() === '***') {
        return <hr key={index} className="my-4 border-gray-300" />;
      }

      // Check for code blocks
      if (line.trim().startsWith('`') && line.trim().endsWith('`')) {
        return <code key={index} className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono">
          {line.trim().replace(/`/g, '')}
        </code>;
      }

      // Normal paragraph
      return <p key={index} className="mb-1" dangerouslySetInnerHTML={{ __html: processedLine }} />;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FaEye className="text-cyan-500" /> Live Preview
        </h4>
        <span className="text-xs text-gray-400">
          {currentStyle.name} • {currentStyle.font}
        </span>
      </div>
      <div 
        ref={previewRef}
        className="prose prose-sm max-w-none"
        style={{
          fontFamily: currentStyle.font,
          fontSize: `${currentStyle.size}px`,
          color: currentStyle.color,
          lineHeight: currentStyle.lineHeight,
          letterSpacing: currentStyle.spacing === 'compact' ? '-0.5px' : 'normal',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '4px',
          minHeight: '300px'
        }}
      >
        {renderText(text)}
        {template && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
            Template: {ADVANCED_TEMPLATES[template]?.name || 'Custom'}
          </div>
        )}
      </div>
    </div>
  );
};

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
// MAIN TEXT TO PDF COMPONENT - ADVANCED
// ============================================

const TextToPDF = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('Document');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [userId, setUserId] = useState('anonymous');
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
  const [showPreview, setShowPreview] = useState(true);
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [pageSize, setPageSize] = useState('A4');
  const [marginSize, setMarginSize] = useState('normal');
  const [draftName, setDraftName] = useState('');

  // ✅ GET USER ID
  const getUserId = useCallback(() => {
    try {
      const storedId = localStorage.getItem('userId');
      if (storedId && storedId !== 'anonymous' && storedId !== 'null') {
        return storedId;
      }
      const user = secureStorage.get('user');
      if (user?.id) return user.id;
      const email = localStorage.getItem('userEmail');
      if (email) {
        const savedId = localStorage.getItem(`userId_${email}`);
        if (savedId) return savedId;
      }
      return 'anonymous';
    } catch (error) {
      console.error('Error getting userId:', error);
      return 'anonymous';
    }
  }, []);

  // ✅ CHECK PREMIUM STATUS
  const checkPremiumStatus = useCallback(async () => {
    try {
      const cached = localStorage.getItem('isPremium');
      if (cached === 'true') setIsPremium(true);
      
      const id = getUserId();
      setUserId(id);
      const response = await api.checkPremium(id);
      
      if (response?.data) {
        const isPremiumUser = response.data.is_premium === true;
        setIsPremium(isPremiumUser);
        localStorage.setItem('isPremium', isPremiumUser ? 'true' : 'false');
        return isPremiumUser;
      }
      setIsPremium(false);
      localStorage.setItem('isPremium', 'false');
      return false;
    } catch (error) {
      console.error('Premium check failed:', error);
      const cached = localStorage.getItem('isPremium');
      if (cached === 'true') {
        setIsPremium(true);
        return true;
      }
      setIsPremium(false);
      return false;
    }
  }, [getUserId]);

  useEffect(() => {
    checkPremiumStatus();
  }, [checkPremiumStatus]);

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

  // ✅ HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    let currentUserId = userId;
    if (!currentUserId || currentUserId === 'anonymous') {
      const newId = getUserId();
      if (newId && newId !== 'anonymous') {
        currentUserId = newId;
        setUserId(newId);
      } else {
        currentUserId = `user_${Date.now()}`;
        localStorage.setItem('userId', currentUserId);
        setUserId(currentUserId);
      }
    }

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
        user_id: currentUserId,
        style: selectedStyle,
        template: selectedTemplate,
        fontSize: fontSize,
        fontFamily: fontFamily,
        pageSize: pageSize,
        margin: marginSize
      });
      
      setProgress(90);
      setProgressStatus('Generating PDF...');
      
      if (response.data.success) {
        setResult(response.data);
        setUsageInfo({
          used: response.data.usage_count || 0,
          remaining: response.data.remaining_free || 0,
          isPremium: response.data.is_premium || isPremium
        });
        
        if (response.data.is_premium && !isPremium) {
          setIsPremium(true);
          localStorage.setItem('isPremium', 'true');
        }
        
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
        
        saveToHistory(title || 'Document', 'completed', response.data);
        
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
    try {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${result.file}`;
      link.download = result.filename || `${title || 'Document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('PDF downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download PDF');
    }
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
    const template = ADVANCED_TEMPLATES[templateId];
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
    return ADVANCED_PDF_STYLES.find(s => s.id === selectedStyle) || ADVANCED_PDF_STYLES[0];
  };

  const getCurrentTemplate = () => {
    return selectedTemplate ? ADVANCED_TEMPLATES[selectedTemplate] : null;
  };

  // ✅ Handle payment success
  const handlePaymentSuccess = async () => {
    toast.success('🎉 Payment successful!');
    setShowPaymentModal(false);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = await checkPremiumStatus();
    if (result) {
      toast.success('🎉 Premium activated! All 12 tools unlocked for ₹99/month.');
      const id = getUserId();
      try {
        const response = await api.checkPremium(id);
        if (response?.data) {
          setUsageInfo({
            used: 0,
            remaining: 'Unlimited',
            isPremium: true
          });
        }
      } catch (e) {
        console.error('Failed to refresh usage:', e);
      }
    }
  };

  return (
    <>
      {/* Helmet */}
      <Helmet>
        <title>Advanced Text to PDF Generator - Professional PDF Creator | Krynova Technologies</title>
        <meta name="description" content="Professional text to PDF generator with rich text editing, live preview, 8 templates, 8 styles, and advanced formatting. Free users get 5 conversions per day. Premium users get unlimited conversions across all 12 tools." />
        <meta name="keywords" content="text to PDF, advanced text to PDF, rich text to PDF, PDF generator, professional PDF creator, Krynova text to PDF" />
        <link rel="canonical" href={`${siteUrl}/tools/text-to-pdf`} />
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta property="og:title" content="Advanced Text to PDF Generator - Professional PDF Creator" />
        <meta property="og:description" content="Professional text to PDF generator with rich text editing, live preview, and advanced formatting." />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Speakable Content */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Advanced Text to PDF Generator - Krynova Technologies</h2>
        <p>Convert text to professional PDF documents with rich text editing, live preview, and advanced formatting.</p>
        <ul>
          <li>Rich text editing - Bold, Italic, Underline, Strikethrough</li>
          <li>8 professional templates</li>
          <li>8 PDF styles</li>
          <li>Live preview</li>
          <li>Undo/Redo functionality</li>
          <li>Insert tables, dividers, code blocks, blockquotes</li>
          <li>Premium - Unlimited conversions across all 12 tools</li>
        </ul>
        <p>Krynova Technologies is the best text to PDF generator in India.</p>
      </div>

      {/* Main Component */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FaFileAlt className="text-cyan-500" />
              Advanced Text to PDF Generator
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Text to <span className="gradient-text">PDF Generator</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create professional PDF documents with rich text editing, live preview, and advanced formatting.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="text-yellow-400" /> Free: 5/day
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCrown className="text-yellow-500" /> Premium: Unlimited
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <FaMagic className="text-purple-500" /> Rich Editor
              </span>
              <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm">
                <FaEye className="text-cyan-500" /> Live Preview
              </span>
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                <FaGlobe className="text-indigo-500" /> 8 Templates • 8 Styles
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
              <div className="text-sm flex flex-wrap items-center gap-2">
                {usageInfo.isPremium ? (
                  <><FaCrown className="text-yellow-500" /> <span className="font-semibold">Premium:</span> Unlimited • All 12 tools</>
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
                  <FaCrown /> Upgrade — ₹99/month
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
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Editor */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title & Template */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Document Title</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Document title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Template</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg flex items-center justify-between hover:border-cyan-400 transition"
                      >
                        <span className="truncate">
                          {getCurrentTemplate() ? getCurrentTemplate().name : 'Select Template'}
                        </span>
                        <FaChevronDown className={`text-gray-400 transition ${showTemplateDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showTemplateDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-10">
                          {Object.entries(ADVANCED_TEMPLATES).map(([key, template]) => {
                            const Icon = template.icon;
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => applyTemplate(key)}
                                className="w-full px-3 py-2 text-left hover:bg-cyan-50 transition flex items-center gap-2 border-b border-gray-100 last:border-0 text-sm"
                              >
                                <Icon className="text-cyan-500 text-sm" />
                                <div>
                                  <p className="font-medium">{template.name}</p>
                                  <p className="text-xs text-gray-400">{template.category}</p>
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">PDF Style</label>
                  <div className="flex flex-wrap gap-1.5">
                    {safeArray(ADVANCED_PDF_STYLES).map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs transition border ${
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

                {/* Rich Text Editor */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Content *</label>
                  <RichTextEditor 
                    value={text} 
                    onChange={setText} 
                    isPremium={isPremium}
                  />
                </div>

                {/* Premium Toggle */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200 pt-3">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => {
                      setIsPremium(e.target.checked);
                      localStorage.setItem('isPremium', e.target.checked ? 'true' : 'false');
                    }}
                    className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500"
                  />
                  <label className="text-sm text-gray-700 flex items-center gap-1">
                    <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited • All 12 Tools)
                  </label>
                  {!isPremium && (
                    <span className="text-xs text-gray-400 ml-2">
                      (Free: 5/day)
                    </span>
                  )}
                </div>

                {!isPremium && (
                  <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg text-xs text-yellow-700 flex items-center gap-2">
                    <FaInfoCircle />
                    Free: 5 conversions/day. Premium: Unlimited across all 12 tools for ₹99/month.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !text.trim()}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaFilePdf />}
                  {loading ? 'Generating...' : 'Generate PDF'}
                </button>
              </form>
            </div>

            {/* Right: Live Preview */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FaEye className="text-cyan-500" /> Live Preview
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{wordCount} words</span>
                    <span>|</span>
                    <span>{charCount} chars</span>
                  </div>
                </div>
                <LivePreview 
                  text={text} 
                  style={selectedStyle} 
                  template={selectedTemplate}
                />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <p className="text-xs text-gray-400">Style</p>
                  <p className="font-semibold text-gray-700 text-sm">{getCurrentStyle().name}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <p className="text-xs text-gray-400">Template</p>
                  <p className="font-semibold text-gray-700 text-sm truncate">
                    {getCurrentTemplate() ? getCurrentTemplate().name : 'Custom'}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <p className="text-xs text-gray-400">Status</p>
                  <p className={`font-semibold text-sm ${isPremium ? 'text-green-500' : 'text-yellow-500'}`}>
                    {isPremium ? 'Premium' : 'Free'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Result */}
          {result && result.file && (
            <div className="mt-6">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border border-cyan-200">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <p className="font-semibold text-cyan-800">✅ PDF Generated!</p>
                      <p className="text-sm text-cyan-600">{wordCount} words • {charCount} characters</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={downloadFile}
                      className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition flex items-center gap-2 text-sm font-semibold"
                    >
                      <FaDownload /> Download PDF
                    </button>
                    <button
                      onClick={() => {
                        clearText();
                        setResult(null);
                      }}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 text-sm font-semibold"
                    >
                      <FaPlus /> New
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          <div className="mt-6">
            <ConversionHistory history={conversionHistory} onReuse={reuseHistory} />
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaMagic className="text-2xl text-cyan-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">Rich Editor</h4>
              <p className="text-xs text-gray-500">Bold, Italic, Lists & more</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaEye className="text-2xl text-cyan-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">Live Preview</h4>
              <p className="text-xs text-gray-500">See changes in real-time</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaFile className="text-2xl text-cyan-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">8 Templates</h4>
              <p className="text-xs text-gray-500">Professional templates</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <FaPalette className="text-2xl text-cyan-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 text-sm">8 Styles</h4>
              <p className="text-xs text-gray-500">Different fonts & layouts</p>
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
                <h3 className="text-xl font-bold mb-2">🚀 Unlock All 12 Premium Tools</h3>
                <p className="text-cyan-100 mb-4">
                  Get unlimited conversions across all 12 tools, all templates, advanced features, and priority support for just ₹99/month.
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
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        userEmail={localStorage.getItem('userEmail') || ''}
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
        .speakable {
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
        .prose p {
          margin-bottom: 0.25rem;
        }
        .prose h2, .prose h3, .prose h4 {
          margin-top: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .prose ul, .prose ol {
          padding-left: 1.5rem;
          margin-bottom: 0.25rem;
        }
        .prose li {
          margin-bottom: 0.1rem;
        }
        .prose hr {
          margin: 0.5rem 0;
        }
      `}} />
    </>
  );
};

export default TextToPDF;