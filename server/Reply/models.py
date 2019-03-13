from django.db import models
from Question.models import Question
from django.contrib.auth.models import User

class Reply(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	question = models.ForeignKey(Question, on_delete=models.CASCADE,related_name = 'quest')
	text = models.CharField(max_length=100)
	def __str__(self):
		return self.user.username + ' ' + self.text