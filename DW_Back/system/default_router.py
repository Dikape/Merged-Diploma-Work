from rest_framework import routers

from investmap import routers as investmap_routers
from system import routers as system_routers


class DefaultRouter(routers.DefaultRouter):
    """
    Extends 'DefaultRouter' class to add a method for extending urls from another router.
    """
    def extend(self, router):
        """
        Extend the routers with url routes of the passed in router.

        Args:
            router: SimpleRouter instance with route definitions.
        """
        self.registry.extend(router.registry)


# URL definitions for the api.
router = DefaultRouter()

router.extend(investmap_routers.router)
router.extend(system_routers.router)

