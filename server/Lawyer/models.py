from django.db import models
from django.contrib.auth.models import User

class Lawyer(User):
	buisness_address = models.CharField(max_length=100)
	city = models.CharField(max_length=30)
	state = models.CharField(max_length=30)
	phone_number = models.CharField(max_length=30)
	liscence_number = models.IntegerField()
	year_admitted = models.DateTimeField()
	hcr_number = models.IntegerField(unique=True)