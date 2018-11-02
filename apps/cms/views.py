from django.shortcuts import render
from utlis import restful
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.http import require_POST, require_GET
from apps.news.models import NewsCategory, News
from .forms import EditNewsCategoryForm, WriteNewsForm, BannnerForm
from django.views.generic import View
from .models import Banner
import os
from django.conf import settings
import qiniu
from .serializers import BannerSerialier
from django.core.paginator import Paginator
from datetime import datetime
from django.utils.timezone import make_aware
from urllib import parse  # 将对象转换为url参数


def login(request):
    return render(request, 'cms/login.html')


@staff_member_required(login_url='cms:login')
def index(request):
    return render(request, 'cms/index.html')


class WriteNewsView(View):
    def get(self, request):
        categories = NewsCategory.objects.all()
        context = {
            'categories': categories
        }

        return render(request, 'cms/write_news.html', context)

    def post(self, request):
        form = WriteNewsForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data.get('title')
            desc = form.cleaned_data.get('desc')
            thumbnail = form.cleaned_data.get('thumbnail')
            content = form.cleaned_data.get('content')
            category_id = form.cleaned_data.get('category')
            category = NewsCategory.objects.filter(pk=category_id).first()
            News.objects.create(title=title, desc=desc, thumbnail=thumbnail, content=content, category=category,
                                author=request.user)
            return restful.ok()
        else:
            return restful.params_error(message=form.get_errors())


@require_POST
def upload_file(request):
    file = request.FILES.get('file')
    name = file.name
    with open(os.path.join(settings.MEDIA_ROOT, name), 'wb') as fp:
        for chunk in file.chunks():
            fp.write(chunk)
    url = request.build_absolute_uri(settings.MEDIA_URL+name)
    return restful.result(data={'url': url})


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


@require_GET
def qntoken(request):
    access_key = settings.QINIU_ACCESS_KEY
    secret_key = settings.QINIU_SECRET_KEY

    bucket = settings.QINIU_BUCKET_NAME
    q = qiniu.Auth(access_key, secret_key)
    token = q.upload_token(bucket)
    return restful.result(data={'token':token})


def banners(request):
    return render(request, 'cms/banners.html')


def banner_list(request):
    banners = Banner.objects.all()
    serialize = BannerSerialier(banners, many=True)
    return restful.result(data=serialize.data)


class NewsListView(View):
    def get(self, request):
        page = request.GET.get('p', 1)  # 获取p参数，如果没有默认为1
        newses = News.objects.select_related('category', 'author')
        start = request.GET.get('start')
        end = request.GET.get('end')
        title = request.GET.get('title')
        category_id = int(request.GET.get('category', 0))

        if start or end:
            if start:
                start_date = datetime.strptime(start, '%Y/%m/%d')
            else:
                start_date = datetime(year=2018, month=6, day=1)

            if end:
                end_date = datetime.strptime(end, '%Y/%m/%d')
            else:
                end_date = datetime.today()

            newses = newses.filter(pub_time__range=(make_aware(start_date), make_aware(end_date)))

        if title:
            newses = newses.filter(title__contains=title)

        if category_id and category_id != 0:
            newses = newses.filter(category=category_id)

        paginator = Paginator(newses, 2)
        page_obj = paginator.page(page)
        context_data = self.get_pagination_data(paginator, page_obj)
        context = {
            'page_obj': page_obj,
            'categories': NewsCategory.objects.all(),
            'newses': page_obj.object_list,  # 当前页的数据列表
            'start': start,
            'end': end,
            'title': title,
            'category_id': category_id,
            'url_query': '&' + parse.urlencode({  # 将对象转换为url拼接字符串
                'start': start or '',
                'end': end or '',
                'title': title or '',
                'category': category_id or '0'
            })
        }
        context.update(context_data)
        return render(request, 'cms/news_list.html', context=context)

    def get_pagination_data(self, paginator, page_obj, around_count=2):
        current_page = page_obj.number
        num_pages = paginator.num_pages

        left_has_more = False
        right_has_more = False

        if current_page <= around_count + 2:
            left_pages = range(1, current_page)
        else:
            left_has_more = True
            left_pages = range(current_page - around_count, current_page)

        if current_page >= num_pages - around_count - 1:
            right_pages = range(current_page + 1, num_pages + 1)
        else:
            right_has_more = True
            right_pages = range(current_page + 1, current_page + around_count + 1)

        return {
            'left_pages': left_pages,
            'right_pages': right_pages,
            'current_page': current_page,
            'left_has_more': left_has_more,
            'right_has_more': right_has_more,
            'num_pages': num_pages
        }


class Banners(View):
    def get(self, request):
        banners = Banner.objects.all()
        context = {
            'banners': banners
        }
        return render(request, 'cms/banners.html', context=context)

    def post(self, request):
        form = BannnerForm(request.POST)
        try:
            if form.is_valid():
                link_to = form.cleaned_data.get('link_to')
                url = form.cleaned_data.get('thumbnail')
                thumbnail = request.build_absolute_uri(settings.MEDIA_URL + form.cleaned_data.get('thumbnail'))

                position = form.cleaned_data.get('position')
                in_use = form.cleaned_data.get('in_use')
                print('in_use', in_use)
                id = form.cleaned_data.get('id')
                if id:
                    banner = Banner.objects.filter(pk=id).update(
                        link_to=link_to, thumbnail=thumbnail, position=position, in_use=in_use)
                else:
                    banner = Banner.objects.create(link_to=link_to, thumbnail=thumbnail, position=position,
                                                   in_use=in_use)
                serialize = BannerSerialier(banner)
                return restful.ok(data=serialize.data)
        except Exception:
            raise Exception(form.get_errors())
        return restful.params_error(message=form.get_errors())



