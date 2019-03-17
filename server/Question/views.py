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

# Create your views here.

@csrf_exempt
def askquestion(request):
	try:
		Email = request.POST['username'] 
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Email is required"},status=500)
	try:
		text = request.POST['text']
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Text is required"},status=500)
	try:
		description = request.POST['description']
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Description is required"},status=500)
	try:
		catogery = request.POST['catogery']
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Category is required"},status=500)	
	user = User.objects.get(username = Email)
	client = Client.objects.get(user= user)	
	catogery = Category.objects.get(catogery = catogery)
	newQuestion = Question(user= client, text= text, description= description, catogery= catogery)
	newQuestion.save()
	return JsonResponse({"data": "Successful"},status=200)

@csrf_exempt
def askedquestion(request):
	try:
		username = request.POST['username']
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

@csrf_exempt
def askedquestionLawyer(request):
	try:
		username = request.POST['username']
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


