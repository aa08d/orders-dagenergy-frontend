from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    login_view, refresh_view, me_view,
    DepartmentViewSet, ContractViewSet,
)

router = DefaultRouter()
router.register("departments", DepartmentViewSet, basename="department")
router.register("contracts", ContractViewSet, basename="contract")

urlpatterns = [
    path("auth/login/", login_view),
    path("auth/refresh/", refresh_view),
    path("auth/me/", me_view),
    path("", include(router.urls)),
]
