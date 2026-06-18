from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Complaint
from .serializers import (
    ComplaintCreateSerializer,
    ComplaintListSerializer,
    ComplaintDetailSerializer,
    ComplaintStatusUpdateSerializer,
    ComplaintNoteCreateSerializer,
)
from .throttles import ComplaintSubmissionThrottle

class ComplaintCreateAPIView(CreateAPIView):
    authentication_classes = [] 
    permission_classes = [AllowAny]
    throttle_classes = [ComplaintSubmissionThrottle]
    serializer_class = ComplaintCreateSerializer
    queryset = Complaint.objects.all()
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        complaint = serializer.save()
        return Response(
            {
                "reference_number": complaint.reference_number,
                "status": complaint.status,
                "created_at": complaint.created_at,
            },
            status=status.HTTP_201_CREATED,
        )

class ComplaintTrackAPIView(APIView):
    authentication_classes = [] 
    permission_classes = [AllowAny]

    def get(self, request):
        ref = request.query_params.get("ref")
        email = request.query_params.get("email")
        complaint = get_object_or_404(Complaint, reference_number=ref, complainant_email=email)
        return Response({
            "reference_number": complaint.reference_number,
            "status": complaint.status,
            "created_at": complaint.created_at,
            "updated_at": complaint.updated_at,
            "resolved_at": (
                complaint.resolved_at.isoformat()
                if complaint.resolved_at
                else None )
        })

class AdminComplaintViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Complaint.objects.all().prefetch_related("attachments", "notes", "audit_logs")
    filterset_fields = ["status"]
    search_fields = ["reference_number", "complainant_name", "complainant_email"]
    ordering_fields = ["created_at", "status"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return ComplaintListSerializer
        if self.action == "retrieve":
            return ComplaintDetailSerializer
        if self.action == "partial_update":
            return ComplaintStatusUpdateSerializer
        return ComplaintDetailSerializer

    def partial_update(self, request, *args, **kwargs):
        complaint = self.get_object()
        serializer = self.get_serializer(
            complaint, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ComplaintDetailSerializer(complaint).data)

    @action(detail=True, methods=["post"], url_path="notes")
    def notes(self, request, pk=None):
        complaint = self.get_object()
        serializer = ComplaintNoteCreateSerializer(
            data=request.data,
            context={"request": request, "complaint": complaint},
        )
        serializer.is_valid(raise_exception=True)
        note = serializer.save()
        return Response(
            {"id": note.id, "note_text": note.note_text, "created_at": note.created_at},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        data = Complaint.objects.values("status").annotate(count=Count("id"))
        counts = {item["status"]: item["count"] for item in data}
        return Response({
            "total": Complaint.objects.count(),
            "open": counts.get("open", 0),
            "in_progress": counts.get("in_progress", 0),
            "resolved": counts.get("resolved", 0),
            "closed": counts.get("closed", 0),
        })