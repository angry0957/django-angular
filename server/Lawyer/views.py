from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, FileResponse, Http404
from django.contrib.auth.models import User
from .models import Lawyer
from Client.models import Client
from Rating.models import Rating
from Question.models import Question
from Category.models import Category
from Chat.models import ChatMessage
from LawyerCategory.models import LawyerCategory
from django.contrib.auth import authenticate, login
import datetime
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
import requests
import jwt
from django.utils.datastructures import MultiValueDictKeyError
from django.db.models import Count
import base64
from django.core.files.base import ContentFile
from django.conf import settings
import smtplib
import random
from reportlab.pdfgen import canvas
from config.credentials import MAIL,PASSWORD

# Create your views here.


allCodes = list()

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
	user.email = Email
	user.save()
	obj  = Lawyer(user=user,state=State,city=City,buisness_address=BusinessAddress,phone_number=PhoneNumber,liscence_number=LicenseIDNumber,year_admitted=YearAdmitted,hcr_number=HCRNo)
	obj.save()
	PARAMS = {'username':Email,'password': Password}
	r = requests.post('http://localhost:8000/auth-jwt/',PARAMS)
	obj = r.json()
	return JsonResponse(obj)


def lawyers(request):
	return render(request, "index.html", {})

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
	data = list(Lawyer.objects.order_by('-rating').reverse()[:3].values())
	return JsonResponse(data,safe=False)

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
		mail = request.POST['mail'] 
	except MultiValueDictKeyError:
		return HttpResponse("Mail is required")
	code = str(random.randint(100000,999999))
	gmail_user = MAIL
	gmail_app_password = PASSWORD
	sent_from = gmail_user
	sent_to = [mail]
	sent_subject = "Django"
	sent_body = ("Hello from Abdul Rahman")
	SUBJECT = "My Subject"
	TEXT = "Your code us {}".format(code)
	message = 'Subject: {}\n\n{}'.format(SUBJECT, TEXT)
	try:
		server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
		server.ehlo()
		server.login(gmail_user, gmail_app_password)
		server.sendmail(sent_from, sent_to, message)
		server.close()
		allCodes.append({"user": mail, "code": code})
	except Exception as exception:
		return HttpResponse(exception)
	return HttpResponse("The code is sent in Mail")	

@csrf_exempt
def verifyCode(request):
	try:
		code = request.POST['code'] 
	except MultiValueDictKeyError:
		return HttpResponse("Code is required")
	try:
		mail = request.POST['mail'] 
	except MultiValueDictKeyError:
		return HttpResponse("Mail is required")
	for obj in allCodes:
		if code == obj['code'] and mail == obj['mail']:
			allCodes.remove(obj)
	return JsonResponse({"Message": "Fail"},safe=False,status=403)

@csrf_exempt
def updatePassword(request):
	try:
		password = request.POST['password'] 
	except MultiValueDictKeyError:
		return HttpResponse("Password is required")
	try:
		mail = request.POST['mail'] 
	except MultiValueDictKeyError:
		return HttpResponse("Mail is required")
	user = User.objects.get(username=mail)
	user.set_password(password)
	user.save()
	return JsonResponse({"Message": "Success"},safe=False,status=200)

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
	try:
		title = request.POST['title'] 
	except MultiValueDictKeyError:
		return HttpResponse("Title is required")	
	try:
		description = request.POST['description'] 
	except MultiValueDictKeyError:
		return HttpResponse("Description is required")	
	try:
		isRecomended = request.POST['isRecomended'] 
	except MultiValueDictKeyError:
		return HttpResponse("isRecomended is required")	
	try:
		isHired = request.POST['isHired'] 
	except MultiValueDictKeyError:
		return HttpResponse("isHired is required")	
	try:
		email = request.POST['email'] 
	except MultiValueDictKeyError:
		return HttpResponse("email is required")	
	
	user_id = User.objects.filter(username=username).values()		
	client_id = Client.objects.filter(user=user_id[0]['id']).values()
	lawyer_user_id = User.objects.filter(username=lawyerusername).values()		
	lawyer_id = Lawyer.objects.filter(user=lawyer_user_id[0]['id']).values()
	lawyer = Lawyer.objects.get(user=lawyer_user_id[0]['id'])
	client = Client.objects.get(user=user_id[0]['id'])
	isAlready = Rating.objects.filter(lawyerid=lawyer,clientid=client)
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
		return JsonResponse({"Error": "Token is not valid"},status=400)	
	obj = r
	encoded_jwt = obj['token']
	data = jwt.decode(encoded_jwt,'AfnanSecret','HS256')
	user = User.objects.get(username = data['username'])
	try:
		lawyer = Lawyer.objects.get(user=user)
		obj['type'] = 'lawyer'
		obj['username'] = user.username
		obj['about'] = lawyer.about
		obj['contact'] = lawyer.contact
		obj['email'] = user.email
		obj['city'] = lawyer.city
		obj['firstname'] = user.first_name
		obj['lastname'] = user.last_name
		obj['state'] = lawyer.state
		obj['buisness_address'] = lawyer.buisness_address
		obj['phone_number'] = lawyer.phone_number
		obj['liscence_number'] = lawyer.liscence_number
		obj['hcr_number'] = lawyer.hcr_number
		if lawyer.image:
			obj['image'] = "{0}{1}".format("http://localhost:8000", lawyer.image.url)
		return JsonResponse(obj)	
	except Exception as e:
		try:
			client = Client.objects.get(user=user)
			obj['type'] = 'client'
			obj['username'] = user.username
			obj['city'] = client.city
			obj['phone_number'] = client.phone_number
			obj['state'] = client.state
			obj['firstname'] = user.first_name
			obj['email'] = user.email
			obj['lastname'] = user.last_name
			if client.image:
				obj['image'] = "{0}{1}".format("http://localhost:8000", client.image.url)
			return JsonResponse(obj)
		except Exception as e:
			return JsonResponse({"Error": e})	

@csrf_exempt
def editProfile(request):
	try:
		categories = request.POST['categories'] 
	except MultiValueDictKeyError:
		return HttpResponse("Categories is required")
	try:
		username = request.POST['username'] 
	except MultiValueDictKeyError:
		return HttpResponse("Username is required")
	try:
		photo=request.POST['image']	
	except MultiValueDictKeyError:
		return JsonResponse({"Error": "Image Required"})
	try:
		about=request.POST['about']	
	except MultiValueDictKeyError:
		return JsonResponse({"Error": "about Required"})
	try:
		contact=request.POST['contact']	
	except MultiValueDictKeyError:
		return JsonResponse({"Error": "contact Required"})
	try:
		firstname = request.POST['firstname']	
	except MultiValueDictKeyError:
		return JsonResponse({"Error": "First name Required"})	
	try:
		lastname=request.POST['firstname']	
	except MultiValueDictKeyError:
		return JsonResponse({"Error": "Last name Required"})	
	try:
		email=request.POST['email']	
	except MultiValueDictKeyError:
		return JsonResponse({"Error": "Email Required"})	
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

	user = User.objects.get(username=username)
	lawyer = Lawyer.objects.get(user=user)
	allcategories = json.loads(categories)
	lawyerid = lawyer.id
	for i in allcategories:
		if bool(i['checked']) == False:
			try:
				cat = Category.objects.get(id=i['id'])
				obj = LawyerCategory.objects.get(lawyerid=lawyer,categoryid=cat)
				obj.delete()
			except LawyerCategory.DoesNotExist:
				pass
		else:
			try:
				cat = Category.objects.get(id=i['id'])
				LawyerCategory.objects.get(lawyerid=lawyer,categoryid=cat)
			except LawyerCategory.DoesNotExist:
				obj = LawyerCategory(lawyerid=lawyer,categoryid=cat)
				obj.save()

	if photo.find('http://localhost:8000') == -1:
		data = photo.split(',')[1]
		imgdata = base64.b64decode(data)
		filename = username + '.jpg'
		file = ContentFile(imgdata,name=filename)  
		lawyer.image  = file
		file.close()
	lawyer.about = about
	lawyer.contact = contact
	user.first_name = firstname
	user.last_name = lastname
	lawyer.city = City
	lawyer.state = State
	lawyer.phone_number = PhoneNumber
	lawyer.liscence_number = LicenseIDNumber
	lawyer.hcr_number = HCRNo
	user.email= email
	user.save()
	lawyer.save()
	return JsonResponse({"Success": "Image Saved"})

@csrf_exempt
def getLawyerById(request):
	try:
		lawyerid = request.POST['lawyerid'] 
	except MultiValueDictKeyError:
		return HttpResponse("lawyerid is required")
	data = list(Lawyer.objects.filter(id=lawyerid).values())[0]
	user = list(User.objects.filter(id=data["user_id"]).values())[0]
	data["username"] = user["username"]
	data["first_name"] = user["first_name"]
	data["last_name"] = user["last_name"]
	return JsonResponse(data,safe=False)

@csrf_exempt
def login(request):
	try:
		username = request.POST['username'] 
	except MultiValueDictKeyError:
		return HttpResponse("username is required")
	try:
		password = request.POST['password'] 
	except MultiValueDictKeyError:
		return HttpResponse("Password is required")
	PARAMS = {'username':username,'password':password}
	try:
		r = requests.post('http://localhost:8000/auth-jwt/',PARAMS)
	except Exception as e:
		return JsonResponse({"Error":"Token Error","Err": e})
	r = r.json()
	check = r.get('non_field_errors', 'None')	
	if check != 'None':
		return JsonResponse({"Error": "Token is not valid"},status=500)	
	obj = r
	encoded_jwt = obj['token']
	data = jwt.decode(encoded_jwt,'AfnanSecret','HS256')
	user = User.objects.get(username = data['username'])
	try:
		lawyer = Lawyer.objects.get(user=user)
		obj['type'] = 'lawyer'
		obj['username'] = user.username
		obj['about'] = lawyer.about
		obj['contact'] = lawyer.contact
		obj['email'] = user.email
		obj['city'] = lawyer.city
		obj['firstname'] = user.first_name
		obj['lastname'] = user.last_name
		obj['state'] = lawyer.state
		obj['buisness_address'] = lawyer.buisness_address
		obj['phone_number'] = lawyer.phone_number
		obj['liscence_number'] = lawyer.liscence_number
		obj['hcr_number'] = lawyer.hcr_number
		if lawyer.image:
			obj['image'] = "{0}{1}".format("http://localhost:8000", lawyer.image.url)
		return JsonResponse(obj)	
	except Exception as e:
		try:
			client = Client.objects.get(user=user)
			obj['type'] = 'client'
			obj['username'] = user.username
			obj['city'] = client.city
			obj['phone_number'] = client.phone_number
			obj['state'] = client.state
			obj['firstname'] = user.first_name
			obj['email'] = user.email
			obj['lastname'] = user.last_name
			if client.image:
				obj['image'] = client.image.url
			return JsonResponse(obj)
		except Exception as e:
			return JsonResponse({"Error": e})	

@csrf_exempt
def getLawyers(request):
	data = Lawyer.objects.all()
	usernames = list()
	for index,user in enumerate(data):
		usernames.append(user.user.username)
	data = list(data.values())
	for index,obj in enumerate(data):
		obj['username'] = usernames[index]
	return JsonResponse(data,safe=False)


@csrf_exempt
def getChat(request):
	try:
		lawyer = request.POST['lawyer'] 
	except MultiValueDictKeyError:
		return HttpResponse("Lawyer is required")
	try:
		client = request.POST['client'] 
	except MultiValueDictKeyError:
		return HttpResponse("username is required")
	c = canvas.Canvas("hello.pdf")
	l_obj = User.objects.get(username=lawyer)
	c_obj = User.objects.get(username=client)    
	chat1 = list(ChatMessage.objects.filter(fromUser=l_obj,toUser=c_obj).values())
	chat2 = list(ChatMessage.objects.filter(fromUser=c_obj,toUser=l_obj).values())
	chat = list()
	for obj in chat1:
		chat.append(obj)
	for obj in chat2:
		chat.append(obj)
	chat.sort(key=lambda item:item['created'], reverse=False)

	my_dict = {}
	count = 0
	c.drawString(100, 800, "Chat")
	for obj in chat:
		count = count+1
		c.drawString(30, 750-count*20, User.objects.get(id=obj['fromUser_id']).username + " : " + obj['message'] + "      "  + str(obj['created']))
	c.save()
	try:
		# return response['Content-Disposition'] = 'attachment; filename="/home/abdul/Desktop/Afnan/ngdj/server/hello.pdf"'
		return FileResponse(open('/home/abdul/Desktop/Afnan/ngdj/server/hello.pdf', 'rb'), content_type='application/pdf')
	except FileNotFoundError:
		raise Http404()
