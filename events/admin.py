from django.contrib import admin
from .models import EventCategory, Event, SeatCategory, Seat, Booking


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'venue', 'date', 'is_active']
    list_filter = ['category', 'is_active']


@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ['seat_number', 'row', 'event', 'seat_category', 'is_booked']
    list_filter = ['event', 'is_booked']


admin.site.register(EventCategory)
admin.site.register(SeatCategory)
admin.site.register(Booking)