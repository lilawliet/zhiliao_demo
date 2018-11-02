from django.db import models

# Create your models here.
class Banner(models.Model):
    link_to = models.URLField()  # 图片点击链接地址
    thumbnail = models.URLField()
    position = models.IntegerField()
    in_use = models.BooleanField(default=True)

    class Meta:
        ordering = ['position']
