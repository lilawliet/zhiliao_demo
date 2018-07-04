from django import forms
from apps.forms import FormMixin
from django.core.cache import cache
from .models import User
from django.core import validators


class LoginForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11)
    password = forms.CharField(max_length=10, min_length=6)
    remember = forms.IntegerField(required=False)


class RegistForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11, required=True, error_messages={'required': '请输入手机号码'})
    username = forms.CharField(max_length=20, required=True, error_messages={'required': '请输入用户名'})
    password1 = forms.CharField(max_length=11, min_length=6, required=True, error_messages={
        'max_length': '密码最多不能超过11位', 'min_length': '密码最少不能低于6位', 'required': '请输入密码'
    })
    password2 = forms.CharField(max_length=11, min_length=6, required=True, error_messages={
        'max_length': '密码最多不能超过11位', 'min_length': '密码最少不能低于6位', 'required': '请输入确认密码'
    })
    img_captcha = forms.CharField(min_length=4, max_length=4, required=True, error_messages={
        'max_length': '图形验证码错误', 'min_length': '图形验证码错误', 'required': '请输入图形验证码'
    })
    sms_captcha = forms.CharField(min_length=4, max_length=4, required=True, error_messages={
        'max_length': '短信验证码错误', 'min_length': '短信验证码错误', 'required': '请输入短信验证码'
    })

    def clean_img_captcha(self):
        img_captcha = self.cleaned_data.get('img_captcha')
        if not img_captcha:
            raise forms.ValidationError('图形验证码错误')
        else:
            print(img_captcha)
            return img_captcha

    def clean(self):
        cleaned_data = super(RegistForm, self).clean()
        print(cleaned_data)
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 != password2:
            raise forms.ValidationError('两次密码输入不一致！')
        img_captcha = cleaned_data.get('img_captcha')
        if not img_captcha:
            raise forms.ValidationError('请输入图形验证码')
        cached_img_captcha = cache.get(img_captcha.lower())
        if not cached_img_captcha:
            raise forms.ValidationError('图形验证码错误')
        telephone = cleaned_data.get('telephone')
        sms_captcha = cleaned_data.get('sms_captcha')
        cached_sms_captcha = cache.get(telephone)

        if not cached_sms_captcha or cached_sms_captcha.lower() != sms_captcha.lower():
            raise forms.ValidationError('短信验证码错误')

        exists = User.objects.filter(telephone=telephone).exists()
        if exists:
            raise forms.ValidationError('该手机号码已注册')
