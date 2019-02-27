from django.db import models
from django.contrib.auth.models import User
from Category.models import Category

class Question(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	text = models.CharField(max_length=100)
	description = models.CharField(max_length=300)
	catogery = models.ForeignKey(Category, on_delete=models.CASCADE)

	def __str__(self):
		return self.user.username + ' ' + self.catogery.catogery + ' ' + self.text