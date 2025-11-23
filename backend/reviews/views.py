from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count, Q
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer, ProfessionalReviewStatsSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.user_type == 'patient':
            # Pacientes ven sus reseñas dadas
            return Review.objects.filter(patient=user).select_related('professional', 'appointment')
        elif user.user_type == 'professional':
            # Profesionales ven reseñas recibidas
            return Review.objects.filter(professional=user, is_verified=True).select_related('patient', 'appointment')
        else:
            return Review.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer
    
    def perform_create(self, serializer):
        # Asignar automáticamente paciente y profesional desde la cita
        appointment = serializer.validated_data['appointment']
        serializer.save(
            patient=self.request.user,
            professional=appointment.professional
        )
    
    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """Reseñas del usuario actual"""
        reviews = self.get_queryset()
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='professional/(?P<professional_id>\d+)')
    def professional_reviews(self, request, professional_id=None):
        """Reseñas de un profesional específico (público)"""
        reviews = Review.objects.filter(
            professional_id=professional_id, 
            is_verified=True
        ).select_related('patient')
        
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='professional/(?P<professional_id>\d+)/stats')
    def professional_stats(self, request, professional_id=None):
        """Estadísticas de reseñas de un profesional"""
        stats = Review.objects.filter(
            professional_id=professional_id, 
            is_verified=True
        ).aggregate(
            average_rating=Avg('rating'),
            total_reviews=Count('id'),
            five_stars=Count('id', filter=Q(rating=5)),
            four_stars=Count('id', filter=Q(rating=4)),
            three_stars=Count('id', filter=Q(rating=3)),
            two_stars=Count('id', filter=Q(rating=2)),
            one_star=Count('id', filter=Q(rating=1))
        )
        
        # Calcular distribución porcentual
        total = stats['total_reviews'] or 1  # Evitar división por cero
        rating_distribution = {
            '5_estrellas': round((stats['five_stars'] / total) * 100, 1),
            '4_estrellas': round((stats['four_stars'] / total) * 100, 1),
            '3_estrellas': round((stats['three_stars'] / total) * 100, 1),
            '2_estrellas': round((stats['two_stars'] / total) * 100, 1),
            '1_estrella': round((stats['one_star'] / total) * 100, 1),
        }
        
        data = {
            'professional_id': professional_id,
            'average_rating': round(stats['average_rating'] or 0, 1),
            'total_reviews': stats['total_reviews'],
            'rating_distribution': rating_distribution
        }
        
        serializer = ProfessionalReviewStatsSerializer(data)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def report_review(self, request, pk=None):
        """Reportar una reseña inapropiada (para moderación futura)"""
        review = self.get_object()
        # Aquí puedes implementar lógica de reportes
        return Response({
            'message': 'Reseña reportada para revisión',
            'review_id': review.id
        }, status=status.HTTP_200_OK)