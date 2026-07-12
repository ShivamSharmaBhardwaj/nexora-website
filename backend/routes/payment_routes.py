# backend/routes/payment_routes.py
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
import razorpay
import hmac
import hashlib
import json
import time
import sqlite3
import os
from datetime import datetime, timedelta
from config import PLANS, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

# ✅ SINGLE BLUEPRINT
payment_bp = Blueprint('payment', __name__)

# ✅ Database path - using the same DB as config
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'nexora.db')

def get_razorpay_client():
    try:
        key_id = str(RAZORPAY_KEY_ID).strip()
        key_secret = str(RAZORPAY_KEY_SECRET).strip()
        
        if not key_id or not key_secret:
            print("❌ Razorpay keys are empty!")
            return None
            
        print(f"✅ Initializing Razorpay with Key ID: {key_id[:10]}...")
        client = razorpay.Client(auth=(key_id, key_secret))
        return client
    except Exception as e:
        print(f"❌ Razorpay client error: {e}")
        return None

# ============================================
# ✅ SIMPLE DB CONNECTION - NO CONTEXT MANAGER
# ============================================
def get_db():
    """Get a raw database connection - SIMPLE AND RELIABLE"""
    try:
        print(f"✅ Connecting to database: {DB_PATH}")
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        return conn
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        raise

# ============================================
# ✅ CREATE USER ENDPOINT
# ============================================
@payment_bp.route('/create-user', methods=['POST'])
@cross_origin()
def create_user():
    """Create a new user or get existing user"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        email = data.get('email')
        name = data.get('name', 'User')
        
        if not email:
            return jsonify({'success': False, 'error': 'Email is required'}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        
        try:
            # Check if user exists by email
            cursor.execute("SELECT id, is_premium FROM users WHERE email = ?", (email,))
            existing_user = cursor.fetchone()
            
            if existing_user:
                return jsonify({
                    'success': True,
                    'user_id': existing_user[0],
                    'email': email,
                    'is_premium': bool(existing_user[1])
                })
            
            # Create new user
            cursor.execute('''
                INSERT INTO users (name, email, is_premium, created_at)
                VALUES (?, ?, 0, CURRENT_TIMESTAMP)
            ''', (name, email))
            
            conn.commit()
            user_id = cursor.lastrowid
            
            print(f"✅ Created new user: {user_id} with email: {email}")
            
            return jsonify({
                'success': True,
                'user_id': user_id,
                'email': email,
                'is_premium': False
            })
            
        finally:
            conn.close()
        
    except Exception as e:
        print(f"❌ Create user error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================
# ✅ CREATE ORDER
# ============================================
@payment_bp.route('/create-razorpay-order', methods=['POST'])
@cross_origin()
def create_order():
    """Create Razorpay order for payment"""
    try:
        data = request.get_json()
        
        print(f"📦 Create order request: {data}")
        
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
        
        # ✅ Get database connection
        conn = get_db()
        cursor = conn.cursor()
        
        try:
            print(f"✅ Database connected, checking user: {user_id} or {email}")
            
            # Check if user exists
            cursor.execute('SELECT id FROM users WHERE id = ? OR email = ?', (user_id, email))
            user = cursor.fetchone()
            
            if not user:
                print(f"⚠️ User not found, creating new user: {email}")
                # Create user if doesn't exist
                cursor.execute('''
                    INSERT INTO users (name, email, role, is_premium)
                    VALUES (?, ?, ?, ?)
                ''', (name, email, 'user', 0))
                conn.commit()
                
                cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
                user = cursor.fetchone()
                user_id = user[0]
                print(f"✅ Created user: {user_id}")
            else:
                user_id = user[0]
                print(f"✅ Found existing user: {user_id}")
            
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
            
            print(f"✅ Creating Razorpay order: {order_data}")
            order = client.order.create(data=order_data)
            print(f"✅ Order created: {order['id']}")
            
            # Save payment record
            cursor.execute('''
                INSERT INTO payments (user_id, razorpay_order_id, amount, currency, plan_type, status)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (user_id, order['id'], plan['amount'], 'INR', plan_id, 'pending'))
            conn.commit()
            
            print(f"✅ Payment record saved for order: {order['id']}")
            
        except Exception as db_error:
            conn.rollback()
            print(f"❌ Database error: {db_error}")
            raise
        finally:
            conn.close()
            print("✅ Database connection closed")
        
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
        print(f"❌ Razorpay BadRequestError: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        print(f"❌ Create order error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ============================================
# ✅ VERIFY PAYMENT
# ============================================
@payment_bp.route('/verify-razorpay-payment', methods=['POST'])
@cross_origin()
def verify_payment():
    """Verify Razorpay payment"""
    try:
        data = request.get_json()
        
        print("=" * 50)
        print("📦 Verify payment request:", data)
        print("=" * 50)
        
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
        
        # ✅ Verify signature
        try:
            generated_signature = hmac.new(
                RAZORPAY_KEY_SECRET.encode(),
                f"{order_id}|{payment_id}".encode(),
                hashlib.sha256
            ).hexdigest()
            
            if signature != generated_signature:
                print(f"❌ Invalid signature: expected={generated_signature}, got={signature}")
                return jsonify({
                    'success': False,
                    'error': 'Invalid payment signature'
                }), 400
        except Exception as sig_error:
            print(f"❌ Signature error: {sig_error}")
            return jsonify({
                'success': False,
                'error': f'Signature verification failed: {str(sig_error)}'
            }), 400
        
        # ✅ Get payment details
        try:
            client = get_razorpay_client()
            if not client:
                print("❌ Razorpay client is None!")
                return jsonify({
                    'success': False,
                    'error': 'Razorpay client not available. Check API keys.'
                }), 503
            
            print(f"✅ Fetching payment: {payment_id}")
            payment = client.payment.fetch(payment_id)
            print(f"✅ Payment fetched: {payment}")
            
        except Exception as payment_error:
            print(f"❌ Failed to fetch payment: {payment_error}")
            return jsonify({
                'success': False,
                'error': f'Failed to fetch payment: {str(payment_error)}'
            }), 500
        
        # ✅ Check if payment was captured
        if payment.get('status') != 'captured':
            print(f"❌ Payment not captured: {payment.get('status')}")
            return jsonify({
                'success': False,
                'error': f'Payment not captured. Status: {payment.get("status", "unknown")}'
            }), 400
        
        # Get plan type
        plan_type = payment.get('notes', {}).get('plan', 'monthly')
        print(f"✅ Plan type: {plan_type}")
        
        # Set expiry
        if plan_type == 'yearly':
            expiry = datetime.now() + timedelta(days=365)
        else:
            expiry = datetime.now() + timedelta(days=30)
        
        # ✅ Get database connection
        conn = get_db()
        cursor = conn.cursor()
        
        try:
            # Get user email from payment
            user_email = payment.get('email') or user_id
            
            print(f"✅ Checking user: {user_id} or {user_email}")
            
            # Check if user exists
            cursor.execute('SELECT id FROM users WHERE id = ? OR email = ?', (user_id, user_email))
            user = cursor.fetchone()
            
            if user:
                # Update existing user
                cursor.execute('''
                    UPDATE users 
                    SET is_premium = 1, 
                        premium_since = CURRENT_TIMESTAMP, 
                        premium_expiry = ?,
                        payment_id = ?,
                        razorpay_order_id = ?,
                        plan_type = ?
                    WHERE id = ? OR email = ?
                ''', (expiry, payment_id, order_id, plan_type, user_id, user_email))
                print(f"✅ Updated existing user: {user_id}")
            else:
                # Create new user
                cursor.execute('''
                    INSERT INTO users (name, email, is_premium, premium_since, premium_expiry, payment_id, razorpay_order_id, plan_type)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', ('User', user_email, 1, datetime.now(), expiry, payment_id, order_id, plan_type))
                print(f"✅ Created new user: {user_email}")
            
            # Update payment status
            cursor.execute('''
                UPDATE payments 
                SET status = 'completed', 
                    razorpay_payment_id = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE razorpay_order_id = ?
            ''', (payment_id, order_id))
            
            conn.commit()
            print("✅ Database updated successfully")
            
            # Get the updated user info
            cursor.execute('SELECT id FROM users WHERE id = ? OR email = ?', (user_id, user_email))
            updated_user = cursor.fetchone()
            actual_user_id = updated_user[0] if updated_user else user_id
            
        except Exception as db_error:
            conn.rollback()
            print(f"❌ Database error: {db_error}")
            raise
        finally:
            conn.close()
            print("✅ Database connection closed")
        
        return jsonify({
            'success': True,
            'message': 'Payment verified successfully',
            'user_id': actual_user_id,
            'is_premium': True,
            'premium_expiry': expiry.isoformat() if expiry else None
        })
        
    except Exception as e:
        print(f"❌ Error verifying payment: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': f'Payment verification failed: {str(e)}'
        }), 500

# ============================================
# ✅ CHECK PREMIUM STATUS
# ============================================
@payment_bp.route('/premium/check', methods=['GET'])
@cross_origin()
def check_premium_status():
    """Check if user is premium"""
    try:
        user_id = request.args.get('user_id') or request.headers.get('X-User-Id')
        
        print(f"🔍 Checking premium status for user: {user_id}")
        
        # If no user_id or "anonymous", return default
        if not user_id or user_id == 'anonymous' or user_id == 'null' or user_id == 'undefined':
            return jsonify({
                'success': True,
                'is_premium': False,
                'user_id': user_id or 'anonymous',
                'message': 'Guest user - not premium'
            })
        
        # ✅ Get database connection
        conn = get_db()
        cursor = conn.cursor()
        
        try:
            # Check both id AND email
            cursor.execute('''
                SELECT id, email, name, is_premium, premium_expiry, plan_type 
                FROM users 
                WHERE id = ? OR email = ?
            ''', (user_id, user_id))
            
            user = cursor.fetchone()
            
            if not user:
                print(f"⚠️ User not found: {user_id}")
                return jsonify({
                    'success': True,
                    'is_premium': False,
                    'user_id': user_id,
                    'message': 'User not found in database'
                })
            
            is_premium = bool(user[3])  # index 3 is is_premium
            print(f"✅ User found: {user[1]}, is_premium: {is_premium}")
            
            # Check if premium has expired
            if is_premium and user[4]:  # index 4 is premium_expiry
                try:
                    expiry = datetime.fromisoformat(user[4])
                    if expiry < datetime.now():
                        cursor.execute('''
                            UPDATE users SET is_premium = 0 WHERE id = ?
                        ''', (user[0],))
                        conn.commit()
                        is_premium = False
                        print(f"⏰ Premium expired for user: {user[0]}")
                except:
                    pass
            
            return jsonify({
                'success': True,
                'is_premium': is_premium,
                'user_id': user[0],
                'user_email': user[1],
                'user_name': user[2],
                'plan_type': user[5] if is_premium else None,
                'premium_expiry': user[4] if is_premium else None
            })
            
        except Exception as db_error:
            print(f"❌ Database error in premium check: {db_error}")
            raise
        finally:
            conn.close()
            print("✅ Database connection closed")
        
    except Exception as e:
        print(f"❌ Error checking premium status: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'is_premium': False,
            'error': str(e)
        }), 500

print("✅ payment_routes.py loaded successfully!")