// src/pages/tools/CoverLetterGenerator.jsx
import React, { useState, useMemo } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaFileAlt, 
  FaCheckCircle, FaCircle, FaTimes, FaTrash, FaPlus,
  FaCrown, FaRocket, FaShieldAlt, FaPenFancy,
  FaUser, FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaBuilding, FaGlobe, FaArrowRight, FaCopy, FaPrint,
  FaEye, FaEyeSlash, FaMagic, FaPalette
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

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
// COVER LETTER PREVIEW
// ============================================

const CoverLetterPreview = ({ data, template }) => {
  const templates = {
    professional: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200',
      header: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6',
      body: 'p-6',
      signature: 'mt-4 pt-4 border-t border-gray-200 text-gray-700'
    },
    modern: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-purple-200',
      header: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6',
      body: 'p-6',
      signature: 'mt-4 pt-4 border-t border-purple-200 text-gray-700'
    },
    creative: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border-2 border-orange-200',
      header: 'bg-gradient-to-r from-orange-500 to-red-500 text-white p-6',
      body: 'p-6',
      signature: 'mt-4 pt-4 border-t border-orange-200 text-gray-700'
    },
    minimal: {
      container: 'bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200',
      header: 'bg-gray-800 text-white p-6',
      body: 'p-6',
      signature: 'mt-4 pt-4 border-t border-gray-200 text-gray-700'
    }
  };

  const styles = templates[template.id] || templates.professional;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className="text-2xl font-bold">{data.name || 'Your Name'}</h2>
        <div className="flex flex-wrap gap-3 mt-2 text-sm opacity-80">
          {data.email && <span className="flex items-center gap-1"><FaEnvelope className="text-xs" /> {data.email}</span>}
          {data.phone && <span className="flex items-center gap-1"><FaPhone className="text-xs" /> {data.phone}</span>}
          {data.location && <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-xs" /> {data.location}</span>}
        </div>
      </div>

      <div className={styles.body}>
        {/* Date */}
        <p className="text-gray-500 text-sm mb-4">
          {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        {/* Company */}
        {data.company && (
          <div className="mb-4">
            <p className="font-semibold text-gray-900">Hiring Manager</p>
            <p className="text-gray-700">{data.company}</p>
          </div>
        )}

        {/* Salutation */}
        <p className="text-gray-700 mb-3">Dear Hiring Manager,</p>

        {/* Body */}
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

        {/* Closing */}
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
        is_premium: formData.is_premium
      };
      
      const response = await api.generateCoverLetter(payload);
      
      if (response.data.success) {
        setResult(response.data.cover_letter);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        toast.success('🎉 Cover letter generated successfully!');
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
      } else {
        toast.error(error.response?.data?.error || 'Failed to generate cover letter');
      }
    } finally {
      setLoading(false);
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
    window.location.href = '/contact?upgrade=premium';
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
        experience: 'With 5+ years of full-stack development experience, I have successfully delivered 10+ enterprise applications. I specialize in building scalable web solutions using modern technologies like React, Node.js, and cloud platforms.'
      }
    },
    { 
      label: 'Marketing Professional', 
      data: {
        position: 'Digital Marketing Manager',
        company: 'Brand Solutions Agency',
        skills: 'SEO, Social Media Marketing, Content Strategy, Analytics, PPC',
        experience: 'I have 4+ years of experience in digital marketing, managing campaigns for 20+ clients across various industries. I have increased organic traffic by 150% and improved conversion rates by 40%.'
      }
    },
    { 
      label: 'Data Analyst', 
      data: {
        position: 'Senior Data Analyst',
        company: 'Data Insights Corporation',
        skills: 'Python, SQL, Tableau, Excel, Machine Learning',
        experience: 'I have 3+ years of experience in data analysis and business intelligence. I have helped companies make data-driven decisions by creating interactive dashboards and predictive models.'
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
            Create professional cover letters that stand out to recruiters and hiring managers
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-400" /> Free: 3/day
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaLock className="text-green-500" /> Premium: Unlimited
            </span>
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              <FaPalette className="text-purple-500" /> 4 Templates
            </span>
          </div>
        </div>

        {/* Usage Info */}
        {usageInfo && (
          <div className={`mb-6 p-4 rounded-lg flex flex-wrap items-center justify-between ${
            usageInfo.remaining > 0 ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className="text-sm">
              {usageInfo.isPremium ? (
                <span className="flex items-center gap-2"><FaCrown className="text-yellow-500" /> Premium: Unlimited access</span>
              ) : (
                `${usageInfo.used} used today • ${usageInfo.remaining} free remaining`
              )}
            </p>
            {!usageInfo.isPremium && usageInfo.remaining === 0 && (
              <button
                onClick={handleUpgrade}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
              >
                Upgrade Now
              </button>
            )}
          </div>
        )}

        {/* Template Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaPalette className="text-purple-600" /> Choose Template
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(TEMPLATES).map(([key, template]) => {
              const isSelected = selectedTemplate === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`group px-4 py-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${
                    isSelected 
                      ? 'border-purple-600 bg-purple-50 shadow-md' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${template.preview} flex items-center justify-center text-white`}>
                    <FaPenFancy className="text-lg" />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-sm ${isSelected ? 'text-purple-600' : 'text-gray-700'}`}>
                      {template.name}
                    </p>
                    <p className="text-xs text-gray-500 hidden md:block">{template.description}</p>
                  </div>
                  {isSelected && <FaCheckCircle className="text-purple-600 text-sm ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Quick Examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => fillExample(example.data)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 rounded-lg text-xs transition border border-gray-200 hover:border-purple-300"
              >
                <FaMagic className="inline mr-1 text-purple-500" />
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
                <button
                  onClick={() => setActiveTab('form')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'form' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaFileAlt className="inline mr-1" /> Form
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'preview' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaEye className="inline mr-1" /> Preview
                </button>
              </div>
            </div>

            {activeTab === 'form' ? (
              <form onSubmit={handleSubmit} className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-purple-500" /> Personal Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        placeholder="Agra, India"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
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
                      <input
                        type="text"
                        name="position"
                        placeholder="Full Stack Developer"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Company *</label>
                      <input
                        type="text"
                        name="company"
                        placeholder="Tech Innovations Inc."
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Skills & Experience */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaPenFancy className="text-purple-500" /> Skills & Experience
                  </h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Skills (comma separated) *</label>
                    <input
                      type="text"
                      name="skills"
                      placeholder="React, Python, Project Management"
                      value={formData.skills}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                    {skillsArray.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {skillsArray.map((skill, idx) => (
                          <span key={idx} className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Experience (optional)</label>
                    <textarea
                      name="experience"
                      rows="3"
                      placeholder="5+ years of experience in full-stack development, leading teams of 10+ engineers..."
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                    />
                  </div>
                </div>

                {/* Premium Toggle */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                  <input
                    type="checkbox"
                    name="is_premium"
                    checked={formData.is_premium}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label className="text-sm text-gray-700 flex items-center gap-1">
                    <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited + All Templates)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaPenFancy />}
                  {loading ? 'Generating...' : 'Generate Cover Letter'}
                </button>
              </form>
            ) : (
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                <CoverLetterPreview data={formData} template={currentTemplate} />
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
            
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <CoverLetterPreview data={formData} template={currentTemplate} />
            </div>

            {result && (
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                >
                  <FaDownload /> Download
                </button>
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                >
                  <FaCopy /> Copy
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-gray-600 text-white py-2.5 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 text-sm font-semibold"
                >
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
            <p className="text-purple-100 mb-4">
              Get unlimited cover letter generation, access to all templates, and priority support.
            </p>
            <button
              onClick={handleUpgrade}
              className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5"
            >
              Upgrade Now — ₹499/month
            </button>
          </div>
        </div>
      </div>

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
        @media print {
          .no-print { display: none !important; }
          .print-preview { background: white !important; box-shadow: none !important; }
        }
      `}} />
    </div>
  );
};

export default CoverLetterGenerator;