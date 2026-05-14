from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

# Register
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )

    refresh = RefreshToken.for_user(user)
    return Response({
        'message': 'User created successfully!',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'username': user.username
    }, status=status.HTTP_201_CREATED)


# Get current user info
@api_view(['GET'])
def get_user(request):
    if request.user.is_authenticated:
        return Response({
            'username': request.user.username,
            'email': request.user.email
        })
    return Response(
        {'error': 'Not authenticated'},
        status=status.HTTP_401_UNAUTHORIZED
    )