from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from Client.models import Client
from Lawyer.models import Lawyer


class Saved(models.Model):
	lawyer = models.ForeignKey(Lawyer, on_delete=models.DO_NOTHING)
	client = models.ForeignKey(Client, on_delete=models.DO_NOTHING)
	
	class Meta:
		unique_together = ('lawyer', 'client',)

	def __str__(self):
		return self.lawyer.user.username + '   ' + self.client.user.username