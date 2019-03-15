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

# Create your views here.

@csrf_exempt
def replyquestion(request):
	try:
		username = request.POST['username']
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Username is required"},status=500)	
	try:
		text = request.POST['text']
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Text is required"},status=500)
	try:
		question = request.POST['question']
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

@csrf_exempt
def getreplyquestion(request):
	try:
		question = request.POST['question']
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Question is required"},status=500)	

	question = Question.objects.get(id=question)

	reply = Reply.objects.filter(question=question).values()
	for i in reply:
		userid = i['user_id']
		user = User.objects.get(id=userid)
		i['username'] = user.username
	return JsonResponse(list(reply),safe=False,status=200)