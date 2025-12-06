from django.urls import path
from . import views
from .views import (
    CalendarListView,
    SetDefaultCalendarView,
    CalendarItemCreateView,
    CreateGoogleItemView,
     )

urlpatterns = [
    path('init/', views.google_auth_init),
    path('callback/', views.google_auth_callback),
    path('profile/', views.get_user_profile),
    path('tasks/', views.get_tasks),
    path('tasks/delete', views.delete_task_view),

    path('events/', views.fetch_google_events),
    path('events/create', views.create_event),
    path('events/delete', views.delete_event),
    path('events/sync', views.sync_events),
    path('events/update', views.update_event),

    path('calendars/', CalendarListView.as_view()),
    path('calendars/default/', SetDefaultCalendarView.as_view()),

    path("items/create/", CreateGoogleItemView.as_view()),  # main endpoint
# path("holidays/", PublicHolidaysView.as_view()),

]
