"""
Application Entry Point
-----------------------
This script serves as the 'Entry Point' for the application.
"""
from src import create_app

app = create_app()

if __name__ == "__main__":
    # Run the built-in Flask development server.
    # debug=True enables:
        # 1. Auto-reloading: Server restarts when code changes.
        # 2. Interactive Debugger: Shows stack traces in the browser on crash.
    app.run(debug=True)
