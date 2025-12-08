# backend/healthcare_system/cors_fix.py
from django.http import HttpResponse
import json

class CorsFixMiddleware:
    """
    Middleware MANUAL para forzar headers CORS
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Si es OPTIONS (preflight), responder inmediatamente
        if request.method == "OPTIONS":
            response = HttpResponse()
            self._add_cors_headers(response)
            response.status_code = 200
            return response
        
        # 2. Procesar la request normal
        response = self.get_response(request)
        
        # 3. Agregar headers CORS a TODAS las responses
        self._add_cors_headers(response)
        
        return response
    
    def _add_cors_headers(self, response):
        """Agrega todos los headers CORS necesarios"""
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin"
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Expose-Headers"] = "Content-Type, Authorization"
        response["Access-Control-Max-Age"] = "86400"  # 24 horas
        
        # Headers adicionales para development
        response["Vary"] = "Origin"

# AGREGAR ESTE TAMBIÉN - Middleware más simple pero efectivo
class DevelopmentCorsMiddleware:
    """
    Middleware ultra permisivo para desarrollo
    """
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # PERMITIR TODO en desarrollo
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "*"
        response["Access-Control-Allow-Headers"] = "*"
        response["Access-Control-Allow-Credentials"] = "true"
        
        return response