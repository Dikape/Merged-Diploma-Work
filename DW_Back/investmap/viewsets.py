from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import OwnershipFormSerializer, ObjectHolderSerializer, ContractTypeSerializer, ObjectCategorySerializer, InvestMapPointSerializer, InvestmentObjectSerializer
from investmap.models import OwnershipForm, ObjectHolder, ContractType, ObjectCategory, InvestmentObject, InvestMapPoint


class OwnershipFormViewSet(viewsets.ModelViewSet):
    model = OwnershipForm
    queryset = OwnershipForm.objects.all()
    serializer_class = OwnershipFormSerializer


class ObjectHolderViewSet(viewsets.ModelViewSet):
    model = ObjectHolder
    queryset = ObjectHolder.objects.all()
    serializer_class = ObjectHolderSerializer


class ContractTypeViewSet(viewsets.ModelViewSet):
    model = ContractType
    queryset = ContractType.objects.all()
    serializer_class = ContractTypeSerializer


class ObjectCategoryViewSet(viewsets.ModelViewSet):
    model = ObjectCategory
    queryset = ObjectCategory.objects.all()
    serializer_class = ObjectCategorySerializer
    parser_classes = (MultiPartParser, FormParser)

class InvestmentObjectViewSet(viewsets.ModelViewSet):
    model = InvestmentObject
    queryset = InvestmentObject.objects.all()
    serializer_class = InvestmentObjectSerializer
    parser_classes = (MultiPartParser, FormParser)
