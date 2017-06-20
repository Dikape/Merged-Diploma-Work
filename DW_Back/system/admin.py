from django.contrib import admin
from django.contrib.auth.models import Group

from rest_framework.authtoken.models import Token

from .models import Region, PeopleCategory, People, RegionMapPoint


class RegionPointInline(admin.TabularInline):
    model = RegionMapPoint
    extra = 1
    min_num = 0


class RegionAdmin(admin.ModelAdmin):
    inlines = (RegionPointInline, )


admin.site.unregister(Token)
admin.site.unregister(Group)
admin.site.register(Region, RegionAdmin)
admin.site.register(PeopleCategory)
admin.site.register(People)