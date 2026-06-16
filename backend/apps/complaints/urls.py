from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplaintCreateAPIView, ComplaintTrackAPIView, AdminComplaintViewSet

router = DefaultRouter()
router.register(r"admin/complaints", AdminComplaintViewSet, basename="admin-complaints")

urlpatterns = [
    path("complaints/", ComplaintCreateAPIView.as_view()),
    path("complaints/track/", ComplaintTrackAPIView.as_view()),
    path("", include(router.urls)),
]