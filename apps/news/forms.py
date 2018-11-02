from django import forms
from django.forms import Form
from apps.forms import FormMixin


class PublicCommmentForm(forms.Form, FormMixin):
    content = forms.CharField()
    news_id = forms.IntegerField()



