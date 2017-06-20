from django.db import models

from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings


class Region(models.Model):
    title = models.CharField(max_length=100, verbose_name='Назва')
    short_description = models.CharField(max_length=200, verbose_name='Короткий опис', blank=True)
    description = models.CharField(max_length=1000, verbose_name='Опис')
    center_city = models.CharField(max_length=100, verbose_name='Місто(центр регіону)')
    center_lon = models.CharField(max_length=64, verbose_name='Довгота')
    center_lat = models.CharField(max_length=64, verbose_name='Широта')

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'region_regions'
        verbose_name = 'регіон'
        verbose_name_plural = 'Регіони'


class RegionMapPoint(models.Model):
    region = models.ForeignKey(Region, related_name='map_points', on_delete=models.CASCADE, verbose_name="Інвестиційний об'єкт")
    map_lon = models.CharField(max_length=64, verbose_name='Довгота')
    map_lat = models.CharField(max_length=64, verbose_name='Широта')
    order = models.IntegerField(default=0)

    @property
    def lat_lng(self):
        return {'lat': float(self.map_lat), 'lng': float(self.map_lon)}

    class Meta:
        db_table = 'region_points'
        verbose_name = 'Точка на мапі'
        verbose_name_plural = 'Точки на мапі'


class PeopleCategory(models.Model):
    title = models.CharField(max_length=100, verbose_name='Назва')
    color = models.CharField(max_length=100, verbose_name='Назва кольору англійською')

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'region_people_categories'
        verbose_name = 'категорія'
        verbose_name_plural = 'Категорії'


class People(models.Model):
    title = models.CharField(max_length=100, verbose_name='Назва')
    region = models.ForeignKey(Region, on_delete=models.CASCADE, verbose_name='Регіон')
    category = models.ForeignKey(PeopleCategory, on_delete=models.CASCADE, verbose_name='Категорія')
    short_description = models.CharField(max_length=200, verbose_name='Короткий опис', blank=True)
    description = models.CharField(max_length=1000, verbose_name='Опис')
    count = models.IntegerField(verbose_name='Кількість')
    radius = models.FloatField(verbose_name='Радіус')
    map_lon = models.CharField(max_length=64, verbose_name='Довгота')
    map_lat = models.CharField(max_length=64, verbose_name='Широта')

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'region_peoples'
        verbose_name = 'Демографія'
        verbose_name_plural = 'Демографія'


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)