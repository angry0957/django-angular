from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from Client.models import Client
from Lawyer.models import Lawyer

# Create your models here.
class AttorneyEndrosement(models.Model):
	rate = models.IntegerField(
		default=5,
		validators=[MaxValueValidator(5), MinValueValidator(1)]
		)
	fromLawyer = models.ForeignKey(Lawyer, on_delete=models.CASCADE,related_name='fromU')
	toLawyer = models.ForeignKey(Lawyer, on_delete=models.CASCADE,related_name='toU')
	title = models.CharField(max_length=100, null=True)
	description = models.CharField(max_length=300, null=True)
	isRecomended = models.BooleanField(default=True)


	class Meta:
		unique_together = ('fromLawyer', 'toLawyer',)

	def __str__(self):
		return self.fromLawyer.user.username + '   ' + self.toLawyer.user.username