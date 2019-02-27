from django.db import models

class Category(models.Model):
	catogery = models.CharField(max_length=100,unique=True)

	def __str__(self):
		return self.catogery