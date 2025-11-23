from django.urls import path
from .views import UserRegistrationView, UserProfileView, ProfessionalListView, user_login_view

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('professionals/', ProfessionalListView.as_view(), name='professionals-list'),
    path('login/', user_login_view, name='login'),
]