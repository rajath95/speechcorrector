import http.server
import socketserver
import os
import json

PORT = 7001
API_KEY = os.environ.get("GEMINI_API_KEY", "")

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/config.js':
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            # Inject the key into a JS module
            content = f'export const GEMINI_API_KEY = "{API_KEY}";'
            self.wfile.write(content.encode('utf-8'))
        else:
            # Serve normal files
            super().do_GET()

print(f"Serving at http://localhost:{PORT}")
print(f"Using API Key from environment: {'Yes' if API_KEY else 'No (Make sure GEMINI_API_KEY is set)'}")

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    httpd.serve_forever()
