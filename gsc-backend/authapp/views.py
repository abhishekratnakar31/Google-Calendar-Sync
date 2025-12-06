import os
from django.http import HttpResponseRedirect, JsonResponse
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from google.oauth2 import id_token
from google.auth.transport import requests
from googleapiclient.discovery import build
from .utils import get_valid_credentials
from django.shortcuts import redirect
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GoogleCredentials, CalendarItem
from .serializers import GoogleCredentialsSerializer, CalendarItemSerializer
from .google_helpers import get_google_creds, fetch_user_calendars, create_google_event, create_google_task, fetch_user_tasks, delete_google_task
# from .google_holidays import fetch_public_holidays

from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime

SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/tasks",

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
            "expiry": expiry,
            "name": id_info.get("name"),
            "picture": id_info.get("picture")
        }
    )
    frontend = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    return redirect(f"{frontend}/events?email={email}")





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


def get_tasks(request):
    email = request.GET.get("email")
    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)
    
    try:
        tasks = fetch_user_tasks(email)
        return JsonResponse({"tasks": tasks}, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def delete_task_view(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE required"}, status=400)

    try:
        body = json.loads(request.body)
        email = body.get("email")
        task_id = body.get("task_id")

        if not email or not task_id:
            return JsonResponse({"error": "Missing email or task_id"}, status=400)

        delete_google_task(email, task_id)
        return JsonResponse({"success": True})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

def get_user_profile(request):
    email = request.GET.get("email")
    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)
    
    try:
        creds = GoogleCredentials.objects.get(email=email)
        return JsonResponse({
            "name": creds.name,
            "picture": creds.picture,
            "email": creds.email
        })
    except GoogleCredentials.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)






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
    calendar_id = body.get("calendar_id", "primary")

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

    # Validate time range
    try:
        # Format is YYYY-MM-DDTHH:MM:SS
        start_dt = datetime.strptime(start, "%Y-%m-%dT%H:%M:%S")
        end_dt = datetime.strptime(end, "%Y-%m-%dT%H:%M:%S")
        if end_dt <= start_dt:
            return JsonResponse({"error": "End time must be after start time"}, status=400)
    except ValueError:
        # If parsing fails, let Google API handle it or return error
        pass

    try:
        creds = get_valid_credentials(email)
        service = build("calendar", "v3", credentials=creds)
        attendees = body.get("attendees", [])

        event_body = {
    "summary": title,
    "description": description,
    "start": {"dateTime": start, "timeZone": "Asia/Kolkata"},
    "end": {"dateTime": end, "timeZone": "Asia/Kolkata"},
    "attendees": [{"email": a} for a in attendees],
}

        if body.get("add_meet"):
            event_body["conferenceData"] = {
                "createRequest": {
                    "requestId": f"meet-{int(datetime.now().timestamp())}",
                    "conferenceSolutionKey": {"type": "hangoutsMeet"}
                }
            }

        print("EVENT BODY:", event_body)


        created = service.events().insert(
            calendarId=calendar_id, 
            body=event_body,
            sendUpdates='all',
            conferenceDataVersion=1
        ).execute()
        return JsonResponse({"success": True, "event": created, "event-link": created.get("htmlLink")}, status=201)

    except Exception as e:
        # Return both the message and a simple repr so debugging is easier
        return JsonResponse({"error": str(e)}, status=500)
    








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



class CalendarListView(APIView):
    permission_classes = []  # must be public or use email param

    def get(self, request):
        email = request.GET.get("email")

        if not email:
            return Response({"error": "email is required"}, status=400)

        try:
            creds = get_valid_credentials(email)
            service = build("calendar", "v3", credentials=creds)

            calendars = service.calendarList().list().execute()
            items = calendars.get("items", [])

            result = []
            for c in items:
                result.append({
                    "id": c["id"],
                    "summary": c.get("summary", ""),
                    "primary": c.get("primary", False)
                })

            return Response({"calendars": result}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)




class SetDefaultCalendarView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        default_id = request.data.get('default_calendar_id')
        cred, _ = GoogleCredentials.objects.get_or_create(user=request.user, defaults={'token': {}})
        cred.default_calendar_id = default_id
        cred.save()
        return Response({'default_calendar_id': cred.default_calendar_id}, status=status.HTTP_200_OK)

class CalendarItemCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CalendarItemSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




class CreateGoogleItemView(APIView):
    permission_classes = []  # REMOVE auth, frontend is not authenticated

    def post(self, request):
        item_type = request.data.get("type")
        email = request.data.get("email")

        if not email:
            return Response({"error": "email is required"}, status=400)

        if item_type in ["event", "appointment"]:
            try:
                event = create_google_event(email, request.data)
                return Response({"google_event": event}, status=201)
            except Exception as e:
                return Response({"error": str(e)}, status=400)

        elif item_type == "task":
            try:
                task = create_google_task(email, request.data)
                return Response({"google_task": task}, status=201)
            except Exception as e:
                return Response({"error": str(e)}, status=400)

        return Response({"error": "Invalid type"}, status=400)


