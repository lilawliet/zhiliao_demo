from rest_framework import serializers
from .models import News, NewsCategory, Comment
from apps.my_auth.serializers import UserSerialier


class NewsCategorySerialier(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = ('id', 'name')


class NewsSerializer(serializers.ModelSerializer):
    category = NewsCategorySerialier()
    author = UserSerialier()

    class Meta:
        model = News
        fields = ('id', 'title', 'desc', 'thumbnail', 'category', 'pub_time', 'author')


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerialier()
    class Meta:
        model = Comment
        fields = ('id', 'content', 'author', 'pub_time')

