# from django.db import models

# class GoogleCredentials(models.Model):
#     email = models.EmailField(unique=True)
#     access_token = models.TextField()
#     refresh_token = models.TextField(null=True, blank=True)
#     token_uri = models.CharField(max_length=255)
#     client_id = models.CharField(max_length=255)
#     client_secret = models.CharField(max_length=255)
#     expiry = models.DateTimeField()

#     def __str__(self):
#         return self.email

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Your existing model (KEEP IT)
class GoogleCredentials(models.Model):
    email = models.EmailField(unique=True)
    access_token = models.TextField()
    refresh_token = models.TextField(null=True, blank=True)
    token_uri = models.CharField(max_length=255)
    client_id = models.CharField(max_length=255)
    client_secret = models.CharField(max_length=255)
    expiry = models.DateTimeField()

    # NEW FIELD for default calendar
    default_calendar_id = models.CharField(max_length=255, null=True, blank=True)
    
    # Profile fields
    name = models.CharField(max_length=255, null=True, blank=True)
    picture = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.email


# NEW MODEL (needed for events/tasks/appointments)
class CalendarItem(models.Model):
    TYPE_EVENT = 'event'
    TYPE_TASK = 'task'
    TYPE_APPOINTMENT = 'appointment'

    TYPE_CHOICES = [
        (TYPE_EVENT, 'Event'),
        (TYPE_TASK, 'Task'),
        (TYPE_APPOINTMENT, 'Appointment'),
    ]

    SYNC_PENDING = 'pending'
    SYNC_SYNCED = 'synced'
    SYNC_FAILED = 'failed'

    SYNC_CHOICES = [
        (SYNC_PENDING, 'Pending'),
        (SYNC_SYNCED, 'Synced'),
        (SYNC_FAILED, 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='calendar_items')

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=512)
    description = models.TextField(blank=True)

    start_at = models.DateTimeField(null=True, blank=True)
    end_at = models.DateTimeField(null=True, blank=True)
    due_at = models.DateField(null=True, blank=True)

    google_calendar_id = models.CharField(max_length=255, null=True, blank=True)
    google_item_id = models.CharField(max_length=255, null=True, blank=True)

    is_holiday = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True)

    sync_status = models.CharField(max_length=32, choices=SYNC_CHOICES, default=SYNC_PENDING)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'google_calendar_id']),
            models.Index(fields=['google_item_id']),
        ]

    def __str__(self):
        return f"{self.type} - {self.title}"

    