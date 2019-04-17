from django.shortcuts import render
from Lawyer.models import Lawyer 
from django.utils.datastructures import MultiValueDictKeyError
from django.contrib.auth.models import User
from Client.models import Client
from .models import Saved
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect 

# Create your views here.
@csrf_exempt
def getSavedLawyers(request):
	try:
		username = request.POST['username'] 
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	user = User.objects.get(username=username)
	client = Client.objects.get(user=user)
	data = list(Saved.objects.filter(client=client).values())
	for obj in data:
		lawyer = Lawyer.objects.get(id=obj['lawyer_id'])
		obj['username'] = lawyer.user.username
		obj['about'] = lawyer.about
		obj['contact'] = lawyer.contact
		obj['email'] = lawyer.user.email
		obj['city'] = lawyer.city
		obj['firstname'] = lawyer.user.first_name
		obj['lastname'] = lawyer.user.last_name
		obj['state'] = lawyer.state
		obj['buisness_address'] = lawyer.buisness_address
		obj['phone_number'] = lawyer.phone_number
		obj['liscence_number'] = lawyer.liscence_number
		obj['hcr_number'] = lawyer.hcr_number
		obj['rate'] = lawyer.rate
		if lawyer.image:
			obj['image'] = "{0}{1}".format("http://localhost:8000", lawyer.image.url)
	return JsonResponse(data,safe=False)

@csrf_exempt
def addSaved(request):
	try:
		_lawyer = request.POST['lawyer'] 
	except MultiValueDictKeyError:
		return HttpResponse("Lawyer is required")
	try:
		_client = request.POST['client'] 
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	user = User.objects.get(username=_lawyer)
	lawyer = Lawyer.objects.get(user=user)
	user = User.objects.get(username=_client)
	client = Client.objects.get(user=user)
	saved = Saved(client=client,lawyer=lawyer)
	saved.save()
	return JsonResponse({"Message": "Saved"},safe=False)
