from django.shortcuts import render
from utlis import restful
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.http import require_POST, require_GET
from apps.news.models import NewsCategory
from .forms import EditNewsCategoryForm


def login(request):
    return render(request, 'cms/login.html')


@staff_member_required(login_url='cms:login')
def index(request):
    return render(request, 'cms/index.html')


def write_news(request):
    return render(request, 'cms/write_news.html')


@require_GET
def news_category(request):
    categories = NewsCategory.objects.all()
    context = {
        'categories': categories
    }
    return render(request, 'cms/news_category.html', context=context)


@require_POST
def add_news_category(request):
    name = request.POST.get('name')
    exists = NewsCategory.objects.filter(name=name).exists()
    if exists:
        return restful.params_error(message='该分类已存在')
    else:
        NewsCategory.objects.create(name=name)
        print('success')
        return restful.ok()


@require_POST
def edit_news_category(request):
    form = EditNewsCategoryForm(request.POST)
    if form.is_valid():
        pk = form.cleaned_data.get('pk')
        name = form.cleaned_data.get('name')
        try:
            NewsCategory.objects.filter(pk=pk).update(name=name)
            return restful.ok()
        except:
            return restful.params_error(message='该分类不存在！')
    else:
        return restful.params_error(message=form.get_error())


@require_POST
def del_news_category(request):
    pk = request.POST.get('pk')
    try:
        categories = NewsCategory.objects.filter(pk=pk).all()
        categories.delete()
        return restful.ok()
    except:
        return restful.params_error(message='删除操作失败！')
