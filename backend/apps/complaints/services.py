from django.db import transaction
from django.utils import timezone
from .models import Complaint, ComplaintAttachment, ComplaintNote, AuditLog
from .tasks import send_status_email, send_complaint_email


ALLOWED_TRANSITIONS = {
    "open": {"in_progress", "resolved", "closed"},
    "in_progress": {"resolved", "closed"},
    "resolved": {"closed"},
    "closed": set(),
}

@transaction.atomic
def generate_reference_number():
    year = timezone.now().year
    prefix = f"CMP-{year}-"
    last = (
        Complaint.objects
        .select_for_update()
        .filter(reference_number__startswith=prefix)
        .order_by("-created_at")
        .first()
    )
    if not last:
        seq = 1
    else:
        seq = int(last.reference_number.split("-")[-1]) + 1
    return f"CMP-{year}-{seq:04d}"

@transaction.atomic
def create_complaint(validated_data, files=None):

    files = files or []

    validated_data["reference_number"] = generate_reference_number()

    complaint = Complaint.objects.create(
        **validated_data,
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

def change_status(complaint, new_status, user):
    old_status = complaint.status

    if new_status not in ALLOWED_TRANSITIONS.get(old_status, set()):
        raise ValueError("Invalid status transition")

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