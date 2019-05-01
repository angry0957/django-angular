from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import LawyerCategory
from Lawyer.models import Lawyer
from Category.models import Category
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework.decorators import api_view
# Create your views here.


@api_view(['POST'])
def getLawyersByCategory(request):
	try:
		catogery = request.data.get('catogery',None) 
	except MultiValueDictKeyError:
		return JsonResponse({'Error':"Category is required"},status=400)
	try:
		category_id = Category.objects.get(catogery=catogery)
	except Exception as e:
		return JsonResponse({'Error': e},status=400)

	data = LawyerCategory.objects.filter(categoryid=category_id).values()
	return JsonResponse(list(data),safe=False)

@api_view(['POST'])
def getCategoryofLawyer(request):
	username = request.data.get('username',None) 
	if username is None:
		return HttpResponse("Username is required")
	user = User.objects.get(username=username)
	lawyer = Lawyer.objects.get(user=user)
	lawyercategory = LawyerCategory.objects.filter(lawyerid = lawyer).values()
	return JsonResponse(list(lawyercategory),safe=False)