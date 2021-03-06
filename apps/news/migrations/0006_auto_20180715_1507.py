# Generated by Django 2.0.5 on 2018-07-15 07:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0005_auto_20180713_2300'),
    ]

    operations = [
        migrations.CreateModel(
            name='Banner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField()),
                ('position', models.IntegerField()),
                ('in_use', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ['position'],
            },
        ),
        migrations.AlterModelOptions(
            name='comment',
            options={'ordering': ['-pub_time']},
        ),
        migrations.AlterField(
            model_name='comment',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='comment',
            name='news',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='news.News'),
        ),
    ]
