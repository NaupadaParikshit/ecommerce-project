from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,   
    TokenRefreshView,      
)
from .views import register, get_user

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', get_user, name='get_user'),
]