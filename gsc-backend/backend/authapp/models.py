from django.db import models

class GoogleCredentials(models.Model):
    email = models.EmailField(unique=True)
    access_token = models.TextField()
    refresh_token = models.TextField(null=True, blank=True)
    token_uri = models.CharField(max_length=255)
    client_id = models.CharField(max_length=255)
    client_secret = models.CharField(max_length=255)
    expiry = models.DateTimeField()

    def __str__(self):
        return self.email
