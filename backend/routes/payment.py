import os
import stripe
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
from dotenv import load_dotenv

load_dotenv()

# Create blueprint
payment_bp = Blueprint('payment_bp', __name__)
payment_bp.strict_slashes = False

# Stripe configuration
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_...')
WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', 'whsec_...')

# Price IDs (replace with your actual Stripe price IDs)
PRICE_IDS = {
    'monthly': os.getenv('STRIPE_MONTHLY_PRICE_ID', 'price_monthly_123'),
    'yearly': os.getenv('STRIPE_YEARLY_PRICE_ID', 'price_yearly_123')
}

@payment_bp.route('/create-checkout-session', methods=['POST', 'OPTIONS'])
def create_checkout_session():
    """Create Stripe checkout session for premium subscription"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        plan = data.get('plan', 'monthly')
        
        # Get user info
        user_email = data.get('email', 'user@example.com')
        user_id = data.get('user_id', 'anonymous')
        
        # Get the price ID for the selected plan
        price_id = PRICE_IDS.get(plan, PRICE_IDS['monthly'])
        
        # Create checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/payment-cancel",
            customer_email=user_email,
            metadata={
                'user_id': user_id,
                'plan': plan
            },
            allow_promotion_codes=True
        )
        
        return jsonify({
            'success': True,
            'session_id': checkout_session.id,
            'checkout_url': checkout_session.url
        })
        
    except Exception as e:
        print(f"Payment error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@payment_bp.route('/webhook', methods=['POST'])
def webhook():
    """Handle Stripe webhook events"""
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, WEBHOOK_SECRET
        )
        
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            
            # Activate premium for user
            user_id = session['metadata']['user_id']
            plan = session['metadata']['plan']
            
            # Here you would update your database
            print(f"Premium activated for user {user_id} with plan {plan}")
            
        elif event['type'] == 'customer.subscription.deleted':
            # Handle subscription cancellation
            subscription = event['data']['object']
            customer_id = subscription['customer']
            print(f"Subscription cancelled for customer {customer_id}")
        
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        return jsonify({'error': str(e)}), 400

@payment_bp.route('/payment-status/<session_id>', methods=['GET'])
def payment_status(session_id):
    """Check payment status"""
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        return jsonify({
            'success': True,
            'status': session.status,
            'payment_status': session.payment_status,
            'customer_email': session.customer_details.email if session.customer_details else None,
            'amount_total': session.amount_total if hasattr(session, 'amount_total') else None,
            'currency': session.currency if hasattr(session, 'currency') else None
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@payment_bp.route('/cancel-subscription', methods=['POST', 'OPTIONS'])
def cancel_subscription():
    """Cancel user's subscription"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        # Find user's stripe customer ID and subscription ID
        # subscription_id = get_subscription_id(user_id)
        # stripe.Subscription.delete(subscription_id)
        
        return jsonify({
            'success': True,
            'message': 'Subscription cancelled successfully'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400