from django.contrib.staticfiles.handlers import StaticFilesHandler
from django.core.wsgi import get_wsgi_application
from dash.middleware import DisableCacheMiddleware

def create_wsgi_app():
    """
    Create a WSGI app that properly serves Dash applications through Django
    """
    # Get the Django WSGI application
    django_app = get_wsgi_application()
    
    # Wrap it with StaticFilesHandler to handle static files
    django_app = StaticFilesHandler(django_app)
    
    # Add the Dash middleware for proper handling of Dash apps
    class DispatcherMiddleware:
        def __init__(self, wsgi_apps):
            self.wsgi_apps = wsgi_apps
            self.middleware = DisableCacheMiddleware()
        
        def __call__(self, environ, start_response):
            # Get the path from the environ
            path = environ.get('PATH_INFO', '')
            
            # Check if the path starts with '/dashboard/'
            if path.startswith('/dashboard/'):
                # Extract the model_id from the path
                parts = path.strip('/').split('/')
                if len(parts) > 1:
                    model_id = parts[1]
                    
                    # Import dashboard module here to avoid circular imports
                    from .dashboard import get_dashboard_app
                    
                    # Get the Dash app for this model_id
                    dash_app = get_dashboard_app(model_id)
                    
                    # Adjust the path for the Dash app
                    environ['PATH_INFO'] = path.replace(f'/dashboard/{model_id}', '')
                    
                    # Return the Dash app response
                    return self.middleware(dash_app.server)(environ, start_response)
            
            # For all other paths, use the Django app
            return django_app(environ, start_response)
    
    # Return the dispatcher middleware
    return DispatcherMiddleware({'/': django_app}) 