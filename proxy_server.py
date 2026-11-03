import http.server
import urllib.request

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        print(f"[Proxy] Intercepted GET request for: {self.path}")
        try:
            # Forward the request to the actual destination
            req = urllib.request.Request(
                self.path,
                headers=dict(self.headers)
            )
            with urllib.request.urlopen(req) as response:
                self.send_response(response.status)
                for key, value in response.headers.items():
                    self.send_header(key, value)
                self.end_headers()
                self.wfile.write(response.read())
        except Exception as e:
            self.send_error(500, str(e))

    def do_POST(self):
        print(f"[Proxy] Intercepted POST request for: {self.path}")
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            req = urllib.request.Request(
                self.path,
                data=body,
                headers=dict(self.headers),
                method='POST'
            )
            with urllib.request.urlopen(req) as response:
                self.send_response(response.status)
                for key, value in response.headers.items():
                    self.send_header(key, value)
                self.end_headers()
                self.wfile.write(response.read())
        except Exception as e:
            self.send_error(500, str(e))

if __name__ == '__main__':
    server_address = ('0.0.0.0', 8080)
    httpd = http.server.HTTPServer(server_address, ProxyHandler)
    print("Proxy server running on port 8080...")
    httpd.serve_forever()
