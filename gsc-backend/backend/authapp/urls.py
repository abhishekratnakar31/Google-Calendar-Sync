from django.urls import path
from . import views

urlpatterns = [
    path('init/', views.google_auth_init, name='google_auth_init'),
    path('callback/', views.google_auth_callback, name='google_auth_callback'),
    path('events/', views.fetch_google_events, name='fetch_google_events'),
    path("events/create", views.create_event),
    path("events/delete", views.delete_event),
    path("events/sync", views.sync_events),
    path("events/update", views.update_event),


]
