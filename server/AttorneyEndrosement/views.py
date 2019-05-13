from django.shortcuts import render
from .models import AttorneyEndrosement
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
	
	fromLawyer = request.data.get('fromLawyer',None) 
	if fromLawyer is None:
		return JsonResponse({"Error": "fromLawyer is required"})

	#fromU = Lawyer.objects.get(user=user)
	user = User.objects.get(username=fromLawyer)
	lawyer = Lawyer.objects.get(user=user)
	data = list(AttorneyEndrosement.objects.filter(toLawyer=lawyer).values())
	#return JsonResponse(data,safe=False)
	# for obj in data:
	# 	lawyer1 = Lawyer.objects.get(id=obj['id'])
	# 	user = lawyer1.user.username
	# 	obj['fromLawyer'] = lawyer1.user.username
	# 	if lawyer1.image:
	# 		obj['fromLawyerimage'] = str(lawyer1.image)
	# 	else:
	# 		obj['fromLawyerimage'] = ""
	# 	obj['fromLawyername'] = lawyer1.user.first_name
	return JsonResponse(data,safe=False)


@api_view(['POST'])
def EndroseLawyer(request):
	
	fromLawyer = request.data.get('fromLawyer',None)
	if fromLawyer is None:
		return JsonResponse({"Error": "fromLawyer is required"})
	
	toLawyer = request.data.get('toLawyer',None) 
	if toLawyer is None:
		return JsonResponse({"Error": "toLawyer is required"})
	
	rate = request.data.get('rate',None)
	if rate is None:
		return JsonResponse("Rate is required")	
	try:
		if(int(rate) < 1 or int(rate) > 5):
			raise ValueError('Rate must be between 1 and 5')	
	except:
		return HttpResponse("Rate must be between 1 and 5")
	
	title = request.data.get('title',None)
	if title is None:
		return JsonResponse({"Error": "Title is required"})	
	
	description = request.data.get('description',None) 
	if description is None:
		return JsonResponse({"Error": "Description is required"})	
	
	isRecomended = request.data.get('isRecomended',None)
	if isRecomended is None:
		return JsonResponse({"Error": "isRecomended is required"})	
	
	user1 = User.objects.get(username=fromLawyer)
	user2 = User.objects.get(username=toLawyer)

	lawyer1 = Lawyer.objects.get(user=user1)
	lawyer2 = Lawyer.objects.get(user=user2)


	obj = AttorneyEndrosement(fromLawyer=lawyer1,toLawyer=lawyer2,title=title,description=description,rate=rate,isRecomended=isRecomended)
	obj.save()



	# user_id = User.objects.filter(username=username).values()		
	# client_id = Lawyer.objects.filter(user=user_id[0]['id']).values()
	# lawyer_user_id = User.objects.filter(username=tousername).values()		
	# lawyer_id = Lawyer.objects.filter(user=lawyer_user_id[0]['id']).values()
	# lawyer = Lawyer.objects.get(user=lawyer_user_id[0]['id'])
	# client = Lawyer.objects.get(user=user_id[0]['id'])
	# isAlready = EndroseLawyer.objects.filter(lawyerid=lawyer,clientid=client)
	# if isAlready:
	# 	return HttpResponse("already exist",status=201)
	# newRating = Rating(lawyerid = lawyer , clientid = client,rate= int(rate),title=title,description=description,isHired=isHired,isRecomended=isRecomended,email=email)
	# newRating.save()
	# rating_user_id = Rating.objects.filter(lawyerid=lawyer_id[0]['id']).values()
	# arr = list(rating_user_id)
	# sum1 = 0
	# for i in arr:
	# 	sum1 = sum1 + i['rate']
	# updatedRating = (sum1 + int(rate))/(len(arr) + 1)
	# lawyer.rate = updatedRating
	# lawyer.save() 
	return JsonResponse({"Success":"Saved"},safe=False)