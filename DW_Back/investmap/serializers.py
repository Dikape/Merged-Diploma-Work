from rest_framework import serializers

from investmap.models import OwnershipForm, ObjectHolder, ContractType, ObjectCategory, InvestmentObject, InvestMapPoint


class OwnershipFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnershipForm
        fields = ('id', 'title')
        read_only_fields = ('id',)


class ObjectHolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ObjectHolder
        fields = ('id', 'title', 'address', 'contacts', 'map_lon', 'map_lat', 'ownership')
        read_only_fields = ('id',)


class ContractTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractType
        fields = ('id', 'title')
        read_only_fields = ('id',)


class ObjectCategorySerializer(serializers.ModelSerializer):
    img_small = serializers.SerializerMethodField(source='get_img_small')

    def get_img_small(self, obj):
        return 'http://127.0.0.1:8000'+obj.marker_picture.sm.url

    class Meta:
        model = ObjectCategory
        fields = ('id', 'title', 'marker_picture', 'img_small')
        read_only_fields = ('id',)


class InvestMapPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestMapPoint
        fields = ('id', 'map_lon', 'map_lat', 'order')
        read_only_fields = ('id', 'order')


class InvestmentObjectSerializer(serializers.ModelSerializer):

    map_points = InvestMapPointSerializer(many=True)

    class Meta:
        model = InvestmentObject
        fields = ('id', 'name', 'region', 'description', 'price', 'metrics', 'holder', 'contract_type', 'category',
                  'image', 'map_points')
        read_only_fields = ('id',)

    def create(self, validated_data):
        map_points = validated_data.pop('map_points')
        instance = super(InvestmentObjectSerializer, self).create(validated_data)
        for i, item in enumerate(map_points):
            InvestMapPoint.objects.create(investment_object=instance, order=i, **item)

        return instance

    def update(self, instance, validated_data):
        map_points = validated_data.pop('map_points')
        instance = super(InvestmentObjectSerializer, self).update(instance, validated_data)
        query = InvestMapPoint.objects.filter(investment_object__id=instance.pk).all()
        lst = []
        for item in map_points:
            instance = InvestMapPoint(**item)
            instance.save()
            lst.append(instance)
        for item in query:
            if item not in lst:
                item.delete()
        return instance



