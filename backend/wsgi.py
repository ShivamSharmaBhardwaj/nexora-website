import sys
import os

# Add your project directory to the path
path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.append(path)

# Set environment variables for PythonAnywhere
os.environ['PYTHONANYWHERE_USERNAME'] = 'krynovatechnology'  # Replace with your actual username
os.environ['JWT_SECRET'] = 'your_super_secret_key_here'
os.environ['EMAIL_USER'] = 'princeb744@gmail.com'
os.environ['EMAIL_PASS'] = 'oqqpouwpjvphohng'

from app import application