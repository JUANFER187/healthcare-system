"""
Middleware CORS manual que SÍ funciona
"""

class CorsMiddleware:
    """
    Middleware CORS manual para desarrollo
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        # Obtener la respuesta
        response = self.get_response(request)
        
        # Headers CORS obligatorios
        response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
        response['Access-Control-Allow-Credentials'] = 'true'
        response['Access-Control-Expose-Headers'] = 'Content-Type, Authorization'
        
        # Manejar preflight requests (OPTIONS)
        if request.method == 'OPTIONS':
            response.status_code = 200
            response.content = b''
            response['Content-Length'] = '0'
        
        return response