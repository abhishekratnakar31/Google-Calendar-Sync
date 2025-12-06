import os
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from .models import GoogleCredentials


def get_valid_credentials(user_email):
    creds_obj = GoogleCredentials.objects.get(email=user_email)

    creds = Credentials(
        token=creds_obj.access_token,
        refresh_token=creds_obj.refresh_token,
        token_uri=creds_obj.token_uri,
        client_id=creds_obj.client_id,
        client_secret=creds_obj.client_secret
    )

    # Refresh if expired
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())

        # Update DB with new token & expiry
        creds_obj.access_token = creds.token
        creds_obj.expiry = creds.expiry
        creds_obj.save()

    return creds
