# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-18 17:12
from __future__ import unicode_literals

from django.db import migrations
import stdimage.models


class Migration(migrations.Migration):

    dependencies = [
        ('investmap', '0002_auto_20170518_0010'),
    ]

    operations = [
        migrations.AlterField(
            model_name='objectcategory',
            name='marker_picture',
            field=stdimage.models.StdImageField(upload_to='categories_markers', verbose_name='Зображення маркера'),
        ),
    ]
