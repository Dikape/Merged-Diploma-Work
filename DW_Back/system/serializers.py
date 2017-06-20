from rest_framework import serializers

from .models import Region, PeopleCategory, People, RegionMapPoint


class RegionMapPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegionMapPoint
        fields = ('id', 'map_lon', 'map_lat', 'order')
        read_only_fields = ('id', 'order')


class RegionSerializer(serializers.ModelSerializer):

    map_points = RegionMapPointSerializer(many=True)

    class Meta:
        model = Region
        fields = ('id', 'title', 'short_description', 'description',
                  'center_city', 'center_lon', 'center_lat', 'map_points')
        read_only_fields = ('id',)

    def create(self, validated_data):
        map_points = validated_data.pop('map_points')
        instance = super(RegionSerializer, self).create(validated_data)
        for i, item in enumerate(map_points):
            RegionMapPoint.objects.create(region=instance, order=i, **item)

        return instance

    def update(self, instance, validated_data):
        map_points = validated_data.pop('map_points')
        instance = super(RegionSerializer, self).update(instance, validated_data)
        query = RegionMapPoint.objects.filter(region__id=instance.pk).all()
        lst = []
        for item in map_points:
            instance = RegionMapPoint(**item)
            instance.save()
            lst.append(instance)
        for item in query:
            if item not in lst:
                item.delete()
        return instance


class PeopleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PeopleCategory
        fields = ('id', 'title', 'color')
        read_only_fields = ('id',)


class PeopleSerializer(serializers.ModelSerializer):
    class Meta:
        model = People
        fields = ('id', 'title', 'region', 'category', 'short_description',
                  'description', 'count', 'radius', 'map_lon', 'map_lat')
        read_only_fields = ('id',)



