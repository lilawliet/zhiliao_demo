from apps.forms import FormMixin
from django import forms


class EditNewsCategoryForm(forms.Form):
    pk = forms.IntegerField(required=True, error_messages={'required': '必须传入分类id'})
    name = forms.CharField(max_length=100)
