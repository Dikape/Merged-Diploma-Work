from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import RegionSerializer, PeopleCategorySerializer, PeopleSerializer
from .models import Region, PeopleCategory, People


class RegionViewSet(viewsets.ModelViewSet):
    model = Region
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class PeopleCategoryViewSet(viewsets.ModelViewSet):
    model = PeopleCategory
    queryset = PeopleCategory.objects.all()
    serializer_class = PeopleCategorySerializer


class PeopleViewSet(viewsets.ModelViewSet):
    model = People
    queryset = People.objects.all()
    serializer_class = PeopleSerializer


