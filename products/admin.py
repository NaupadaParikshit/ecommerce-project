from django.contrib import admin
from .models import Product, Order, OrderItem, ProductVariant


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 3
    fields = ['name', 'player_name', 'jersey_number', 'price', 'in_stock']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'in_stock']
    inlines = [ProductVariantInline]


admin.site.register(Order)
admin.site.register(OrderItem)