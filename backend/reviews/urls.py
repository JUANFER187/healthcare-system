from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReviewViewSet

router = DefaultRouter()
router.register('', ReviewViewSet, basename='reviews')

urlpatterns = [
    path('', include(router.urls)),
]

# URLs disponibles:
# GET/POST /api/reviews/ - Listar y crear reseñas
# GET/PUT/DELETE /api/reviews/{id}/ - Detalle de reseña
# GET /api/reviews/my_reviews/ - Mis reseñas
# GET /api/reviews/professional/{id}/ - Reseñas de un profesional
# GET /api/reviews/professional/{id}/stats/ - Estadísticas del profesional
# POST /api/reviews/{id}/report_review/ - Reportar reseña