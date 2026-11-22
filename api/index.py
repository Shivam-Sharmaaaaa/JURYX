import sys
import os

# Set up paths so that backend modules (app, agents) can be imported seamlessly
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Import the initialized Flask instance
from app import app

# Vercel serverless WSGI entry point
# 'app' is exposed as the callable application object
if __name__ == "__main__":
    app.run()
