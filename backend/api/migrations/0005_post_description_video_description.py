# Generated by Django 4.2.8 on 2023-12-17 09:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_post_content_alter_video_content'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='description',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='video',
            name='description',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]
