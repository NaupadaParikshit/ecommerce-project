from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from .models import Product, Order, OrderItem
from .serializers import ProductSerializer, OrderSerializer
import razorpay

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

# GET all products
class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# GET single product
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# POST — Create Razorpay order
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    cart_items = request.data.get('items', [])

    if not cart_items:
        return Response(
            {'error': 'Cart is empty'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Calculate total in paise (Razorpay uses paise, not rupees)
    total = sum(float(item['price']) * int(item['quantity']) for item in cart_items)
    total_paise = int(total * 100)

    # Create Razorpay order
    razorpay_order = razorpay_client.order.create({
        'amount': total_paise,
        'currency': 'INR',
        'payment_capture': 1
    })

    # Save order in database
    order = Order.objects.create(
        user=request.user,
        total_price=total
    )

    # Save order items
    for item in cart_items:
        product = Product.objects.get(id=item['id'])
        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=item['quantity'],
            price=item['price']
        )

    return Response({
        'order_id': order.id,
        'razorpay_order_id': razorpay_order['id'],
        'amount': total_paise,
        'currency': 'INR',
        'key': settings.RAZORPAY_KEY_ID
    }, status=status.HTTP_201_CREATED)


# POST — Verify payment after success
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature = request.data.get('razorpay_signature')
    order_id = request.data.get('order_id')

    # Verify signature
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })

        # Mark order as paid
        order = Order.objects.get(id=order_id)
        order.is_paid = True
        order.save()

        return Response({'message': 'Payment verified successfully!'})

    except Exception:
        return Response(
            {'error': 'Payment verification failed'},
            status=status.HTTP_400_BAD_REQUEST
        )


# GET — list user orders
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)