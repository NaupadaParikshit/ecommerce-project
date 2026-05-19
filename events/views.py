from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from .models import EventCategory, Event, Seat, Booking
from .serializers import EventCategorySerializer, EventSerializer, BookingSerializer
import razorpay

razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


# GET all categories
class CategoryListView(generics.ListAPIView):
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer


# GET events by category
class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        category_id = self.kwargs.get('category_id')
        if category_id:
            return Event.objects.filter(category_id=category_id, is_active=True)
        return Event.objects.filter(is_active=True)


# GET single event with seats
class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


# POST — Book seats
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    event_id = request.data.get('event_id')
    seat_ids = request.data.get('seat_ids', [])

    if not seat_ids:
        return Response(
            {'error': 'No seats selected'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if seats are available
    seats = Seat.objects.filter(id__in=seat_ids, event_id=event_id)
    booked = seats.filter(is_booked=True)
    if booked.exists():
        return Response(
            {'error': 'Some seats are already booked!'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Calculate total
    total = sum(seat.seat_category.price for seat in seats)
    total_paise = int(total * 100)

    # Create Razorpay order
    razorpay_order = razorpay_client.order.create({
        'amount': total_paise,
        'currency': 'INR',
        'payment_capture': 1
    })

    # Create booking
    booking = Booking.objects.create(
        user=request.user,
        event_id=event_id,
        total_price=total,
        razorpay_order_id=razorpay_order['id']
    )
    booking.seats.set(seats)

    return Response({
        'booking_id': booking.id,
        'razorpay_order_id': razorpay_order['id'],
        'amount': total_paise,
        'currency': 'INR',
        'key': settings.RAZORPAY_KEY_ID
    }, status=status.HTTP_201_CREATED)


# POST — Verify payment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_booking_payment(request):
    booking_id = request.data.get('booking_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_signature = request.data.get('razorpay_signature')

    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })

        # Mark booking as paid
        booking = Booking.objects.get(id=booking_id)
        booking.is_paid = True
        booking.razorpay_payment_id = razorpay_payment_id
        booking.save()

        # Mark seats as booked
        booking.seats.update(is_booked=True)

        return Response({'message': 'Booking confirmed!'})
    except Exception:
        return Response(
            {'error': 'Payment verification failed'},
            status=status.HTTP_400_BAD_REQUEST
        )


# GET — My bookings
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(
        user=request.user
    ).order_by('-booking_date')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)