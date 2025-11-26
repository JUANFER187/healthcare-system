from django.urls import path
from .views import UserRegistrationView, UserProfileView, ProfessionalListView, user_login_view, professionals_list_view  # ← AGREGAR professionals_list_view

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('professionals/', professionals_list_view, name='professionals-list'),  # ← CAMBIAR por la nueva vista
    path('login/', user_login_view, name='login'),
]