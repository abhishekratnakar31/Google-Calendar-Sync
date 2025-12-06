import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from authapp.google_helpers import create_google_event
from datetime import datetime, timedelta

email = "abhishekratnakar2831@gmail.com"
start_time = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%dT%H:%M")
end_time = (datetime.now() + timedelta(days=1, hours=1)).strftime("%Y-%m-%dT%H:%M")

data = {
    "title": "Debug Event",
    "description": "Created via debug script",
    "start_at": start_time,
    "end_at": end_time,
    "google_calendar_id": "primary",
    "add_meet": False
}

try:
    print(f"Creating event for {email} with data: {data}")
    event = create_google_event(email, data)
    print("Event created successfully!")
    print(event.get('htmlLink'))
except Exception as e:
    print(f"Error creating event: {e}")
    import traceback
    traceback.print_exc()
