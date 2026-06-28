import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_contact_email(contact_id, data):
    """Send email notification for new contact"""
    try:
        email_user = os.getenv('EMAIL_USER')
        email_pass = os.getenv('EMAIL_PASS')
        
        if not email_user or not email_pass:
            print("Email credentials not configured")
            return
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Krynova Contact: {data.get('subject', 'New Enquiry')}"
        msg['From'] = email_user
        msg['To'] = email_user
        
        # Create HTML content
        html = f"""
        <h3>New Contact Enquiry</h3>
        <p><strong>ID:</strong> {contact_id}</p>
        <p><strong>Name:</strong> {data['name']}</p>
        <p><strong>Email:</strong> {data['email']}</p>
        <p><strong>Phone:</strong> {data.get('phone', 'Not provided')}</p>
        <p><strong>Type:</strong> {data.get('type', 'general')}</p>
        <p><strong>Subject:</strong> {data.get('subject', 'N/A')}</p>
        <p><strong>Message:</strong></p>
        <p>{data['message'].replace(chr(10), '<br>')}</p>
        """
        
        msg.attach(MIMEText(html, 'html'))
        
        # Send email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(email_user, email_pass)
            server.send_message(msg)
        
        print(f"Email sent for contact ID: {contact_id}")
        
    except Exception as e:
        print(f"Email sending failed: {e}")
        # Don't raise the error - email failure shouldn't break the API