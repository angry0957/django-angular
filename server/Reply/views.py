from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.http import JsonResponse
from Question.models import Question
from .models import Reply
from Category.models import Category
from Client.models import Client
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['POST'])
def replyquestion(request):
	try:
		username = request.data.get('username',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Username is required"},status=500)	
	try:
		text = request.data.get('text',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Text is required"},status=500)
	try:
		question = request.data.get('question',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Question is required"},status=500)	
	try:
		user = User.objects.get(username= username) 
	except Exception as e:
		return HttpResponse(e)
	question = Question.objects.get(id=question)
	reply = Reply(text=text, user=user, question=question)
	reply.save()
	return JsonResponse({"Response": "Saved"},safe=False,status=200)

@api_view(['POST'])
def getreplyquestion(request):
	try:
		question = request.data.get('question',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Question is required"},status=500)	
	question = Question.objects.get(id=question)
	reply = Reply.objects.filter(question=question).values()
	for i in reply:
		userid = i['user_id']
		user = User.objects.get(id=userid)
		i['username'] = user.username
	return JsonResponse(list(reply),safe=False,status=200)