from django.urls import path
from .views import (
    CategoryListView,
    EventListView,
    EventDetailView,
    create_booking,
    verify_booking_payment,
    my_bookings
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('events/', EventListView.as_view(), name='events'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('events/category/<int:category_id>/', EventListView.as_view(), name='events-by-category'),
    path('bookings/create/', create_booking, name='create-booking'),
    path('bookings/verify/', verify_booking_payment, name='verify-booking'),
    path('bookings/my/', my_bookings, name='my-bookings'),
]