"""
Application Factory Module
--------------------------
This module serves as the entry point for the Flask application.
It implements the 'Application Factory' pattern, which allows for
creating multiple instances of the app with different configurations
"""

from flask import Flask
from flask_cors import CORS

# Import the blueprint that encapsulates all song-related routes
from .routes import songs_bp, main_bp


def create_app() -> Flask:
    """
    Construct the core Flask application.

    This function initializes the Flask app instance, sets up global 
    extensions (like CORS), and registers the application's blueprints.
    
    Returns:
        Flask: A fully configured Flask application instance ready to run.
    """
    app = Flask(__name__)
    # Enable Cross-Origin Resource Sharing (CORS)
    CORS(app)

    # This attaches the routes defined in 'songs_bp' to the main application.
    app.register_blueprint(songs_bp) 
    app.register_blueprint(main_bp)

    return app
