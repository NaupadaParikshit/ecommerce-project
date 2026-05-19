from rest_framework import serializers
from .models import EventCategory, Event, SeatCategory, Seat, Booking


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = '__all__'


class SeatCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatCategory
        fields = '__all__'


class SeatSerializer(serializers.ModelSerializer):
    seat_category = SeatCategorySerializer(read_only=True)

    class Meta:
        model = Seat
        fields = ['id', 'seat_number', 'row', 'seat_category', 'is_booked']


class EventSerializer(serializers.ModelSerializer):
    category = EventCategorySerializer(read_only=True)
    seats = SeatSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'category', 'name', 'description',
                  'poster', 'venue', 'date', 'is_active', 'seats']


class BookingSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(source='event.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    seat_numbers = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ['id', 'username', 'event_name', 'seat_numbers',
                  'total_price', 'is_paid', 'booking_date']

    def get_seat_numbers(self, obj):
        return [seat.seat_number for seat in obj.seats.all()]