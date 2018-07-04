from django.urls import path
from . import views


app_name = 'my_auth'

urlpatterns = [
    path('login/', views.my_login, name='login'),
    path('logout/', views.my_logout, name='logout'),
    path('img_captcha/', views.img_captchar, name='img_captcha'),
    path('sms_captcha/', views.sms_captcha, name='sms_captcha'),
    path('cache_test/', views.cache_test),
    path('regist/', views.my_register, name='regist')
]