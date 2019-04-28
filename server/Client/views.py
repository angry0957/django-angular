from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import Client
from django.http import HttpResponse
import json
import requests
import jwt
from django.utils.datastructures import MultiValueDictKeyError
from django.db.models import Count
import base64
from django.core.files.base import ContentFile
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny

# Create your views here.

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def signup(request):
	try:
		Email = request.data.get('username',None) 
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Email is required"},status=500)
	try:
		Password = request.data.get('password',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Password is required"},status=500)
	try:
		City = request.data.get('city',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"City is required"},status=500)	 
	try:
		State = request.data.get('state',None) 
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"State is required"},status=500)
	try:
		PhoneNumber = request.data.get('phoneNumber',None) 
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


@api_view(['POST'])
def editProfile(request):
	try:
		username = request.data.get('username',None) 
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	try:
		photo=request.data.get('image',None)	
	except MultiValueDictKeyError:
		return JsonResponse({"Error": "Image Required"})
	try:
		firstname = request.data.get('firstname',None)	
	except MultiValueDictKeyError:
		return JsonResponse({"Error": "First name Required"})	
	try:
		lastname=request.data.get('lastname',None)	
	except MultiValueDictKeyError:
		return JsonResponse({"Error": "Last name Required"})	
	try:
		email=request.data.get('email',None)	
	except MultiValueDictKeyError:
		return JsonResponse({"Error": "Email Required"})	
	try:
		City = request.data.get('city',None)
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"City is required"},status=500)	 
	try:
		State = request.data.get('state',None) 
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"State is required"},status=500)
	try:
		PhoneNumber = request.data.get('phoneNumber',None) 
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"Phone Number is required"},status=500)
	
	user = User.objects.get(username=username)
	client = Client.objects.get(user=user)
	Clientid = client.id
	
	if photo.find('http://localhost:8000') == -1:
		data = photo.split(',')[1]
		imgdata = base64.b64decode(data)
		filename = username + '.jpg'
		file = ContentFile(imgdata,name=filename)  
		client.image  = file
		file.close()
	user.first_name = firstname
	user.last_name = lastname
	client.city = City
	client.state = State
	client.phone_number = PhoneNumber
	user.email= email
	user.save()
	client.save()
	return JsonResponse({"Success": "Image Saved"})

@api_view(['GET'])
def getClients(request):
	data = Client.objects.all()
	usernames = list()
	for index,user in enumerate(data):
		usernames.append(user.user.username)
	data = list(data.values())
	for index,obj in enumerate(data):
		obj['username'] = usernames[index]
	return JsonResponse(data,safe=False)