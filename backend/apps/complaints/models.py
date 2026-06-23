import uuid
from django.db import models
from django.utils import timezone

class Complaint(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        IN_PROGRESS = "in_progress", "In Progress"
        RESOLVED = "resolved", "Resolved"
        CLOSED = "closed", "Closed"

    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference_number = models.CharField(
        max_length=30,
        unique=True,
        editable=False,
        null=False,
        blank=False
    )

    idempotency_key = models.UUIDField(
        unique=True,
        null=True,
        blank=True,
        db_index=True
    )
    complainant_name = models.CharField(max_length=200)
    complainant_email = models.EmailField(db_index=True)
    complainant_phone = models.CharField(max_length=20, blank=True, null=True)
    title = models.CharField(max_length=150)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True,db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.reference_number

class ComplaintAttachment(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to="complaints/%Y/%m/%d/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

class ComplaintNote(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="notes")
    author = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True)
    note_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class AuditLog(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="audit_logs")
    changed_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True)
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_at = models.DateTimeField(auto_now_add=True)