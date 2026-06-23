from rest_framework import serializers
from .models import Complaint, ComplaintAttachment, ComplaintNote, AuditLog
from .validators import validate_attachments
from .services import create_complaint, change_status, add_note

class ComplaintAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintAttachment
        fields = ["id", "file", "uploaded_at"]

class ComplaintNoteSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.get_full_name", read_only=True)

    class Meta:
        model = ComplaintNote
        fields = ["id", "note_text", "author_name", "created_at"]

class AuditLogSerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source="changed_by.get_full_name", read_only=True)

    class Meta:
        model = AuditLog
        fields = ["id", "old_status", "new_status", "changed_by_name", "changed_at"]

class ComplaintCreateSerializer(serializers.ModelSerializer):
    attachments = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False,
        validators=[validate_attachments]
    )

    class Meta:
        model = Complaint
        fields = [
            "id", "reference_number",
            "complainant_name", "complainant_email", "complainant_phone", "title", "description", "attachments",
        ]
        read_only_fields = ["id", "reference_number"]

    def create(self, validated_data):
        files = validated_data.pop("attachments", [])
        request = self.context["request"]

        idempotency_key = request.headers.get(
            "Idempotency-Key"
        )
        return create_complaint(validated_data, files=files, idempotency_key=idempotency_key)

    def validate_description(self, value):
        if len(value) < 20:
            raise serializers.ValidationError("Description must be at least 20 characters.")
        return value


class ComplaintListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ["id", "reference_number", "title", "status", "complainant_name", "complainant_email", "created_at", "updated_at"]

class ComplaintDetailSerializer(serializers.ModelSerializer):
    attachments = ComplaintAttachmentSerializer(many=True, read_only=True)
    notes = ComplaintNoteSerializer(many=True, read_only=True)
    audit_logs = AuditLogSerializer(many=True, read_only=True)

    class Meta:
        model = Complaint
        fields = [
            "id", "reference_number", "complainant_name", "complainant_email",
            "complainant_phone", "title", "description", "status",
            "created_at", "updated_at", "resolved_at", "attachments", "notes", "audit_logs",
        ]
        read_only_fields = [
            "status",
            "resolved_at",
        ]

class ComplaintStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
            choices=Complaint.Status.choices
        )

    def update(self, instance, validated_data):

        user = self.context["request"].user

        return change_status(
            instance,
            validated_data["status"],
            user
        )

class ComplaintNoteCreateSerializer(serializers.Serializer):
    note_text = serializers.CharField()

    def create(self, validated_data):
        complaint = self.context["complaint"]
        user = self.context["request"].user
        return add_note(complaint, user, validated_data["note_text"])