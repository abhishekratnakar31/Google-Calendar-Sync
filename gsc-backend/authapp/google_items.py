import uuid
from datetime import datetime, timedelta
from googleapiclient.discovery import build
from .utils import get_valid_credentials


def normalize_dt(dt_str):
    if not isinstance(dt_str, str): return None
    if len(dt_str) == 16: return dt_str + ":00"
    return dt_str


def create_google_event(email, data):
    creds = get_valid_credentials(email)
    service = build("calendar", "v3", credentials=creds)

    title = data.get("title")
    description = data.get("description", "")
    calendar_id = data.get("google_calendar_id", "primary")
    start_at = normalize_dt(data.get("start_at"))
    end_at = normalize_dt(data.get("end_at"))
    add_meet = data.get("add_meet", False)

    event_body = {
        "summary": title,
        "description": description,
        "start": {"dateTime": start_at, "timeZone": "Asia/Kolkata"},
        "end": {"dateTime": end_at, "timeZone": "Asia/Kolkata"},
    }

    if add_meet:
        event_body["conferenceData"] = {
            "createRequest": {
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
                "requestId": f"meet-{uuid.uuid4()}"
            }
        }

    created_event = service.events().insert(
        calendarId=calendar_id,
        body=event_body,
        conferenceDataVersion=1
    ).execute()

    return created_event


def create_google_task(email, data):
    creds = get_valid_credentials(email)
    service = build("calendar", "v3", credentials=creds)

    title = data.get("title")
    description = data.get("description", "")
    due = data.get("due_at") # YYYY-MM-DD
    calendar_id = data.get("google_calendar_id", "primary")

    # For all-day events, end date must be start date + 1 day
    start_date = due
    try:
        dt_obj = datetime.strptime(due, "%Y-%m-%d")
        end_date = (dt_obj + timedelta(days=1)).strftime("%Y-%m-%d")
    except Exception:
        # Fallback if parsing fails, though frontend sends YYYY-MM-DD
        end_date = due

    task_body = {
        "summary": title,
        "description": description,
        "start": {"date": start_date},
        "end": {"date": end_date},
    }

    created_task = service.events().insert(
        calendarId=calendar_id,
        body=task_body
    ).execute()

    return created_task
