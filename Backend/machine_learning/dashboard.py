from explainerdashboard import ExplainerDashboard
import joblib
import os
from django.http import HttpResponse

# Global dictionary to store dashboard instances
dashboards = {}

def create_dashboard(filename):
    """
    Create and store a dashboard instance based on a configuration file
    """
    if filename not in dashboards:
        db = ExplainerDashboard.from_config(f"{filename}.yaml")
        dashboards[filename] = db
    return dashboards[filename]

def get_dashboard_app(filename):
    """
    Get the Flask app from a dashboard instance
    """
    dashboard = create_dashboard(filename)
    return dashboard.app

def dashboard_view(request, model_id):
    """
    Django view function that serves a dashboard for a specific model_id
    """
    dashboard = create_dashboard(model_id)
    return HttpResponse(dashboard.app.index())
