# backend/routes/payment_routes.py
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
import razorpay
import hmac
import hashlib
import json
import time
from datetime import datetime, timedelta
from config import get_db, PLANS, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

payment_bp = Blueprint('payment', __name__, url_prefix='/api')

# Initialize Razorpay client
def get_razorpay_client():
    try:
        return razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    except Exception as e:
        print(f"⚠️ Razorpay client error: {e}")
        return None

@payment_bp.route('/create-razorpay-order', methods=['POST'])
@cross_origin()
def create_order():
    """Create Razorpay order for payment"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['plan', 'email', 'user_id']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        plan_id = data.get('plan')
        email = data.get('email')
        user_id = data.get('user_id')
        name = data.get('name', 'User')
        
        # Get plan details
        plan = PLANS.get(plan_id)
        if not plan:
            return jsonify({
                'success': False,
                'error': 'Invalid plan selected'
            }), 400
        
        # Get Razorpay client
        client = get_razorpay_client()
        if not client:
            return jsonify({
                'success': False,
                'error': 'Payment service unavailable'
            }), 503
        
        # Create Razorpay order
        receipt = f"receipt_{user_id}_{plan_id}_{int(time.time())}"
        notes = {
            'user_id': str(user_id),
            'plan': plan_id,
            'email': email,
            'name': name
        }
        
        order_data = {
            'amount': plan['amount'],
            'currency': 'INR',
            'receipt': receipt,
            'notes': notes
        }
        
        order = client.order.create(data=order_data)
        
        # Save payment record
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO payments (user_id, razorpay_order_id, amount, currency, plan_type, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, order['id'], plan['amount'], 'INR', plan_id, 'pending'))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'order_id': order['id'],
            'key_id': RAZORPAY_KEY_ID,
            'amount': plan['amount'],
            'currency': 'INR',
            'plan_name': plan['name'],
            'plan_price': plan['price']
        })
        
    except razorpay.errors.BadRequestError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        current_app.logger.error(f'Error creating order: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Failed to create payment order'
        }), 500

@payment_bp.route('/verify-razorpay-payment', methods=['POST'])
@cross_origin()
def verify_payment():
    """Verify Razorpay payment"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['order_id', 'payment_id', 'signature', 'user_id']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        order_id = data.get('order_id')
        payment_id = data.get('payment_id')
        signature = data.get('signature')
        user_id = data.get('user_id')
        
        # Verify signature
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            f"{order_id}|{payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        if signature != generated_signature:
            return jsonify({
                'success': False,
                'error': 'Invalid payment signature'
            }), 400
        
        # Get payment details
        client = get_razorpay_client()
        payment = client.payment.fetch(payment_id)
        
        if payment['status'] != 'captured':
            return jsonify({
                'success': False,
                'error': 'Payment not captured'
            }), 400
        
        # Update user to premium
        conn = get_db()
        cursor = conn.cursor()
        
        # Get plan from payment
        cursor.execute('SELECT plan_type FROM payments WHERE razorpay_order_id = ?', (order_id,))
        result = cursor.fetchone()
        plan_type = result['plan_type'] if result else 'monthly'
        
        # Set expiry (1 month or 1 year)
        if plan_type == 'yearly':
            expiry = datetime.now() + timedelta(days=365)
        else:
            expiry = datetime.now() + timedelta(days=30)
        
        # Update user
        cursor.execute('''
            UPDATE users 
            SET is_premium = 1, 
                premium_since = CURRENT_TIMESTAMP, 
                premium_expiry = ?,
                payment_id = ?,
                razorpay_order_id = ?,
                plan_type = ?
            WHERE id = ?
        ''', (expiry, payment_id, order_id, plan_type, user_id))
        
        # Update payment status
        cursor.execute('''
            UPDATE payments 
            SET status = 'completed', 
                razorpay_payment_id = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE razorpay_order_id = ?
        ''', (payment_id, order_id))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Payment verified successfully',
            'user_id': user_id,
            'is_premium': True,
            'premium_expiry': expiry.isoformat() if expiry else None
        })
        
    except Exception as e:
        current_app.logger.error(f'Error verifying payment: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Payment verification failed'
        }), 500

@payment_bp.route('/premium/check', methods=['GET'])
@cross_origin()
def check_premium_status():
    """Check if user is premium"""
    try:
        user_id = request.args.get('user_id') or request.headers.get('X-User-Id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'is_premium': False,
                'error': 'User ID required'
            }), 400
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, is_premium, premium_expiry, plan_type 
            FROM users 
            WHERE id = ?
        ''', (user_id,))
        
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return jsonify({
                'success': False,
                'is_premium': False,
                'error': 'User not found'
            }), 404
        
        is_premium = bool(user['is_premium'])
        
        # Check if premium has expired
        if is_premium and user['premium_expiry']:
            expiry = datetime.fromisoformat(user['premium_expiry'])
            if expiry < datetime.now():
                # Auto-expire
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('''
                    UPDATE users SET is_premium = 0 WHERE id = ?
                ''', (user_id,))
                conn.commit()
                conn.close()
                is_premium = False
        
        return jsonify({
            'success': True,
            'is_premium': is_premium,
            'user_id': user_id,
            'plan_type': user['plan_type'] if is_premium else None,
            'premium_expiry': user['premium_expiry'] if is_premium else None
        })
        
    except Exception as e:
        current_app.logger.error(f'Error checking premium status: {str(e)}')
        return jsonify({
            'success': False,
            'is_premium': False,
            'error': 'Failed to check premium status'
        }), 500

@payment_bp.route('/razorpay-webhook', methods=['POST'])
@cross_origin()
def razorpay_webhook():
    """Handle Razorpay webhook events"""
    try:
        payload = request.get_data(as_text=True)
        signature = request.headers.get('X-Razorpay-Signature')
        
        # Verify webhook signature
        expected_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if signature != expected_signature:
            return jsonify({'error': 'Invalid signature'}), 400
        
        event_data = json.loads(payload)
        event = event_data.get('event')
        
        if event == 'payment.captured':
            # Payment successful
            payment_data = event_data.get('payload', {}).get('payment', {}).get('entity', {})
            order_id = payment_data.get('order_id')
            payment_id = payment_data.get('id')
            amount = payment_data.get('amount')
            
            if order_id:
                conn = get_db()
                cursor = conn.cursor()
                
                # Get payment details
                cursor.execute('''
                    SELECT user_id, plan_type FROM payments WHERE razorpay_order_id = ?
                ''', (order_id,))
                result = cursor.fetchone()
                
                if result:
                    user_id = result['user_id']
                    plan_type = result['plan_type']
                    
                    # Set expiry
                    if plan_type == 'yearly':
                        expiry = datetime.now() + timedelta(days=365)
                    else:
                        expiry = datetime.now() + timedelta(days=30)
                    
                    # Update user
                    cursor.execute('''
                        UPDATE users 
                        SET is_premium = 1, 
                            premium_since = CURRENT_TIMESTAMP, 
                            premium_expiry = ?,
                            payment_id = ?,
                            razorpay_order_id = ?,
                            plan_type = ?
                        WHERE id = ?
                    ''', (expiry, payment_id, order_id, plan_type, user_id))
                    
                    # Update payment
                    cursor.execute('''
                        UPDATE payments 
                        SET status = 'completed', 
                            razorpay_payment_id = ?,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE razorpay_order_id = ?
                    ''', (payment_id, order_id))
                    
                    conn.commit()
                    
                    current_app.logger.info(f'✅ User {user_id} upgraded to premium via webhook. Payment: {payment_id}')
                
                conn.close()
        
        return jsonify({'status': 'success'}), 200
        
    except Exception as e:
        current_app.logger.error(f'❌ Webhook error: {str(e)}')
        return jsonify({'error': str(e)}), 500