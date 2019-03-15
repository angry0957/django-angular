from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Client(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	city = models.CharField(max_length=30)
	state = models.CharField(max_length=30)
	phone_number = models.CharField(max_length=30)
	# Type = models.CharField(max_length=30,default="client",null=False)

	def __str__(self):
		return self.user.username