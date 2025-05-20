"""
WSGI entry point for serving the ExplainerDashboard with Gunicorn or other WSGI servers.

Usage with Gunicorn:
    gunicorn -w 4 -b 0.0.0.0:8050 wsgi:application
"""
import os
import sys

# Import dashboard module but avoid running servers
os.environ['FLASK_ENV'] = 'production'

# This will import the dashboard module without running the server
from dashboard import create_dashboard_app

# Get model filename from environment variable or use a default
model_filename = os.environ.get('MODEL_FILENAME')

if not model_filename:
    print("Warning: MODEL_FILENAME environment variable not set.")
    # Try to find model files in the current directory
    import glob
    joblib_files = glob.glob("*.joblib")
    if joblib_files:
        # Use the first found model file
        model_filename = joblib_files[0].replace('.joblib', '')
        print(f"Using model file: {model_filename}")
    else:
        print("Error: No model files found and MODEL_FILENAME not set")
        sys.exit(1)

# Create the Flask application
application = create_dashboard_app(model_filename)

# For WSGI servers
app = application

if __name__ == "__main__":
    print("This is a WSGI entry point and should be used with a WSGI server like Gunicorn.")
    print("Example: gunicorn -w 4 -b 0.0.0.0:8050 wsgi:application") 