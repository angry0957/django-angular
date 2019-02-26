from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Client(User):
	city = models.CharField(max_length=30)
	state = models.CharField(max_length=30)
	phone_number = models.CharField(max_length=30)