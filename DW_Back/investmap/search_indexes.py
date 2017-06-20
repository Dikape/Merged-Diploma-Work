from haystack import indexes
from .models import ObjectHolder, InvestmentObject


class ObjectHolderIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.EdgeNgramField(document=True, use_template=True)

    title = indexes.CharField(model_attr='title')
    address = indexes.CharField(model_attr='address')
    contacts = indexes.CharField(model_attr='contacts')
    ownership = indexes.CharField(model_attr='ownership__title')

    def get_model(self):
        return ObjectHolder

    def index_queryset(self, using=None):
        return self.get_model().objects.all()


class InvestmentObjectIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.EdgeNgramField(document=True, use_template=True)

    name = indexes.CharField(model_attr='name')
    description = indexes.CharField(model_attr='description')
    price = indexes.CharField(model_attr='price')
    contract_type = indexes.CharField(model_attr='contract_type__title')

    def get_model(self):
        return InvestmentObject

    def index_queryset(self, using=None):
        return self.get_model().objects.all()


