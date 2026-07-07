import os
import sys

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'davidouma_portfolio.settings')

# Initialize Django ASGI application
from django.core.asgi import get_asgi_application
app = get_asgi_application()
