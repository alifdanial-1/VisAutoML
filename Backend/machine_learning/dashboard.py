import os
from explainerdashboard import ExplainerDashboard
import joblib
import sys

# Create a module-level Flask app that can be imported by WSGI servers
app = None

def create_dashboard_app(filename):
    """Create and return the Flask app without running it"""
    try:
        # Load dashboard from configuration
        db = ExplainerDashboard.from_config(filename+".yaml")
        # Get the underlying Flask app
        flask_app = db.flask_server()
        return flask_app
    except Exception as e:
        print(f"Error creating dashboard app: {str(e)}")
        raise

def runModel(filename):
    """
    Prepares the dashboard app for the given model filename.
    
    In Django integration scenario:
    - This just initializes the app at module level
    - The actual serving is done by the Django view
    
    In standalone development scenario:
    - This might run the Flask app directly
    """
    global app
    try:
        # Create the app and store at module level
        app = create_dashboard_app(filename)
        
        # Storing at module level is sufficient for Django integration
        # In development or scripts, we might want to run directly
        if os.environ.get('RUN_DASHBOARD', '').lower() == 'true':
            print(f"Running dashboard for model {filename} in standalone mode")
            app.run(host='0.0.0.0', port=8050, debug=True)
            
        # Return the app for the caller to use if needed
        return app
        
    except Exception as e:
        print(f"Failed to run model dashboard: {str(e)}")
        raise

# For direct execution via command line
if __name__ == "__main__":
    if len(sys.argv) > 1:
        filename = sys.argv[1]
        # Set environment to run the dashboard directly
        os.environ['RUN_DASHBOARD'] = 'true'
        app = runModel(filename)
