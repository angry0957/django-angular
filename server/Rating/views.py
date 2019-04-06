from django.shortcuts import render
from .models import Rating
from Lawyer.models import Lawyer 
from django.utils.datastructures import MultiValueDictKeyError
from django.contrib.auth.models import User
from Client.models import Client
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect 
# Create your views here.

@csrf_exempt
def getRatingofLawyer(request):
	try:
		username = request.POST['username'] 
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	user = User.objects.get(username=username)
	lawyer = Lawyer.objects.get(user=user)
	data = list(Rating.objects.filter(lawyerid=lawyer).values())
	for obj in data:
		client = Client.objects.get(id=obj['clientid_id'])
		user = client.user.username
		obj['clientuser'] = client.user.username
		if client.image:
			obj['clientimage'] = str(client.image)
		else:
			obj['clientimage'] = ""
		obj['clientname'] = client.user.first_name
	return JsonResponse(data,safe=False)

