from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import Client
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
import requests
import jwt
from django.utils.datastructures import MultiValueDictKeyError
from django.db.models import Count




# Create your views here.

@csrf_exempt
def signup(request):
	try:
		Email = request.POST['username'] 
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Email is required"},status=500)

	try:
		Password = request.POST['password']
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Password is required"},status=500)
	try:
		City = request.POST['city']
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"City is required"},status=500)	 
	try:
		State = request.POST['state'] 
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"State is required"},status=500)
	try:
		PhoneNumber = request.POST['phoneNumber'] 
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Phone Number is required"},status=500)
	
	isTaken = User.objects.filter(username=Email).exists()
	if(isTaken):
		return JsonResponse({"Error":"The username is already taken"},status=501)
	
	user = User.objects.create_user(Email, Email,Password)
	user.first_name = 'client'
	user.save()
	obj  = Client(user=user,state=State,city=City,phone_number=PhoneNumber)
	obj.save()
	PARAMS = {'username':Email,'password': Password}
	r = requests.post('http://localhost:8000/auth-jwt/',PARAMS)
	obj = r.json()
	return JsonResponse(obj)