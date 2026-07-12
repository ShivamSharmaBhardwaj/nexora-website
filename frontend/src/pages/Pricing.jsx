// src/pages/Pricing.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FaCheck, FaCrown, FaRocket, FaStar, 
  FaArrowRight, FaLock, FaGem, FaInfinity,
  FaShieldAlt, FaCloudUploadAlt, FaBolt,
  FaHeadset
} from 'react-icons/fa';
import PaymentModal from '../components/PaymentModal';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const siteUrl = window.location.origin;

  const monthlyPrice = 99;
  const yearlyPrice = 999;
  
  const features = [
    'Unlimited access to all 12 tools',
    'No daily usage limits',
    'Priority processing speed',
    'Export in multiple formats',
    'Advanced customization options',
    'Premium templates and designs',
    'Dedicated customer support',
    'Cloud storage for your files',
    'No watermarks or branding',
    'Team collaboration features',
    'Advanced analytics & insights',
    'Early access to new features'
  ];

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <>
      <Helmet>
        <title>Premium Plans - Unlimited Access to All Tools | Krynova Technologies</title>
        <meta name="description" content="Upgrade to Krynova Premium for unlimited access to all 12 tools. Monthly ₹99/month or Yearly ₹999/year. Cancel anytime. Best value for professionals and businesses in India." />
        <meta name="keywords" content="premium tools, unlimited access, productivity tools, Krynova premium, best value tools India, professional tools" />
        <link rel="canonical" href={`${siteUrl}/pricing`} />
        
        <meta property="og:title" content="Premium Plans - Unlimited Access to All Tools | Krynova Technologies" />
        <meta property="og:description" content="Get unlimited access to all 12 tools. Monthly ₹99 or Yearly ₹999. Best value for professionals!" />
        <meta property="og:url" content={`${siteUrl}/pricing`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-badge px-6 py-3 rounded-full text-sm font-medium mb-4 border border-white/20 backdrop-blur-md bg-white/30 shadow-xl">
              <FaCrown className="text-yellow-500" />
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-bold">
                Premium Plans
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="gradient-text">Premium Plan</span>
            </h1>
            
            <div className="glass-card inline-block px-8 py-4 rounded-2xl backdrop-blur-lg bg-white/40 border border-white/30 shadow-xl max-w-2xl mx-auto">
              <p className="text-gray-700 text-lg font-medium">
                Get unlimited access to all 12 tools. Perfect for professionals and businesses!
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-16 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 p-1 transition-all duration-300 shadow-lg"
              >
                <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-all duration-300 ${
                  isYearly ? 'right-1' : 'left-1'
                }`}></div>
              </button>
              <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  Save 16%
                </span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="relative group">
              <div className="glass-tool-card rounded-2xl p-8 backdrop-blur-xl bg-white/40 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="text-center">
                  <div className="inline-block p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-4">
                    <FaRocket className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Monthly Plan</h3>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gray-900">₹99</span>
                    <span className="text-gray-500 text-sm ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">Perfect for short-term projects</p>
                </div>

                <ul className="mt-6 space-y-3">
                  {features.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade('monthly')}
                  className="w-full mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  <FaGem className="text-yellow-300" />
                  Upgrade Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Yearly Plan - Featured */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative glass-tool-card rounded-2xl p-8 backdrop-blur-xl bg-white/80 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <div className="absolute -top-3 right-4 glass-popular px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md bg-gradient-to-r from-yellow-500 to-orange-500 border border-white/30 shadow-lg shadow-yellow-500/30">
                  <FaStar className="text-white text-[10px]" />
                  <span className="text-white">Best Value</span>
                </div>

                <div className="text-center">
                  <div className="inline-block p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white mb-4">
                    <FaCrown className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Yearly Plan</h3>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gray-900">₹999</span>
                    <span className="text-gray-500 text-sm ml-1">/year</span>
                  </div>
                  <p className="text-green-600 text-sm font-semibold mt-2">
                    Save ₹189 compared to monthly
                  </p>
                </div>

                <ul className="mt-6 space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                      <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade('yearly')}
                  className="w-full mt-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  <FaBolt className="text-yellow-200" />
                  Upgrade to Yearly
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: FaInfinity, title: 'Unlimited Usage', desc: 'No daily limits on any tool' },
                { icon: FaBolt, title: 'Lightning Fast', desc: 'Priority processing speed' },
                { icon: FaShieldAlt, title: 'Secure & Private', desc: 'Your data is completely safe' },
                { icon: FaHeadset, title: '24/7 Support', desc: 'Dedicated customer support' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="glass-stat p-6 rounded-xl backdrop-blur-md bg-white/40 border border-white/30 shadow-lg text-center hover:scale-105 transition-all duration-300">
                    <div className="inline-block p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white mb-3">
                      <Icon className="text-2xl" />
                    </div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Can I cancel my subscription anytime?',
                  a: 'Yes! You can cancel your premium subscription anytime. No questions asked.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit/debit cards, UPI, Net Banking, and PayPal via Razorpay.'
                },
                {
                  q: 'Is there a free trial available?',
                  a: 'You can try all tools for free with daily limits. Upgrade anytime for unlimited access.'
                },
                {
                  q: 'Can I switch between monthly and yearly plans?',
                  a: 'Yes, you can switch plans anytime. Contact our support for assistance.'
                }
              ].map((faq, index) => (
                <div key={index} className="glass-card p-6 rounded-xl backdrop-blur-md bg-white/40 border border-white/30 shadow-lg">
                  <h4 className="font-bold text-gray-900">{faq.q}</h4>
                  <p className="text-gray-600 mt-2">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <FaCheck className="text-green-500" /> Trusted by 1000+ users
              </span>
              <span className="flex items-center gap-2">
                <FaLock className="text-green-500" /> Secure payments via Razorpay
              </span>
              <span className="flex items-center gap-2">
                <FaCloudUploadAlt className="text-green-500" /> 30-day money-back guarantee
              </span>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          userEmail={localStorage.getItem('userEmail') || undefined}
          userId={localStorage.getItem('userId') || undefined}
          onSuccess={(data) => {
            console.log('Payment success:', data);
            toast.success('🎉 Welcome to Premium!');
            setShowPaymentModal(false);
          }}
        />

        <style dangerouslySetInnerHTML={{ __html: `
          .gradient-text {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 200% 200%;
            animation: gradient-shift 3s ease-in-out infinite;
          }
          
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .glass-badge {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          }
          
          .glass-card {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.35);
            border: 1px solid rgba(255, 255, 255, 0.25);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
          }
          
          .glass-tool-card {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          
          .glass-stat {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
          }
          
          .glass-stat:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
          }
          
          .glass-popular {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            animation: pulse-soft 2s ease-in-out infinite;
          }
          
          @keyframes pulse-soft {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
        `}} />
      </div>
    </>
  );
};

export default Pricing;