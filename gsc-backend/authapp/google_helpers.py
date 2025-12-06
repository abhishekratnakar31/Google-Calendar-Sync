from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from .models import GoogleCredentials
import datetime


def get_google_creds(user_email):
    cred = GoogleCredentials.objects.filter(email=user_email).first()
    if not cred:
        raise Exception("Google credentials not found for user.")

    return Credentials(
        token=cred.access_token,
        refresh_token=cred.refresh_token,
        token_uri=cred.token_uri,
        client_id=cred.client_id,
        client_secret=cred.client_secret,
        scopes=[
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/tasks",
        ],
    )


def fetch_user_calendars(user_email):
    creds = get_google_creds(user_email)
    service = build("calendar", "v3", credentials=creds, cache_discovery=False)
    calendars = service.calendarList().list().execute()
    return [
        {
            "id": cal["id"],
            "summary": cal.get("summary"),
            "accessRole": cal.get("accessRole"),
        }
        for cal in calendars.get("items", [])
    ]


def create_google_event(user_email, data):
    creds = get_google_creds(user_email)
    service = build("calendar", "v3", credentials=creds, cache_discovery=False)

    def normalize_dt(dt_str):
        if not isinstance(dt_str, str):
            return None
        if len(dt_str) == 16:  # "YYYY-MM-DDTHH:MM"
            return dt_str + ":00"
        return dt_str

    event_body = {
        "summary": data["title"],
        "description": data.get("description", ""),
        "start": {
            "dateTime": normalize_dt(data["start_at"]),
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": normalize_dt(data["end_at"]),
            "timeZone": "Asia/Kolkata",
        },
    }

    # Add Google Meet if requested
    if data.get("add_meet") == True:
        event_body["conferenceData"] = {
            "createRequest": {
                "requestId": f"meet-{datetime.datetime.utcnow().timestamp()}",
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        }

    # Add attendees if present
    attendees = data.get("attendees", [])
    if attendees:
        event_body["attendees"] = [{"email": email} for email in attendees]

    event = (
        service.events()
        .insert(
            calendarId=data["google_calendar_id"],
            body=event_body,
            conferenceDataVersion=1,
            sendUpdates='all',  # Send emails to attendees
        )
        .execute()
    )

    return event


def create_google_task(user_email, data):
    creds = get_google_creds(user_email)
    service = build("tasks", "v1", credentials=creds, cache_discovery=False)

    due_date = data.get("due_at")
    if due_date:
        # Append time to make it RFC 3339 compliant (required by Google Tasks)
        # Input is YYYY-MM-DD, Output needs to be YYYY-MM-DDTHH:MM:SS.000Z
        due_date = f"{due_date}T00:00:00.000Z"

    task_body = {
        "title": data["title"],
        "notes": data.get("description", ""),
        "due": due_date,
    }

    task = service.tasks().insert(tasklist="@default", body=task_body).execute()
    return task


def fetch_user_tasks(user_email):
    creds = get_google_creds(user_email)
    service = build("tasks", "v1", credentials=creds, cache_discovery=False)
    
    # Fetch tasks from default list
    results = service.tasks().list(tasklist="@default", showCompleted=False, maxResults=20).execute()
    return results.get("items", [])


def delete_google_task(user_email, task_id):
    creds = get_google_creds(user_email)
    service = build("tasks", "v1", credentials=creds, cache_discovery=False)
    service.tasks().delete(tasklist="@default", task=task_id).execute()
