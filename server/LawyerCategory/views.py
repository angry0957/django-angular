from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from .models import LawyerCategory
from Lawyer.models import Lawyer
from Category.models import Category
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse
from django.utils.datastructures import MultiValueDictKeyError
# Create your views here.


@csrf_exempt
def getLawyersByCategory(request):
	try:
		catogery = request.POST['catogery'] 
	except MultiValueDictKeyError:
		return HttpResponse("Category is required")
	try:
		category_id = Category.objects.get(catogery=catogery)
	except Exception as e:
		return HttpResponse(e)

	data = LawyerCategory.objects.filter(categoryid=category_id).values()
	return JsonResponse(list(data),safe=False)

@csrf_exempt
def getCategoryofLawyer(request):
	try:
		username = request.POST['username'] 
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	user = User.objects.get(username=username)
	lawyer = Lawyer.objects.get(user=user)
	lawyercategory = LawyerCategory.objects.filter(lawyerid = lawyer).values()
	return JsonResponse(list(lawyercategory),safe=False)