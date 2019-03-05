from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import Lawyer
from Client.models import Client
from Rating.models import Rating
from Question.models import Question
from Category.models import Category
from django.contrib.auth import authenticate, login
import datetime
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
	try:
		LicenseIDNumber = request.POST['LicenseIDNumber']
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"LicenseIDNumber is required"},status=500)
	try:
		BusinessAddress = request.POST['buisness_address']
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"BusinessAddress is required"},status=500)
	try:
		HCRNo = request.POST['hcr_number']
	except MultiValueDictKeyError:
		return JsonResponse({"Error":"hcr_number is required"},status=500)
	
	YearAdmitted = datetime.datetime.now()
	isTaken = User.objects.filter(username=Email).exists()
	if(isTaken):
		return JsonResponse({"Error": "The username is already taken"},status=501)
	isTaken = Lawyer.objects.filter(hcr_number=HCRNo).exists()
	if(isTaken):
		return JsonResponse({"Error": "The HCR is already taken"},status=501)
	user = User.objects.create_user(Email, Email,Password)
	user.first_name = 'lawyer'
	user.save()
	obj  = Lawyer(user=user,state=State,city=City,buisness_address=BusinessAddress,phone_number=PhoneNumber,liscence_number=LicenseIDNumber,year_admitted=YearAdmitted,hcr_number=HCRNo)
	obj.save()
	PARAMS = {'username':Email,'password': Password}
	r = requests.post('http://localhost:8000/auth-jwt/',PARAMS)
	obj = r.json()
	# encoded_jwt = obj['token']
	# print (jwt.decode(encoded_jwt,'AfnanSecret','HS256'))
	# print(obj['token'])
	return JsonResponse(obj)


def lawyers(request):
	return render(request, "index.html", {})

@csrf_exempt
def login1(request):
	try:
		Email = request.POST['username'] 
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	try:
		Password = request.POST['password']
	except MultiValueDictKeyError:
		return HttpResponse("Password is required")
	PARAMS = {'username':Email,'password': Password}
	r = requests.post('http://localhost:8000/auth-jwt/',PARAMS)
	obj = r.json()
	user = User.objects.get(username = Email)
	if user.first_name == 'client':
		obj['type'] = 'client'
	elif user.first_name == 'lawyer':
		obj['type'] = 'lawyer'	
	# user_id = User.objects.filter(username=Email).values()		
	# client_id = Client.objects.filter(user=user_id[0]['id']).values()
	# lawyer_user_id = User.objects.filter(username=Email).values()		
	# lawyer_id = Lawyer.objects.filter(user=lawyer_user_id[0]['id']).values()
	# lawyer = Lawyer.objects.get(user=lawyer_user_id[0]['id'])
	# if Lawyer.objects.filter(user=).exists()
	
	return JsonResponse(obj)
	# API_key = request.META.get('HTTP_AUTHORIZATION')
	# PARAMS = {'token': API_key}
	# data = requests.post('http://localhost:8000/auth-jwt-verify/',PARAMS)
	# data = data.json()
	# encoded_jwt = data['token']
	# decoded = jwt.decode(encoded_jwt,'AfnanSecret','HS256')
	# myuser = Lawyer.objects.filter(user=decoded['user_id']).values()
	
	# # myuser = Lawyer.objects.filter(user=decoded['username'])
	# all_lawyers = list(Lawyer.objects.values())
	# return JsonResponse(list(myuser),safe=False)
	# Email = request.POST['Email'] 
	# Password = request.POST['Password'] 
	# obj  =  authenticate(username=Email,password=Password)
	# if obj is not None:
	# 	login(request,obj)
	# 	PARAMS = {'username':Email,'password': Password}
	# 	r = requests.post('http://localhost:8000/auth-jwt/',PARAMS)
	# 	obj = r.json()
	# 	return JsonResponse(obj)

	# data = {
	# 	"data":"FAILED",
	# 	"Email": Email,
	# 	"password": Password,
	# 	"obj": obj
	# }
	return JsonResponse(data)

@csrf_exempt
def read(request):
	API_key = request.META.get('HTTP_AUTHORIZATION')
	return HttpResponse(API_key)

	data = Lawyer.objects.all()
	return JsonResponse({"data":data[0].username})

@csrf_exempt
def delete(request):
	data = Lawyer.objects.filter(username="user6@gmail.com")
	return JsonResponse({"data":data.delete()})

def update(request):
	data = Lawyer.objects.filter(username="user5@gmail.com")
	return JsonResponse({"data":data.update(phone_number="0321-4445-100")})


@csrf_exempt
def topLawyers(request):
	data = Lawyer.objects.annotate(Count('user')).order_by('-rating')[:3].values()
	return JsonResponse(list(data),safe=False)

@csrf_exempt
def lawyersByCity(request):
	try:
		city = request.POST['city'] 
	except MultiValueDictKeyError:
		return HttpResponse("City is required")
	data = Lawyer.objects.filter(city__icontains=city).values()
	return JsonResponse(list(data),safe=False)


@csrf_exempt
def testmany(request):
	try:
		username = request.POST['username'] 
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	try:
		lawyerusername = request.POST['lawyerusername'] 
	except MultiValueDictKeyError:
		return HttpResponse("Lawyer username is required")
	try:
		rate = request.POST['rate'] 
	except MultiValueDictKeyError:
		return HttpResponse("Rate is required")	
	try:
		if(int(rate) < 1 or int(rate) > 5):
			raise ValueError('Rate must be between 1 and 5')	
	except:
		return HttpResponse("Rate must be between 1 and 5")	

	user_id = User.objects.filter(username=username).values()		
	client_id = Client.objects.filter(user=user_id[0]['id']).values()
	lawyer_user_id = User.objects.filter(username=lawyerusername).values()		
	lawyer_id = Lawyer.objects.filter(user=lawyer_user_id[0]['id']).values()
	lawyer = Lawyer.objects.get(user=lawyer_user_id[0]['id'])
	client = Client.objects.get(user=user_id[0]['id'])
	newRating = Rating(lawyerid = lawyer , clientid = client,rate= int(rate))
	newRating.save()
	rating_user_id = Rating.objects.filter(lawyerid=lawyer_id[0]['id']).values()
	arr = list(rating_user_id)
	sum1 = 0
	for i in arr:
		sum1 = sum1 + i['rate']
	updatedRating = (sum1 + int(rate))/(len(arr) + 1)
	lawyer.rate = updatedRating
	lawyer.save() 
	# rating_id = Lawyer.objects.filter(user=rating_user_id[0]['id']).values()
	# question = Question.objects.filter(user=user_id[0]['id']).values()
	# catogery = Category.objects.filter(id=1).values()
	# question.catogery.add(catogery)
	# question.save()
	# question = Question.objects.filter(catogery=2).values()
	return JsonResponse("Saved",safe=False)	


@csrf_exempt
def questionByCity(request):
	try:
		city = request.POST['city'] 
	except MultiValueDictKeyError:
		return HttpResponse("City is required")
	category_id = Category.objects.filter(catogery=city).values()	
	question = Question.objects.filter(catogery=category_id[0]['id']).values()
	return JsonResponse(list(question),safe=False)	

@csrf_exempt
def questionByUser(request):
	try:
		username = request.POST['username'] 
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	user_id = User.objects.filter(username=username).values()	
	question = Question.objects.filter(user=user_id[0]['id']).values()
	return JsonResponse(list(question),safe=False)	



@csrf_exempt
def RateLawyer(request):
	try:
		username = request.POST['username'] 
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	try:
		lawyerusername = request.POST['lawyerusername'] 
	except MultiValueDictKeyError:
		return HttpResponse("Lawyer username is required")
	try:
		rate = request.POST['rate'] 
	except MultiValueDictKeyError:
		return HttpResponse("Rate is required")	
	try:
		if(int(rate) < 1 or int(rate) > 5):
			raise ValueError('Rate must be between 1 and 5')	
	except:
		return HttpResponse("Rate must be between 1 and 5")	

	user_id = User.objects.filter(username=username).values()		
	client_id = Client.objects.filter(user=user_id[0]['id']).values()
	lawyer_user_id = User.objects.filter(username=lawyerusername).values()		
	lawyer_id = Lawyer.objects.filter(user=lawyer_user_id[0]['id']).values()
	lawyer = Lawyer.objects.get(user=lawyer_user_id[0]['id'])
	client = Client.objects.get(user=user_id[0]['id'])
	newRating = Rating(lawyerid = lawyer , clientid = client,rate= int(rate))
	newRating.save()
	rating_user_id = Rating.objects.filter(lawyerid=lawyer_id[0]['id']).values()
	arr = list(rating_user_id)
	sum1 = 0
	for i in arr:
		sum1 = sum1 + i['rate']
	updatedRating = (sum1 + int(rate))/(len(arr) + 1)
	lawyer.rate = updatedRating
	lawyer.save() 
	return JsonResponse("Saved",safe=False)	


@csrf_exempt
def verify(request):
	try:
		token = request.POST['token'] 
	except MultiValueDictKeyError:
		return HttpResponse("Token is required")
	PARAMS = {'token':token}
	try:
		r = requests.post('http://localhost:8000/auth-jwt-verify/',PARAMS)
	except Exception as e:
		return JsonResponse({"Error":"Token Error","Err": e})
	r = r.json()
	check = r.get('non_field_errors', 'None')	
	if check != 'None':
		return JsonResponse({"Error": "Token is not valid"},status=403)	

	obj = r
	encoded_jwt = obj['token']
	data = jwt.decode(encoded_jwt,'AfnanSecret','HS256')
	user = User.objects.get(username = data['username'])
	if user.first_name == 'client':
		obj['type'] = 'client'
	elif user.first_name == 'lawyer':
		obj['type'] = 'lawyer'		
	return JsonResponse(obj)	
