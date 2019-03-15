from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from Client.models import Client
from Lawyer.models import Lawyer


class Rating(models.Model):
	rate = models.IntegerField(
		default=5,
		validators=[MaxValueValidator(5), MinValueValidator(1)]
		)
	lawyerid = models.ForeignKey(Lawyer, on_delete=models.DO_NOTHING)
	clientid = models.ForeignKey(Client, on_delete=models.DO_NOTHING)
	

	class Meta:
		unique_together = ('lawyerid', 'clientid',)
    
	def __str__(self):
		return self.lawyerid.user.username + '   ' + self.clientid.user.username