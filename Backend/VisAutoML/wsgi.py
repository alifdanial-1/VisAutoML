"""
WSGI config for VisAutoML project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/wsgi/
"""

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'VisAutoML.settings')

# Import our custom WSGI app creator
from machine_learning.dash_apps import create_wsgi_app

# Create the WSGI application
application = create_wsgi_app()
