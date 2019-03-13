from django.db import models
from Category.models import Category
from Client.models import Client

class Question(models.Model):
	user = models.ForeignKey(Client, on_delete=models.CASCADE)
	text = models.CharField(max_length=100)
	description = models.CharField(max_length=300)
	catogery = models.ForeignKey(Category, on_delete=models.CASCADE)
	

	def __str__(self):
		return self.user.user.username + ' ' + self.catogery.catogery + ' ' + self.text