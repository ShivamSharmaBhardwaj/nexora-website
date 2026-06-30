// src/components/PaymentModal.jsx
import React, { useState } from 'react';
import { FaCrown, FaTimes, FaCheck, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, userEmail, userId }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const plans = {
    monthly: {
      id: 'monthly',
      name: 'Monthly',
      price: '₹499',
      features: [
        'Unlimited resume generation',
        'All 6 professional templates',
        'Unlimited cover letters',
        'Unlimited QR codes',
        'Priority support',
        'Cancel anytime'
      ],
      popular: false
    },
    yearly: {
      id: 'yearly',
      name: 'Yearly',
      price: '₹4,999',
      features: [
        'Everything in Monthly',
        '2 months free',
        'Priority support',
        'Early access to new features',
        'Premium templates'
      ],
      popular: true
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.createCheckoutSession({
        plan: selectedPlan,
        email: userEmail || 'user@example.com',
        user_id: userId || 'anonymous'
      });
      
      if (response.data.success) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkout_url;
      } else {
        setError('Failed to initiate payment. Please try again.');
        toast.error('Payment initiation failed');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      setError(error.response?.data?.error || 'Payment service unavailable. Please try again later.');
      toast.error('Payment service unavailable');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes className="text-2xl" />
        </button>

        {/* Header */}
        <div className="text-center pt-8 px-6">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaCrown className="text-yellow-500" />
            Premium Upgrade
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Unlock All Features
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Choose the plan that works best for you and take your productivity to the next level
          </p>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                onClick={() => setSelectedPlan(key)}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPlan === key
                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">/{key === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(key)}
                  className={`w-full py-2.5 rounded-lg font-semibold transition ${
                    selectedPlan === key
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPlan === key ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Upgrade Button */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><FaSpinner className="animate-spin" /> Processing...</>
            ) : (
              <><FaArrowRight /> Proceed to Payment</>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 Secure payment powered by Stripe • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;