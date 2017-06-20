from rest_framework import routers

from investmap import viewsets

router = routers.SimpleRouter()
# Register viewsets in router
router.register(r'ownership_forms', viewsets.OwnershipFormViewSet, 'OwnershipForm')
router.register(r'holders', viewsets.ObjectHolderViewSet, 'ObjectHolder')
router.register(r'contract_type', viewsets.ContractTypeViewSet, 'ContractType')
router.register(r'category', viewsets.ObjectCategoryViewSet, 'ObjectCategory')
router.register(r'objects', viewsets.InvestmentObjectViewSet, 'InvestmentObject')


