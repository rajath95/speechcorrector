import os
from flask import Flask, Response, render_template

app = Flask(__name__)

# Load API Key from environment
API_KEY = os.environ.get("GEMINI_API_KEY", "")

@app.route('/')
def index():
    # This serves your index.html file (put it in a folder named 'templates')
    return render_template('index.html')

@app.route('/config.js')
def config_js():
    # Create the dynamic JS content
    content = f'export const GEMINI_API_KEY = "{API_KEY}";'
    
    # Return it with the correct JavaScript header
    return Response(content, mimetype='application/javascript')

if __name__ == '__main__':
    print(f"Using API Key from environment: {'Yes' if API_KEY else 'No'}")
    # Enable debug mode for auto-reloading
    app.run(port=7001, debug=True)