# Generated by Django 2.0.5 on 2018-07-02 12:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('my_auth', '0002_auto_20180702_1529'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='is_admin',
            new_name='is_staff',
        ),
    ]
