from django.shortcuts import render
from .models import News, NewsCategory, Comment
from django.conf import settings
from utlis import restful
from .serializers import NewsSerializer, CommentSerializer
from django.http import Http404
from .forms import PublicCommmentForm
from django.contrib.auth.decorators import login_required
from apps.my_auth.decorators import my_login_required
from apps.cms.models import Banner

def index(request):
    count = settings.LOAD_NEWS_COUNT
    banners = Banner.objects.order_by('position')
    newses = News.objects.select_related('category', 'author').all()[0:count]
    categories = NewsCategory.objects.all()
    context = {
        'newses': newses,
        'categories': categories,
        'bannners': banners
    }
    return render(request, 'news/index.html', context=context)


def news_list(request):
    page = request.GET.get('p', 1)  # 默认值为1
    category_id = int(request.GET.get('category_id', 0))  # 默认值为0
    print(category_id)
    start = (int(page)-1)*settings.LOAD_NEWS_COUNT
    end = start + settings.LOAD_NEWS_COUNT

    if category_id == 0:
        newses = News.objects.all()[start:end]
    else:
        newses = News.objects.select_related('category', 'author').filter(category_id=category_id)[start:end]
    print(newses)
    serializer = NewsSerializer(newses, many=True)  # 对对象进行序列化
    data = serializer.data
    # print(data)
    return restful.ok(data=data)


def news_detail(request, news_id):
    try:
        news = News.objects.select_related('category', 'author').prefetch_related('comments__author').get(pk=news_id)
        context = {
            'news': news
        }
        print(context['news'])
        return render(request, 'news/news_detail.html', context=context)
    except News.DoesNotExist:
        raise Http404


@my_login_required
def public_comment(request):
    form = PublicCommmentForm(request.POST)
    try:
        if form.is_valid():
            news_id = form.cleaned_data.get('news_id')
            content = form.cleaned_data.get('content')
            news = News.objects.get(pk=news_id)
            comment = Comment.objects.create(content=content, news=news, author=request.user)
            serialize = CommentSerializer(comment)
            return restful.ok(data=serialize.data)
        else:
            return restful.params_error(message=form.get_errors())
    except Exception:
        raise Exception('该新闻不存在')


def search(request):
    return render(request, 'search/search.html')



