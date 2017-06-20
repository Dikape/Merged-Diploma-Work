import json
import requests

from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt

from geopy.distance import vincenty
from haystack.query import SearchQuerySet

from investmap.models import ObjectCategory, InvestmentObject, ObjectHolder
from investmap.serializers import InvestmentObjectSerializer, ObjectHolderSerializer

from .models import Region, People
from .serializers import RegionSerializer, PeopleSerializer

def index(request):
    return HttpResponse('<h1>Home page of graduation work! Authors: Volodymyr Gorobyuk and Kasianchyk Dmytro</h1>'
                        '<p><a href="/api">Go to API</a></p>'
                        '<p><a href="/admin">Go to the admin page</a></p>')


def knapsack01_dp(items, limit):
    limit = int(limit)
    table = [[0 for w in range(limit + 1)] for j in range(len(items) + 1)]

    for j in range(1, len(items) + 1):
        item, wt, val, obj_id = items[j - 1]
        for w in range(1, limit + 1):
            if wt > w:
                table[j][w] = table[j - 1][w]
            else:
                table[j][w] = max(table[j - 1][w],
                                  table[j - 1][w - wt] + val)

    result = []
    w = limit
    for j in range(len(items), 0, -1):
        was_added = table[j][w] != table[j - 1][w]

        if was_added:
            item, wt, val, obj_id = items[j - 1]
            result.append(items[j - 1])
            w -= wt

    return result


@csrf_exempt
def math_algorithm(request):
    data = json.loads(request.body.decode('utf-8'))
    center_lat = data.get('map_lat')
    center_lon = data.get('map_lon')
    max_weight = data.get('max_price')
    categories_list = data.get('categories')
    categories_id = [i for i in categories_list.keys()]
    categories_costs = [int(i) for i in categories_list.values()]

    categories = ObjectCategory.objects.filter(id__in=categories_id)
    objects_by_categories = {}

    distance_koef = 10

    result = {}
    for category in categories:
        invest_objects = category.investmentobject_set.filter()
        objects_price = {}
        for obj in invest_objects:
            points = obj.map_points.all()
            if points.count() == 1:

                obj_distance = vincenty((center_lat, center_lon), (points[0].map_lat, points[0].map_lon)).kilometers
                # print('price {0} distance {1}'.format(obj.price, obj_distance))
                objects_price[obj.id] = float(obj.price) + obj_distance*distance_koef

        objects_by_categories[category.id] = {k:v for k,v in objects_price.items() if v==min(objects_price.values())}
        # for obj in invest_objects:
        #     if obj.objects.fil
    items = ()
    i = 0
    for k,v in objects_by_categories.items():
        items += (k, int(list(v.values())[0]), categories_costs[i], list(v.keys())[0]),
        i+=1

    result_knapsack = knapsack01_dp(items, max_weight)

    result = []

    for i in result_knapsack:
        category = ObjectCategory.objects.get(id=i[0])
        obj = InvestmentObject.objects.get(id=i[3])
        result.append({'key':category.title,
        'value':obj.name})

    return JsonResponse(result, safe=False)


@csrf_exempt
def search(request):
    """Performs POST request processing for search in Document model by haystack and elasticsearch.

        Required field in body of POST - "query"

        Return:
            List of id or message "No result"
    """
    if request.method == 'GET':
        raise Http404()
    response = {'message': "No result for this search request"}
    data = json.loads(request.body.decode('utf-8'))
    query = data.get('query')
    people, region, investmentobject, objectholder = [], [], [], []
    if query:
        sqs = SearchQuerySet().filter(content=query)
        if sqs:
            for i in sqs:
                if i.model == People:
                    obj = People.objects.get(id=i.pk)
                    people.append(PeopleSerializer(obj).data)
                elif i.model == Region:
                    obj = Region.objects.get(id=i.pk)
                    region.append(RegionSerializer(obj).data)
                elif i.model == InvestmentObject:
                    obj = InvestmentObject.objects.get(id=i.pk)
                    investmentobject.append(InvestmentObjectSerializer(obj).data)
                elif i.model == ObjectHolder:
                    obj = ObjectHolder.objects.get(id=i.pk)
                    objectholder.append(ObjectHolderSerializer(obj).data)
            response = {"people": people,
                        "region": region,
                        "investmentobject": investmentobject,
                        "objectholder": objectholder}
    return JsonResponse(response, safe=False)