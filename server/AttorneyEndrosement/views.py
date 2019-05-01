from django.shortcuts import render
from .models import Rating
from Lawyer.models import Lawyer 
from django.utils.datastructures import MultiValueDictKeyError
from django.contrib.auth.models import User
from Client.models import Client
from AttorneyEndrosement.models import AttorneyEndrosement
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect 
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['POST'])
def getEndorsementofLawyer(request):
	try:
		username = request.data.get('username',None) 
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	user = User.objects.get(username=username)
	lawyer = Lawyer.objects.get(user=user)
	data = list(AttorneyEndrosement.objects.filter(toLawyer=lawyer).values())
	for obj in data:
		lawyer1 = Lawyer.objects.get(id=obj['fromLawyer'])
		user = lawyer1.user.username
		obj['fromLawyer'] = lawyer1.user.username
		if lawyer1.image:
			obj['fromLawyerimage'] = str(lawyer1.image)
		else:
			obj['fromLawyerimage'] = ""
		obj['fromLawyername'] = client.user.first_name
	return JsonResponse(data,safe=False)


@api_view(['POST'])
def EndroseLawyer(request):
	try:
		username = request.data.get('username',None)
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	try:
		tousername = request.data.get('tousername',None) 
	except MultiValueDictKeyError:
		return HttpResponse("Lawyer username is required")
	try:
		rate = request.data.get('rate',None)
	except MultiValueDictKeyError:
		return HttpResponse("Rate is required")	
	try:
		if(int(rate) < 1 or int(rate) > 5):
			raise ValueError('Rate must be between 1 and 5')	
	except:
		return HttpResponse("Rate must be between 1 and 5")
	try:
		title = request.data.get('title',None)
	except MultiValueDictKeyError:
		return HttpResponse("Title is required")	
	try:
		description = request.data.get('description',None) 
	except MultiValueDictKeyError:
		return HttpResponse("Description is required")	
	try:
		isRecomended = request.data.get('isRecomended',None)
	except MultiValueDictKeyError:
		return HttpResponse("isRecomended is required")	
	try:
		isHired = request.data.get('isHired',None)
	except MultiValueDictKeyError:
		return HttpResponse("isHired is required")	
	try:
		email = request.data.get('email',None)
	except MultiValueDictKeyError:
		return HttpResponse("email is required")	
	
	user_id = User.objects.filter(username=username).values()		
	client_id = Lawyer.objects.filter(user=user_id[0]['id']).values()
	lawyer_user_id = User.objects.filter(username=tousername).values()		
	lawyer_id = Lawyer.objects.filter(user=lawyer_user_id[0]['id']).values()
	lawyer = Lawyer.objects.get(user=lawyer_user_id[0]['id'])
	client = Lawyer.objects.get(user=user_id[0]['id'])
	isAlready = EndroseLawyer.objects.filter(lawyerid=lawyer,clientid=client)
	if isAlready:
		return HttpResponse("already exist",status=201)
	newRating = Rating(lawyerid = lawyer , clientid = client,rate= int(rate),title=title,description=description,isHired=isHired,isRecomended=isRecomended,email=email)
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