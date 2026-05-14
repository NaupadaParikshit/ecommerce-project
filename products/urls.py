from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    create_order,
    verify_payment,
    get_orders
)

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('orders/', get_orders, name='orders'),
    path('orders/create/', create_order, name='create-order'),
    path('orders/verify/', verify_payment, name='verify-payment'),
]