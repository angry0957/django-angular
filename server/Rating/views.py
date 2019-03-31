from django.shortcuts import render
from .models import Rating
from Lawyer.models import Lawyer 
from django.contrib.auth.models import User
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
		obj['clientuser'] = User.objects.get(id=obj['clientid_id']).username
	return JsonResponse(data,safe=False)

