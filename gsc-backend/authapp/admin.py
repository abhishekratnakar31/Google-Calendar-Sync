from django.contrib import admin
from .models import GoogleCredentials, CalendarItem

@admin.register(GoogleCredentials)
class GoogleCredentialsAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'expiry')
    search_fields = ('email', 'name')

@admin.register(CalendarItem)
class CalendarItemAdmin(admin.ModelAdmin):
    list_display = ('type', 'title', 'start_at', 'sync_status', 'user')
    list_filter = ('type', 'sync_status', 'is_holiday')
    search_fields = ('title', 'description', 'user__username')
