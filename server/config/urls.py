"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic.base import TemplateView
from Lawyer import views as myview
from Client import views as clientview
from Question import views as questionview
from Category import views as categoryview
from LawyerCategory import views as lawyercategoryview
from Reply import views as replyview
from django.views.generic.base import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.views import obtain_auth_token  # <-- Here
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import refresh_jwt_token
from rest_framework_jwt.views import verify_jwt_token

urlpatterns = [
    path('auth-jwt/', obtain_jwt_token),
    path('auth-jwt-refresh/', refresh_jwt_token),
    path('auth-jwt-verify/', verify_jwt_token),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),  # <-- And here
    path('product/', include('product.urls')),
    path('admin/', admin.site.urls),
	path('login/', myview.login1),
    path('askquestion/', questionview.askquestion),
    path('askedquestion/', questionview.askedquestion),
    path('replyquestion/', replyview.replyquestion),
    path('getreplyquestion/', replyview.getreplyquestion),
    path('verify/', myview.verify),
    path('read/', myview.read),
    path('delete/', myview.delete),
    path('update/', myview.update),
    path('adduser/', myview.signup),
    path('editProfile/', myview.editProfile),
    path('', RedirectView.as_view(pattern_name='home', permanent=False)),
    path('SignupLawyer/', myview.lawyers , name='SignupLawyer'),
    path('SignupClient/', clientview.signup),
    path('accounts/', include('django.contrib.auth.urls')),
    path('signin/', TemplateView.as_view(template_name='SignIn.html'),name='login'),
    path('signup/', TemplateView.as_view(template_name='SignUp.html'),name='signup'),
    path('home/', TemplateView.as_view(template_name='home.html'),name='home'),
    path('topLawyers/', myview.topLawyers),
    path('lawyersByCity/', myview.lawyersByCity),
    path('RateLawyer/', myview.RateLawyer),
    path('testmany/', myview.testmany),
    path('getLawyersByCategory/',lawyercategoryview.getLawyersByCategory),
    path('getCategoryofLawyer/',lawyercategoryview.getCategoryofLawyer),
    path('getCategories/',categoryview.getCategories),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns +=static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
