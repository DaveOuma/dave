import os
import sys

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'davidouma_portfolio.settings')

# Initialize Django
from django.core.wsgi import get_wsgi_application
django_app = get_wsgi_application()

# Vercel Python function handler
def handler(request):
    """
    Vercel serverless function handler for Django
    """
    return django_app(request)
