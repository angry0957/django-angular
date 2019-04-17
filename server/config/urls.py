"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, url
    2. Add a URL to urlpatterns:  url('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import url
# from django.urls import include, url
from django.views.generic.base import TemplateView
from Lawyer import views as myview
from Rating import views as ratingview
from Client import views as clientview
from Question import views as questionview
from Category import views as categoryview
from LawyerCategory import views as lawyercategoryview
from Reply import views as replyview
from Saved import views as savedview
from django.views.generic.base import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.views import obtain_auth_token  # <-- Here
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import refresh_jwt_token
from rest_framework_jwt.views import verify_jwt_token

urlpatterns = [
    url('auth-jwt/', obtain_jwt_token),
    url('auth-jwt-refresh/', refresh_jwt_token),
    url('auth-jwt-verify/', verify_jwt_token),
    url('api-token-auth/', obtain_auth_token, name='api_token_auth'),  # <-- And here
    url('getLawyers/', myview.getLawyers),
    url('getClients/', clientview.getClients),
    url('', admin.site.urls),
    url('loginUser/', myview.login),
    url('askquestion/', questionview.askquestion),
    url('askedquestion/', questionview.askedquestion),
    url('askedquestionLawyer/', questionview.askedquestionLawyer),
    url('review/', ratingview.getRatingofLawyer),
    url('getSavedLawyers/', savedview.getSavedLawyers),
    url('addSaved/', savedview.addSaved),

    url('replyquestion/', replyview.replyquestion),
    url('getreply/', replyview.getreplyquestion),
    url('verify/', myview.verify),
    url('updatePassword/', myview.updatePassword),
    url('verifyCode/', myview.verifyCode),
    url('getChat/', myview.getChat),
    
    url('read/', myview.read),
    url('delete/', myview.delete),
    url('update/', myview.update),
    url('adduser/', myview.signup),
    url('editProfile/', myview.editProfile),
    url('editProfileClient/', clientview.editProfile),
    # url('', RedirectView.as_view(pattern_name='home', permanent=False)),
    url('SignupLawyer/', myview.lawyers , name='SignupLawyer'),
    url('SignupClient/', clientview.signup),
    # url('accounts/', django.contrib.auth.urls),
    # url('signin/', TemplateView.as_view(template_name='SignIn.html')),
    # url('signup/', TemplateView.as_view(template_name='SignUp.html'),name='signup'),
    # url('home/', TemplateView.as_view(template_name='home.html'),name='home'),
    url('topLawyers/', myview.topLawyers),
    url('lawyersByCity/', myview.lawyersByCity),
    url('RateLawyer/', myview.RateLawyer),
    url('testmany/', myview.testmany),
    url('getLawyersByCategory/',lawyercategoryview.getLawyersByCategory),
    url('getCategoryofLawyer/',lawyercategoryview.getCategoryofLawyer),
    url('getCategories/',categoryview.getCategories),
    url('getLawyerById/',myview.getLawyerById),


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns +=static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
