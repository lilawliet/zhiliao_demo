from apps.forms import FormMixin
from django import forms
from apps.news.models import News
from apps.course.models import Course

class EditNewsCategoryForm(forms.Form):
    pk = forms.IntegerField(required=True, error_messages={'required': '必须传入分类id'})
    name = forms.CharField(max_length=100)


class WriteNewsForm(forms.ModelForm, FormMixin):
    category = forms.IntegerField()

    class Meta:
        model = News
        exclude = ['category', 'author', 'pub_time']


class BannnerForm(forms.Form, FormMixin):
    link_to = forms.URLField()
    thumbnail = forms.CharField()
    position = forms.IntegerField(required=False)
    in_use = forms.BooleanField()


class PubCourseForm(forms.ModelForm, FormMixin):
    category_id = forms.IntegerField()
    teacher_id = forms.IntegerField()

    class Meta:
        model = Course
        exclude = ("category", 'teacher')
