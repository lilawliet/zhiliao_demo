from django.urls import path
from . import views
from . import course_views


app_name = 'cms'

urlpatterns = [
    path('login/', views.login, name='login'),
    path('', views.index, name='index'),
    path('write_news/', views.WriteNewsView.as_view(), name='write_news'),
    path('news_category/', views.news_category, name='news_category'),
    path('add_news_category/', views.add_news_category, name='add_news_category'),
    path('edit_news_category/', views.edit_news_category, name='edit_news_category'),
    path('del_news_category/', views.del_news_category, name='del_news_category'),
    path('upload_file/', views.upload_file, name='upload_file'),
    path('qntoken/', views.qntoken, name='qntoken'),
    path('banners/', views.Banners.as_view(), name='banners'),
    path('banner_list/', views.banner_list, name='banner_list'),
    path('news_list/', views.NewsListView.as_view(), name='news_list')

]

# 课程相关 url 映射
urlpatterns += [
    path('pub_course/', course_views.PubCourse.as_view(), name='pub_course')
]