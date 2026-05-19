from django.db import models
from django.contrib.auth.models import User


class EventCategory(models.Model):
    name = models.CharField(max_length=100)  # "Movie", "IPL"
    icon = models.CharField(max_length=10, default='🎟️')

    def __str__(self):
        return self.name


class Event(models.Model):
    category = models.ForeignKey(EventCategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField()
    poster = models.ImageField(upload_to='events/', blank=True)
    venue = models.CharField(max_length=200)
    date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.date.strftime('%d %b %Y')}"


class SeatCategory(models.Model):
    name = models.CharField(max_length=50)   # "Platinum", "Gold", "Silver"
    price = models.DecimalField(max_digits=10, decimal_places=2)
    color = models.CharField(max_length=20, default='#4CAF50')

    def __str__(self):
        return self.name


class Seat(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.CharField(max_length=10)   # "A1", "B5"
    row = models.CharField(max_length=5)             # "A", "B"
    seat_category = models.ForeignKey(SeatCategory, on_delete=models.CASCADE)
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.event.name} - Seat {self.seat_number}"


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    seats = models.ManyToManyField(Seat)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    booking_date = models.DateTimeField(auto_now_add=True)
    razorpay_order_id = models.CharField(max_length=200, blank=True)
    razorpay_payment_id = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"Booking #{self.id} by {self.user.username}"