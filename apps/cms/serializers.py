from rest_framework import serializers
from .models import Banner


class BannerSerialier(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ('id', 'link_to', 'in_use', 'thumbnail', 'position')
