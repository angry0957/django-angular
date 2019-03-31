from django.db import models
from django.contrib.auth.models import User
import datetime
from django.utils import timezone
from django.urls import reverse

class ChatMessage(models.Model):
    
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField(max_length=3000)
    fromUser = models.ForeignKey(User, on_delete=models.CASCADE,related_name='fromU')
    toUser = models.ForeignKey(User, on_delete=models.CASCADE,related_name='toU')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        """
        String to represent the message
        """
        return self.message