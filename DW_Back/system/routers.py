from rest_framework import routers

from system import viewsets

router = routers.SimpleRouter()

router.register(r'regions', viewsets.RegionViewSet, 'Region')
router.register(r'people_categories', viewsets.PeopleCategoryViewSet, 'PeopleCategory')
router.register(r'peoples', viewsets.PeopleViewSet, 'People')

