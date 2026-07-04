# backend/utils/payment_utils.py
import razorpay
import hmac
import hashlib
import time
from flask import current_app

def get_razorpay_client():
    """Initialize Razorpay client"""
    return razorpay.Client(
        auth=(current_app.config['RAZORPAY_KEY_ID'], 
              current_app.config['RAZORPAY_KEY_SECRET'])
    )

def create_razorpay_order(amount, receipt, notes=None):
    """Create a Razorpay order"""
    client = get_razorpay_client()
    order_data = {
        'amount': amount,
        'currency': 'INR',
        'receipt': receipt,
        'notes': notes or {}
    }
    return client.order.create(data=order_data)

def verify_razorpay_signature(order_id, payment_id, signature):
    """Verify Razorpay payment signature"""
    secret = current_app.config['RAZORPAY_KEY_SECRET']
    generated_signature = hmac.new(
        secret.encode(),
        f"{order_id}|{payment_id}".encode(),
        hashlib.sha256
    ).hexdigest()
    return generated_signature == signature

def get_plan_details(plan_id):
    """Get plan details by ID"""
    plans = {
        'monthly': {
            'amount': 9900,  # ₹99 in paise
            'name': 'Monthly',
            'price': '₹99'
        },
        'yearly': {
            'amount': 99900,  # ₹999 in paise
            'name': 'Yearly',
            'price': '₹999'
        }
    }
    return plans.get(plan_id)