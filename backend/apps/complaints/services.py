from django.db import transaction
from django.utils import timezone
from .models import Complaint, ComplaintAttachment, ComplaintNote, AuditLog
from .tasks import send_status_email, send_complaint_email
from rest_framework.exceptions import ValidationError
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

ALLOWED_TRANSITIONS = {
    "open": {"in_progress", "resolved", "closed"},
    "in_progress": {"resolved", "closed"},
    "resolved": {"closed"},
    "closed": set(),
}

def generate_reference_number():
    year = timezone.now().year
    prefix = f"CMP-{year}-"
    last = (
        Complaint.objects
        .select_for_update()
        .filter(reference_number__startswith=prefix)
        .order_by("-reference_number")
        .first()
    )
    if not last:
        seq = 1
    else:
        seq = int(last.reference_number.split("-")[-1]) + 1
    return f"CMP-{year}-{seq:04d}"

@transaction.atomic
def create_complaint(validated_data, files=None, idempotency_key=None):

    files = files or []
    if idempotency_key:
        existing_complaint = Complaint.objects.filter(idempotency_key=idempotency_key).first()
        if existing_complaint:
            return existing_complaint
    validated_data["reference_number"] = generate_reference_number()

    complaint = Complaint.objects.create(
        **validated_data,
        idempotency_key=idempotency_key,
        status=Complaint.Status.OPEN,
    )

    for f in files:
        ComplaintAttachment.objects.create(
            complaint=complaint,
            file=f
        )

    transaction.on_commit(
        lambda: send_complaint_email.delay(
            complaint.complainant_email,
            complaint.reference_number,
            complaint.complainant_name,
            complaint.title,
            complaint.description
        )
    )

    return complaint

@transaction.atomic
def change_status(complaint, new_status, user):
    complaint = (
        Complaint.objects
        .select_for_update()
        .get(id=complaint.id)
    )
    old_status = complaint.status

    if new_status not in ALLOWED_TRANSITIONS.get(old_status, set()):
        raise ValidationError(
            f"Cannot change status from {old_status} to {new_status}"
        )

    complaint.status = new_status
    
    if new_status == Complaint.Status.RESOLVED and not complaint.resolved_at:
        complaint.resolved_at = timezone.now()
    complaint.save(update_fields=["status", "resolved_at", "updated_at"])
    AuditLog.objects.create(
        complaint=complaint,
        changed_by=user,
        old_status=old_status,
        new_status=new_status,
    )

    channel_layer = get_channel_layer()

    transaction.on_commit(
        lambda: async_to_sync(
            channel_layer.group_send
        )(
            "admin_notifications",
            {
                "type": "send_notification",
                "data": {
                    "type": "STATUS_CHANGED",
                    "message":
                        f"Complaint {complaint.reference_number} status changed",
                    "complaint_id": str(complaint.id),
                    "reference_number":
                        complaint.reference_number,
                    "old_status": old_status,
                    "new_status": complaint.status,
                    "changed_by":
                        getattr(user, "username", str(user)),
                }
            }
        )
    )

    transaction.on_commit(
        lambda: send_status_email.delay(
            complaint.complainant_email,
            complaint.reference_number,
            complaint.status
        )
    )

    return complaint

def add_note(complaint, user, note_text):
    return ComplaintNote.objects.create(
        complaint=complaint,
        author=user,
        note_text=note_text,
    )