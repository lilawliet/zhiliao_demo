# Generated by Django 2.0.5 on 2018-07-15 07:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0007_banner_thumbnail'),
    ]

    operations = [
        migrations.RenameField(
            model_name='banner',
            old_name='url',
            new_name='link_to',
        ),
    ]
