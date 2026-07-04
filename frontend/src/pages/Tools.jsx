// src/pages/Tools.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaFileAlt, FaPenFancy, FaQrcode, FaFilePdf, 
  FaFileWord, FaFileExcel, FaImage, FaFileArchive,
  FaExchangeAlt, FaFileExport, FaMagic, FaTools,
  FaArrowRight, FaStar, FaLock, FaCheckCircle,
  FaRocket, FaCrown, FaMicrophone, FaComments,
  FaMapPin, FaGlobe
} from 'react-icons/fa';

const Tools = () => {
  // ✅ Get current URL for canonical
  const siteUrl = window.location.origin;

  // ✅ All major Indian cities for GEO targeting
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

  // ✅ Global countries for international reach
  const globalCountries = [
    "USA", "UK", "Canada", "Australia", "UAE", "Singapore", 
    "Germany", "France", "Japan", "South Korea", "Netherlands", 
    "Sweden", "Norway", "Denmark", "Finland", "New Zealand", 
    "Ireland", "Malaysia", "Thailand", "Vietnam", "Indonesia", 
    "Philippines", "South Africa", "Kenya", "Nigeria", "Egypt", 
    "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"
  ];

  const tools = [
    {
      icon: FaFileAlt,
      title: 'ATS Resume Builder',
      description: 'Create professional resumes with multiple templates',
      link: '/tools/resume-builder',
      freeLimit: '3/day',
      popular: true,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: FaPenFancy,
      title: 'Cover Letter Generator',
      description: 'Generate personalized cover letters instantly',
      link: '/tools/cover-letter',
      freeLimit: '3/day',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaQrcode,
      title: 'QR Code Generator',
      description: 'Create custom QR codes for any purpose',
      link: '/tools/qr-generator',
      freeLimit: '5/day',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaFilePdf,
      title: 'PDF to Image',
      description: 'Convert PDF pages to high-quality images',
      link: '/tools/pdf-to-image',
      freeLimit: '3 pages/day',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: FaFileWord,
      title: 'PDF to Word',
      description: 'Convert PDF documents to editable Word files',
      link: '/tools/pdf-to-word',
      freeLimit: '2/day',
      color: 'from-blue-600 to-blue-800'
    },
    {
      icon: FaFileExcel,
      title: 'PDF to Excel',
      description: 'Extract tables from PDF to Excel spreadsheets',
      link: '/tools/pdf-to-excel',
      freeLimit: '2/day',
      color: 'from-green-600 to-green-800'
    },
    {
      icon: FaImage,
      title: 'Image to PDF',
      description: 'Convert multiple images to a single PDF',
      link: '/tools/image-to-pdf',
      freeLimit: '3 images/day',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: FaFileArchive,
      title: 'PDF Compressor',
      description: 'Compress PDF files to reduce file size',
      link: '/tools/pdf-compressor',
      freeLimit: '3/day',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: FaExchangeAlt,
      title: 'Merge PDF',
      description: 'Merge multiple PDFs into one document',
      link: '/tools/merge-pdf',
      freeLimit: '3/day',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: FaFileExport,
      title: 'Split PDF',
      description: 'Split large PDFs into separate files',
      link: '/tools/split-pdf',
      freeLimit: '3/day',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: FaImage,
      title: 'Image Resizer',
      description: 'Resize and optimize images for any use',
      link: '/tools/image-resizer',
      freeLimit: '5/day',
      color: 'from-rose-500 to-red-500'
    },
    {
      icon: FaMagic,
      title: 'Text to PDF',
      description: 'Convert text to professional PDF documents',
      link: '/tools/text-to-pdf',
      freeLimit: '5/day',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  return (
    <>
      {/* ✅ HELMET - SEO + AEO + GEO COMBINED */}
      <Helmet>
        {/* ===== SEO TAGS ===== */}
        <title>12+ Free Online Tools - Resume Builder, PDF Tools, QR Generator | Krynova Technologies | India & Global</title>
        <meta name="description" content="Access 12+ free online tools including ATS Resume Builder, Cover Letter Generator, QR Code Generator, PDF to Image, PDF to Word, PDF Compressor, Merge PDF, Image Resizer, and more. No sign-up required, unlimited usage for premium users. Best free tools in India and worldwide." />
        <meta name="keywords" content="free resume builder, cover letter generator, QR code generator, PDF to image, PDF to word, PDF to excel, image to PDF, PDF compressor, merge PDF, split PDF, image resizer, text to PDF, free online tools India, productivity tools, Krynova tools, global online tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        
        {/* ✅ Canonical Tag */}
        <link rel="canonical" href={`${siteUrl}/tools`} />
        
        {/* ===== GEO TAGS - Local Targeting ===== */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Agra" />
        <meta name="geo.position" content="27.1767;78.0081" />
        <meta name="ICBM" content="27.1767, 78.0081" />
        <meta name="city" content="Agra" />
        <meta name="state" content="Uttar Pradesh" />
        <meta name="country" content="India" />
        <meta name="areaServed" content={indianCities.join(", ")} />
        <meta name="serviceArea" content={`India, ${globalCountries.join(", ")}, Worldwide`} />
        <meta name="coverage" content="Global, National, Local" />
        
        {/* ===== GEO TAGS - All Indian Cities ===== */}
        <meta name="targetedCities" content={indianCities.join(", ")} />
        <meta name="targetedStates" content="Uttar Pradesh, Delhi, Maharashtra, Karnataka, Tamil Nadu, Telangana, West Bengal, Gujarat, Rajasthan, Punjab, Haryana, Madhya Pradesh, Bihar, Odisha, Kerala, Andhra Pradesh, Jharkhand, Chhattisgarh, Uttarakhand, Himachal Pradesh, Goa, Assam, Jammu & Kashmir" />
        <meta name="targetedCountries" content={globalCountries.join(", ")} />
        
        {/* ===== AEO TAGS - Answer Engine Optimization ===== */}
        <meta name="question" content="What free online tools does Krynova Technologies offer?" />
        <meta name="answer" content="Krynova Technologies offers 12+ free online tools including ATS Resume Builder, Cover Letter Generator, QR Code Generator, PDF to Image, PDF to Word, PDF to Excel, Image to PDF, PDF Compressor, Merge PDF, Split PDF, Image Resizer, and Text to PDF." />
        <meta name="faq" content="true" />
        <meta name="speakable" content="true" />
        <meta name="speakable-type" content="text/html" />
        <meta name="speakable-css" content=".speakable" />
        <meta name="voice-search" content="true" />
        <meta name="voice-search-keywords" content="free resume builder, PDF converter, QR generator, online tools, productivity tools India" />
        
        {/* ===== Open Graph ===== */}
        <meta property="og:title" content="12+ Free Online Tools - Resume Builder, PDF Tools & More | Krynova Technologies" />
        <meta property="og:description" content="Boost your productivity with our completely free online tools. Resume Builder, QR Generator, PDF converters, and more. No sign-up required!" />
        <meta property="og:url" content={`${siteUrl}/tools`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Krynova Technologies" />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:locale" content="en_IN" />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="12+ Free Online Tools - Resume Builder, PDF Tools & More | Krynova Technologies" />
        <meta name="twitter:description" content="Access 12+ free online tools. Resume Builder, QR Generator, PDF converters, and more. No sign-up required!" />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />
      </Helmet>

      {/* ✅ AEO SPEAKABLE CONTENT */}
      <div className="speakable sr-only" aria-hidden="true">
        <h2>Krynova Technologies Free Online Tools</h2>
        <p>Access 12+ free online tools including ATS Resume Builder, Cover Letter Generator, QR Code Generator, PDF to Image, PDF to Word, PDF Compressor, Merge PDF, Image Resizer, and more. No sign-up required.</p>
        <ul>
          <li>ATS Resume Builder - Create professional resumes</li>
          <li>Cover Letter Generator - Personalized cover letters</li>
          <li>QR Code Generator - Custom QR codes</li>
          <li>PDF to Image - Convert PDF to images</li>
          <li>PDF to Word - Convert PDF to editable Word</li>
          <li>PDF Compressor - Compress PDF files</li>
          <li>Merge PDF - Combine multiple PDFs</li>
          <li>Image Resizer - Resize images</li>
        </ul>
        <p>Free tools for users in Agra, Delhi, Mumbai, Bangalore, all Indian cities, and globally.</p>
      </div>

      {/* ✅ Schema.org - Tool Collection with Global Scope */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Krynova Technologies Free Online Tools",
          "description": "Collection of 12+ free online tools including Resume Builder, Cover Letter Generator, QR Code Generator, PDF converters, and more.",
          "url": `${siteUrl}/tools`,
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
          "offers": {
            "@type": "Offer",
            "description": "Free tools with daily limits. Premium upgrade available for unlimited access.",
            "price": "0",
            "priceCurrency": "INR"
          },
          "audience": {
            "@type": "Audience",
            "name": "Businesses and Professionals Worldwide",
            "geographicArea": {
              "@type": "AdministrativeArea",
              "name": `India, ${globalCountries.join(", ")}, Worldwide`
            }
          },
          "inLanguage": ["en", "hi", "bn", "te", "ta", "ur", "gu", "mr", "kn", "ml", "pa"],
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ".speakable"
          }
        })}
      </script>
      
      {/* ✅ FAQ Schema - AEO Focus */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What free tools does Krynova Technologies offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies offers 12+ free online tools including ATS Resume Builder, Cover Letter Generator, QR Code Generator, PDF to Image, PDF to Word, PDF to Excel, Image to PDF, PDF Compressor, Merge PDF, Split PDF, Image Resizer, and Text to PDF. Available to users in India and worldwide."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to sign up to use these free tools?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No sign-up is required! All tools are completely free to use with daily limits. Premium users get unlimited access. Available for users in Agra, Delhi, Mumbai, Bangalore, and all cities."
              }
            },
            {
              "@type": "Question",
              "name": "Which is the best free resume builder in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Krynova Technologies' ATS Resume Builder is one of the best free resume builders available in India. It creates professional, ATS-optimized resumes with multiple templates."
              }
            },
            {
              "@type": "Question",
              "name": "Are these tools available globally?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! Our free online tools are available globally. Users from USA, UK, Canada, Australia, UAE, and over 30+ countries use our tools daily."
              }
            }
          ]
        })}
      </script>

      {/* ✅ Main Content */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-green-200">
              <FaTools className="text-green-500" />
              12 Free Online Tools
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Free <span className="gradient-text">Productivity Tools</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Boost your productivity with our completely free online tools. 
              No sign-up required, unlimited usage for premium users!
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                <FaMapPin className="text-blue-500" /> {indianCities.length}+ Indian Cities
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                <FaGlobe className="text-green-500" /> {globalCountries.length}+ Countries
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                <FaMicrophone className="text-purple-500" /> Voice Search Ready
              </span>
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                <FaComments className="text-orange-500" /> FAQ Optimized
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FaStar className="text-yellow-400" /> Free daily limits
              </span>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaLock className="text-green-500" /> Premium: Unlimited
              </span>
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <FaCheckCircle className="text-purple-500" /> No sign-up required
              </span>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={index}
                  to={tool.link}
                  className={`group bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    tool.popular 
                      ? 'border-blue-600 shadow-xl relative' 
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {tool.popular && (
                    <div className="absolute -top-3 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaRocket className="text-xs" /> Popular
                    </div>
                  )}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">{tool.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      Free: {tool.freeLimit}
                    </span>
                    <span className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      Use Tool <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Premium CTA - Global & Local */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <FaCrown className="text-5xl text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Go Premium for Unlimited Access
              </h2>
              <p className="text-blue-100 mb-6 text-lg">
                Remove all limits and get unlimited access to all 12 tools.
                Perfect for professionals and businesses!
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                  <FaMapPin /> {indianCities.length}+ Indian Cities
                </span>
                <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs">
                  <FaGlobe /> {globalCountries.length}+ Countries
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact?upgrade=premium"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Upgrade Now <FaArrowRight />
                </Link>
              </div>
              <p className="text-blue-200 text-sm mt-4">
                Starting from ₹499/month • Cancel anytime • All features included
              </p>
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
        `}} />
      </div>
    </>
  );
};

export default Tools;