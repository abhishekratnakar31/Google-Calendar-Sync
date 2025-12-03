import os
from django.http import HttpResponseRedirect, JsonResponse
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from .models import GoogleCredentials
from google.oauth2 import id_token
from google.auth.transport import requests
from googleapiclient.discovery import build
from .utils import get_valid_credentials
from django.shortcuts import redirect

from django.views.decorators.csrf import csrf_exempt
import json

SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
]


def google_auth_callback(request):
    code = request.GET.get("code")

    if not code:
        return JsonResponse({"error": "No authorization code received"}, status=400)

    flow = Flow.from_client_config(
    {
        "web": {
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "project_id": "gcal-sync",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "redirect_uris": [os.getenv("GOOGLE_REDIRECT_URI")],
        }
    },
    scopes=SCOPES  
)


    flow.redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")

    token_data = flow.fetch_token(code=code)
    credentials = flow.credentials

    # Extract tokens + email
    access_token = credentials.token
    refresh_token = credentials.refresh_token
    expiry = credentials.expiry
    token_uri = credentials.token_uri
    client_id = credentials.client_id
    client_secret = credentials.client_secret

    # Fetch user's email (from id_token)
    token_request = requests.Request()
    id_info = id_token.verify_oauth2_token(
    credentials.id_token,
    token_request,
    os.getenv("GOOGLE_CLIENT_ID")
    )
    email = id_info.get("email")

    # Save or update credentials in DB
    GoogleCredentials.objects.update_or_create(
        email=email,
        defaults={
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_uri": token_uri,
            "client_id": client_id,
            "client_secret": client_secret,
            "expiry": expiry
        }
    )

    return redirect(f"http://localhost:5173/events?email={email}")


def google_auth_init(request):
    flow = Flow.from_client_config(
    {
        "web": {
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "project_id": "gcal-sync",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "redirect_uris": [os.getenv("GOOGLE_REDIRECT_URI")],
        }
    },
    scopes=SCOPES  
    )
    flow.redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")

    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent"
    )

    return HttpResponseRedirect(auth_url)

def fetch_google_events(request):
    email = request.GET.get("email")

    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)

    try:
        creds = get_valid_credentials(email)
        service = build("calendar", "v3", credentials=creds)

        events_result = service.events().list(
            calendarId="primary",
            maxResults=10,
            singleEvents=True,
            orderBy="startTime"
        ).execute()

        events = events_result.get("items", [])

        return JsonResponse({"events": events}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
# @csrf_exempt
# def create_event(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "POST required"}, status=400)

#     body = json.loads(request.body)
#     email = body.get("email")
#     title = body.get("title")
#     description = body.get("description")
#     start = body.get("start")
#     end = body.get("end")

#     if not all([email, title, start, end]):
#         return JsonResponse({"error": "Missing fields"}, status=400)

#     try:
#         creds = get_valid_credentials(email)
#         service = build("calendar", "v3", credentials=creds)

#         event = {
#             "summary": title,
#             "description": description,
#             "start": {"dateTime": start, "timeZone": "Asia/Kolkata"},
#             "end": {"dateTime": end, "timeZone": "Asia/Kolkata"},
#         }

#         created = service.events().insert(calendarId="primary", body=event).execute()
#         return JsonResponse({"success": True, "event": created})

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
    
@csrf_exempt
def create_event(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        body = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    # Accept either "title" or "summary" from frontend
    email = body.get("email")
    title = body.get("title") or body.get("summary")
    description = body.get("description", "")
    start = body.get("start")
    end = body.get("end")

    if not email or not title or not start or not end:
        return JsonResponse({
            "error": "Missing fields. Required: email, summary/title, start, end",
            "received": {"email": bool(email), "title/summary": bool(title), "start": bool(start), "end": bool(end)}
        }, status=400)

    # Normalize datetimes to include seconds if missing (makes Google less grumpy)
    def normalize_dt(dt_str):
        # typical input: 2025-12-02T13:30 or 2025-12-02T13:30:00
        if not isinstance(dt_str, str):
            return None
        if len(dt_str) == 16:  # "YYYY-MM-DDTHH:MM"
            return dt_str + ":00"
        return dt_str

    start = normalize_dt(start)
    end = normalize_dt(end)
    if not start or not end:
        return JsonResponse({"error": "Invalid start or end datetime format"}, status=400)

    try:
        creds = get_valid_credentials(email)
        service = build("calendar", "v3", credentials=creds)

        event_body = {
            "summary": title,
            "description": description,
            "start": {"dateTime": start, "timeZone": "Asia/Kolkata"},
            "end": {"dateTime": end, "timeZone": "Asia/Kolkata"},
        }

        created = service.events().insert(calendarId="primary", body=event_body).execute()
        return JsonResponse({"success": True, "event": created}, status=201)

    except Exception as e:
        # Return both the message and a simple repr so debugging is easier
        return JsonResponse({"error": str(e)}, status=500)
    



# def delete_event(request):
#     event_id = request.GET.get("id")
#     email = request.GET.get("email")

#     if not event_id or not email:
#         return JsonResponse({"error": "Missing event id or email"}, status=400)

#     try:
#         creds = get_valid_credentials(email)
#         service = build("calendar", "v3", credentials=creds)

#         service.events().delete(calendarId="primary", eventId=event_id).execute()
#         return JsonResponse({"success": True})

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
    
@csrf_exempt
def delete_event(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE required"}, status=400)

    try:
        body = json.loads(request.body)
        email = body.get("email")
        event_id = body.get("event_id")

        if not email or not event_id:
            return JsonResponse({"error": "Missing email or event_id"}, status=400)

        creds = get_valid_credentials(email)
        service = build("calendar", "v3", credentials=creds)

        service.events().delete(calendarId="primary", eventId=event_id).execute()

        return JsonResponse({"success": True})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def update_event(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT required"}, status=400)

    body = json.loads(request.body)
    email = body.get("email")
    event_id = body.get("event_id")
    summary = body.get("summary")
    description = body.get("description")
    start = body.get("start")
    end = body.get("end")

    if not email or not event_id:
        return JsonResponse({"error": "Missing email or event_id"}, status=400)

    creds = get_valid_credentials(email)
    service = build("calendar", "v3", credentials=creds)

    event = service.events().get(calendarId="primary", eventId=event_id).execute()

    if summary: event["summary"] = summary
    if description: event["description"] = description
    if start:
        event["start"] = {"dateTime": start, "timeZone": "Asia/Kolkata"}
    if end:
        event["end"] = {"dateTime": end, "timeZone": "Asia/Kolkata"}

    updated_event = service.events().update(
        calendarId="primary",
        eventId=event_id,
        body=event
    ).execute()

    return JsonResponse({"success": True, "event": updated_event})



def sync_events(request):
    return fetch_google_events(request)
