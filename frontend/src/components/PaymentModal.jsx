// src/components/PaymentModal.jsx
import React, { useState, useEffect } from 'react';
import { FaCrown, FaTimes, FaCheck, FaSpinner, FaArrowRight, FaShieldAlt, FaRocket, FaInfinity } from 'react-icons/fa';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, userEmail, userId, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user data if not provided
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.getProfile();
          setUser(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    
    if (!userEmail && !userId) {
      fetchUser();
    }
  }, [userEmail, userId]);

  const plans = {
    monthly: {
      id: 'monthly',
      name: 'Monthly',
      price: '₹99',
      priceAmount: 9900, // in paise for Razorpay
      description: 'Perfect for getting started',
      features: [
        'Unlimited resume generation',
        'All 6 professional templates',
        'Unlimited cover letters',
        'Unlimited QR codes',
        'Unlimited PDF conversions',
        'Priority support',
        'Cancel anytime'
      ],
      popular: false,
      savings: ''
    },
    yearly: {
      id: 'yearly',
      name: 'Yearly',
      price: '₹999',
      priceAmount: 99900, // in paise for Razorpay
      description: 'Best value - Save 16%',
      features: [
        'Everything in Monthly',
        '2 months free',
        'Priority support',
        'Early access to new features',
        'Premium templates',
        'Team collaboration (coming soon)'
      ],
      popular: true,
      savings: 'Save ₹189'
    }
  };

  // ✅ FIXED: Direct Razorpay - No Stripe fallback
  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    
    // Get user info
    const email = userEmail || user?.email || 'user@example.com';
    const uid = userId || user?.id || 'anonymous';
    const name = user?.name || 'User';
    
    try {
      // ✅ Use Razorpay directly
      const response = await api.createRazorpayOrder({
        plan: selectedPlan,
        email: email,
        user_id: uid,
        name: name,
        amount: plans[selectedPlan].priceAmount,
        plan_name: plans[selectedPlan].name
      });
      
      if (response.data.success) {
        // ✅ Open Razorpay payment modal
        await handleRazorpayPayment(response.data, email, name);
      } else {
        setError('Failed to initiate payment. Please try again.');
        toast.error('Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.error || 'Payment service unavailable. Please try again later.');
      toast.error('Payment service unavailable');
    } finally {
      setLoading(false);
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = (data, email, name) => {
    return new Promise((resolve, reject) => {
      try {
        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: data.currency || 'INR',
          name: 'Krynova Technologies',
          description: `${plans[selectedPlan].name} Premium Plan`,
          order_id: data.order_id,
          prefill: {
            name: name,
            email: email,
          },
          handler: async function (response) {
            // Verify payment
            try {
              const verifyRes = await api.verifyRazorpayPayment({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                user_id: userId || user?.id || 'anonymous'
              });
              
              if (verifyRes.data.success) {
                toast.success('🎉 Payment successful! Premium activated.');
                if (onSuccess) {
                  onSuccess(verifyRes.data);
                }
                onClose();
                resolve(true);
              } else {
                toast.error('Payment verification failed. Please contact support.');
                reject(new Error('Verification failed'));
              }
            } catch (err) {
              console.error('Verification error:', err);
              toast.error('Payment verification failed');
              reject(err);
            }
          },
          modal: {
            ondismiss: function() {
              toast.error('Payment cancelled');
              reject(new Error('Payment cancelled'));
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (err) {
        console.error('Razorpay error:', err);
        toast.error('Failed to initialize payment');
        reject(err);
      }
    });
  };

  // Load Razorpay script
  useEffect(() => {
    if (isOpen) {
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPlan = plans[selectedPlan];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
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
            Get unlimited access to all tools and features with our premium plans
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
                    ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Best Value
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  {plan.savings && (
                    <span className="text-xs text-green-600 font-semibold">{plan.savings}</span>
                  )}
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">/{key === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{plan.description}</p>
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
                  {selectedPlan === key ? '✓ Selected' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-2">
              🔒 Secure payment powered by
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">Razorpay</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-semibold text-gray-700">UPI</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-semibold text-gray-700">Card</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-semibold text-gray-700">Net Banking</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <FaTimes className="text-red-500" />
              {error}
            </div>
          )}

          {/* Upgrade Button */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <><FaSpinner className="animate-spin" /> Processing...</>
            ) : (
              <>
                <FaRocket />
                Upgrade to {currentPlan.name} — {currentPlan.price}
              </>
            )}
          </button>

          {/* Trust Badges */}
          <div className="mt-4 flex items-center justify-center gap-6 flex-wrap text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FaShieldAlt className="text-green-500" /> 30-Day Money-Back Guarantee
            </span>
            <span className="flex items-center gap-1">
              <FaInfinity className="text-blue-500" /> Cancel Anytime
            </span>
            <span className="flex items-center gap-1">
              <FaCheck className="text-green-500" /> No Hidden Fees
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;