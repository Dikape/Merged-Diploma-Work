from django.db import models

from stdimage.models import StdImageField

from django.contrib.auth.models import User
from system.models import Region


class OwnershipForm(models.Model):
    title = models.CharField(max_length=100, verbose_name='Назва')

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'investmap_ownership_forms'
        verbose_name = 'Форма власності'
        verbose_name_plural = 'Форми власності'


class ObjectHolder(models.Model):
    title = models.CharField(max_length=100, verbose_name='Назва')
    address = models.CharField(max_length=100, verbose_name='Адреса')
    contacts = models.CharField(max_length=300, verbose_name='Контакти')
    map_lon = models.CharField(max_length=64, verbose_name='Довгота')
    map_lat = models.CharField(max_length=64, verbose_name='Широта')
    ownership = models.ForeignKey(OwnershipForm, verbose_name='Форма власності')

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'investmap_holders'
        verbose_name = 'Балансоутримувач'
        verbose_name_plural = 'Балансоутримувачі'


class ContractType(models.Model):
    title = models.CharField(max_length=100, verbose_name='Назва')

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'investmap_contract_types'
        verbose_name = 'Тип договору'
        verbose_name_plural = 'Типи договорів'


class ObjectCategory(models.Model):
    title = models.CharField(max_length=100, verbose_name='Назва')
    marker_picture = StdImageField(upload_to='categories_markers', verbose_name='Зображення маркера', variations={
        'sm': (36, 36),
    })

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'investmap_object_categories'
        verbose_name = "Категорія об'єкта"
        verbose_name_plural = "Категорії об'єктів"


class InvestmentObject(models.Model):
    name = models.CharField(max_length=100, verbose_name='Назва')
    region = models.ForeignKey(Region, on_delete=models.CASCADE, verbose_name='Регіон')
    description = models.CharField(max_length=1000, verbose_name='Опис')
    price = models.CharField(max_length=16, verbose_name='Ціна')
    metrics = models.CharField(max_length=50, verbose_name='Площа')
    holder = models.ForeignKey(ObjectHolder, verbose_name='Власник', on_delete=models.CASCADE)
    contract_type = models.ForeignKey(ContractType, verbose_name='Тип договору', on_delete=models.CASCADE)
    category = models.ForeignKey(ObjectCategory, verbose_name="Категорія об'єкта", on_delete=models.CASCADE)
    image = models.ImageField(upload_to='objects', verbose_name='Зображення', blank=True, null=True)

    @property
    def lat_lng(self):
        query = InvestMapPoint.objects.filter(investmap_object=self)
        count = query.count()
        result = []
        if count == 1:
            result = query.first().lat_lng()
        elif count > 1:
            result = [coordinate.lat_lng() for coordinate in query]
        return result

    @property
    def markers_count(self):
        markers = self.map_points.all()
        return markers.count()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'investmap_objects'
        verbose_name = "інвестиційний об'єкт"
        verbose_name_plural = "Інвестиційні об'єкти"


class InvestMapPoint(models.Model):
    investment_object = models.ForeignKey(InvestmentObject, related_name='map_points', on_delete=models.CASCADE, verbose_name="Інвестиційний об'єкт")
    map_lon = models.CharField(max_length=64, verbose_name='Довгота')
    map_lat = models.CharField(max_length=64, verbose_name='Широта')
    order = models.IntegerField(default=0)

    @property
    def lat_lng(self):
        return {'lat': float(self.map_lat), 'lng': float(self.map_lon)}

    class Meta:
        db_table = 'investmap_points'
        verbose_name = 'Точка на мапі'
        verbose_name_plural = 'Точки на мапі'


#TO HOLD
class InvestMapLog(models.Model):
    investmap_object = models.ForeignKey(InvestmentObject, on_delete=models.SET_NULL, null=True)
    data_time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    operation = models.CharField(max_length=32)
    ip_address = models.CharField(max_length=32)

    class Meta:
        db_table = 'investmap_logs'
        verbose_name = 'Лог'
        verbose_name_plural = 'Логи'
