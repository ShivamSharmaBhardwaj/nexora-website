// src/pages/tools/ResumeBuilder.jsx
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  FaSpinner, FaDownload, FaStar, FaLock, FaPalette, FaPrint, 
  FaShare, FaCopy, FaEye, FaEyeSlash, FaFileAlt, FaUser, 
  FaBriefcase, FaGraduationCap, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaCheckCircle, FaCircle, FaArrowRight, 
  FaTools, FaCrown, FaFilePdf, FaTimes, FaPlus,
  FaRegFileAlt, FaRegFilePdf, FaRegFileWord, FaRegFileExcel
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';

// ============================================
// TEMPLATES CONFIGURATION
// ============================================

const TEMPLATES = {
  modern: {
    id: 'modern',
    name: 'Modern',
    icon: FaFileAlt,
    description: 'Clean, professional design with a modern touch',
    preview: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    primaryColor: 'blue-600',
    secondaryColor: 'gray-100',
    accentColor: 'blue-100',
    fontFamily: 'Inter'
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
    fontFamily: 'Georgia'
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
    fontFamily: 'Arial'
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
    fontFamily: 'Poppins'
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
    fontFamily: 'Times New Roman'
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
    fontFamily: 'Consolas'
  },
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
  };

  const styles = templateStyles[template.id] || templateStyles.modern;

  const skillsArray = useMemo(() => {
    if (typeof data.skills === 'string') {
      return data.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    return data.skills || [];
  }, [data.skills]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className="text-2xl font-bold">{data.name || 'Your Name'}</h2>
        <p className="text-sm opacity-90">{data.title || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-3 mt-2 text-sm opacity-80">
          {data.email && <span className="flex items-center gap-1"><FaEnvelope className="text-xs" /> {data.email}</span>}
          {data.phone && <span className="flex items-center gap-1"><FaPhone className="text-xs" /> {data.phone}</span>}
          {data.location && <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-xs" /> {data.location}</span>}
        </div>
      </div>

      <div className="p-4">
        {/* Summary */}
        {data.summary && (
          <div className="mb-3">
            <h3 className={`${styles.title}`}>Professional Summary</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Skills */}
        {skillsArray.length > 0 && (
          <div className="mb-3">
            <h3 className={`${styles.title}`}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience && (
          <div className="mb-3">
            <h3 className={`${styles.title}`}>Experience</h3>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {data.experience}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && (
          <div>
            <h3 className={`${styles.title}`}>Education</h3>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {data.education}
            </div>
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
  const printRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
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
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        ...formData,
        skills: skillsArray,
        template: selectedTemplate,
        is_premium: formData.is_premium
      };
      
      const response = await api.buildResume(payload);
      
      if (response.data.success) {
        setGeneratedResume(response.data.resume);
        setUsageInfo({
          used: response.data.usage_count,
          remaining: response.data.remaining_free,
          isPremium: response.data.is_premium
        });
        toast.success('🎉 Resume generated successfully!');
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
    window.location.href = '/contact?upgrade=premium';
  };

  const currentTemplate = TEMPLATES[selectedTemplate] || TEMPLATES.modern;

  const skillsArray = useMemo(() => {
    return formData.skills.split(',').map(s => s.trim()).filter(Boolean);
  }, [formData.skills]);

  return (
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
            Choose from 6 professional templates and build an ATS-friendly resume that gets noticed
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <FaStar className="text-yellow-400" /> Free: 3/day
            </span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              <FaLock className="text-green-500" /> Premium: Unlimited
            </span>
            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              <FaPalette className="text-purple-500" /> 6 Templates
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
                <span className="flex items-center gap-2"><FaCrown className="text-yellow-500" /> Premium: Unlimited access to all templates</span>
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
            <FaPalette className="text-blue-600" /> Choose Your Template
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(TEMPLATES).map(([key, template]) => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`group px-4 py-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${template.preview} flex items-center justify-center text-white`}>
                    <Icon className="text-lg" />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold text-sm ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                      {template.name}
                    </p>
                    <p className="text-xs text-gray-500 hidden md:block">{template.description}</p>
                  </div>
                  {isSelected && <FaCheckCircle className="text-blue-600 text-sm ml-1" />}
                </button>
              );
            })}
          </div>
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
                <button
                  onClick={() => setActiveTab('form')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'form' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaFileAlt className="inline mr-1" /> Form
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'preview' 
                      ? 'bg-blue-600 text-white shadow-md' 
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
                    <FaUser className="text-blue-500" /> Personal Information
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
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Professional Title</label>
                      <input
                        type="text"
                        name="title"
                        placeholder="Full Stack Developer"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
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
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        placeholder="Agra, India"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaBriefcase className="text-blue-500" /> Professional Summary
                  </h4>
                  <textarea
                    name="summary"
                    rows="3"
                    placeholder="Experienced professional with 5+ years in web development, specializing in React and Node.js..."
                    value={formData.summary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  />
                </div>

                {/* Skills */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaTools className="text-blue-500" /> Skills *
                  </h4>
                  <input
                    type="text"
                    name="skills"
                    placeholder="React, Python, SQL, AWS, Docker"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {skillsArray.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {skillsArray.map((skill, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
                </div>

                {/* Experience */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaBriefcase className="text-blue-500" /> Experience
                  </h4>
                  <textarea
                    name="experience"
                    rows="4"
                    placeholder="Senior Developer at XYZ Corp (2020-2024)&#10;• Led team of 5 developers&#10;• Built scalable web applications serving 1M+ users"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  />
                </div>

                {/* Education */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaGraduationCap className="text-blue-500" /> Education
                  </h4>
                  <textarea
                    name="education"
                    rows="3"
                    placeholder="B.Tech in Computer Science, IIT Delhi (2016-2020)&#10;• GPA: 8.5/10"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  />
                </div>

                {/* Premium Toggle */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                  <input
                    type="checkbox"
                    name="is_premium"
                    checked={formData.is_premium}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700 flex items-center gap-1">
                    <FaCrown className="text-yellow-500" /> Premium Mode (Unlimited + All Templates)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaFileAlt />}
                  {loading ? 'Generating...' : 'Generate Resume'}
                </button>
              </form>
            ) : (
              <div className="max-h-[600px] overflow-y-auto">
                <ResumePreview data={formData} template={currentTemplate} />
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
              </div>
            </div>
            
            <div ref={printRef} className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <ResumePreview data={formData} template={currentTemplate} />
            </div>

            {generatedResume && (
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
                >
                  <FaDownload /> Download Resume
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
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <FaCrown className="text-4xl text-yellow-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">🚀 Unlock Premium Features</h3>
            <p className="text-blue-100 mb-4">
              Get unlimited resume generation, access to all 6 templates, and priority support.
            </p>
            <button
              onClick={handleUpgrade}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition hover:-translate-y-0.5"
            >
              Upgrade Now — ₹499/month
            </button>
          </div>
        </div>
      </div>

      {/* CSS */}
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

export default ResumeBuilder;