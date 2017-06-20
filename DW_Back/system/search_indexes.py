from haystack import indexes
from .models import Region, People


class RegionIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.EdgeNgramField(document=True, use_template=True)

    title = indexes.CharField(model_attr='title')
    short_description = indexes.CharField(model_attr='short_description')
    description = indexes.CharField(model_attr='description')
    center_city = indexes.CharField(model_attr='center_city')

    def get_model(self):
        return Region

    def index_queryset(self, using=None):
        return self.get_model().objects.all()


class PeopleIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.EdgeNgramField(document=True, use_template=True)

    title = indexes.CharField(model_attr='title')
    region = indexes.CharField(model_attr='region')
    category = indexes.CharField(model_attr='category__title')
    short_description = indexes.CharField(model_attr='short_description')
    description = indexes.CharField(model_attr='description')

    def get_model(self):
        return People

    def index_queryset(self, using=None):
        return self.get_model().objects.all()


