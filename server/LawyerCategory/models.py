from django.db import models
from Category.models import Category
from Lawyer.models import Lawyer

class LawyerCategory(models.Model):
	lawyerid = models.ForeignKey(Lawyer, on_delete=models.CASCADE)
	categoryid = models.ForeignKey(Category, on_delete=models.CASCADE,null=True)

	class Meta:
		unique_together = ('lawyerid', 'categoryid',)

	def __str__(self):
		return self.lawyerid.user.username + '  ' + self.categoryid.catogery