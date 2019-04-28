from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import Question
from Category.models import Category
from LawyerCategory.models import LawyerCategory
from Client.models import Client
from Lawyer.models import Lawyer
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework.decorators import api_view

# Create your views here.

@api_view(['POST'])
def askquestion(request):
	try:
		Email = request.data.get('username',None) 
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Email is required"},status=500)
	try:
		text = request.data.get('text',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Text is required"},status=500)
	try:
		description = request.data.get('description',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Description is required"},status=500)
	try:
		catogery = request.data.get('catogery',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Category is required"},status=500)	
	user = User.objects.get(username = Email)
	client = Client.objects.get(user= user)	
	catogery = Category.objects.get(catogery = catogery)
	newQuestion = Question(user= client, text= text, description= description, catogery= catogery)
	newQuestion.save()
	return JsonResponse({"data": "Successful"},status=200)

@api_view(['POST'])
def askedquestion(request):
	try:
		username = request.data.get('username',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Username is required"},status=500)	
	try:
		user = User.objects.get(username= username)
	except Exception as e:
		return HttpResponse(e)
	try:
		client = Client.objects.get(user=user)
	except Exception as e:
		return HttpResponse(e)	
	questions = Question.objects.filter(user=client).values()

	return JsonResponse(list(questions),safe=False,status=200)	

@api_view(['POST'])
def askedquestionLawyer(request):
	try:
		username = request.data.get('username',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"catogery is required"},status=500)	
	user = User.objects.get(username=username)
	lawyer = Lawyer.objects.get(user=user)
	lawyercategory = list(LawyerCategory.objects.filter(lawyerid=lawyer.id).values())
	result = list()
	for x in lawyercategory:
		catogery_obj = Category.objects.get(id=x["categoryid_id"])		
		questions = Question.objects.filter(catogery=catogery_obj).values()
		for y in questions:
			result.append(y)
	return JsonResponse(result,safe=False,status=200)	


