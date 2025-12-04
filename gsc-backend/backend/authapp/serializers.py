from rest_framework import serializers
from .models import GoogleCredentials, CalendarItem

class GoogleCredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoogleCredentials
        fields = ['id', 'email', 'default_calendar_id']

class CalendarItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarItem
        fields = '__all__'
        read_only_fields = ['id', 'user', 'google_item_id', 'sync_status', 'created_at', 'updated_at']


class GoogleItemCreateSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=["event", "task", "appointment"])
    title = serializers.CharField()
    description = serializers.CharField(required=False)
    
    google_calendar_id = serializers.CharField(required=False)

    start_at = serializers.CharField(required=False)
    end_at = serializers.CharField(required=False)

    due_at = serializers.CharField(required=False)

    add_meet = serializers.BooleanField(required=False)
