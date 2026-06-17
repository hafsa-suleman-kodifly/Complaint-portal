from django.db import transaction
from django.utils import timezone
from .models import Complaint, ComplaintAttachment, ComplaintNote, AuditLog

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
        .order_by("-reference_number")
        .first()
    )
    if not last:
        seq = 1
    else:
        seq = int(last.reference_number.split("-")[-1]) + 1
    return f"CMP-{year}-{seq:04d}"

def create_complaint(validated_data, files=None):
    files = files or []
    complaint = Complaint.objects.create(
        
        **validated_data,
        status=Complaint.Status.OPEN,
    )
    for f in files:
        ComplaintAttachment.objects.create(complaint=complaint, file=f)
    return complaint

def change_status(complaint, new_status, user):
    old_status = complaint.status
    if new_status not in ALLOWED_TRANSITIONS.get(old_status, set()):
        raise ValueError("Invalid status transition")
    complaint.status = new_status
    if new_status == Complaint.Status.RESOLVED and complaint.resolved_at is None:
        complaint.resolved_at = timezone.now()
    complaint.save(update_fields=["status", "resolved_at", "updated_at"])
    AuditLog.objects.create(
        complaint=complaint,
        changed_by=user,
        old_status=old_status,
        new_status=new_status,
    )
    return complaint

def add_note(complaint, user, note_text):
    return ComplaintNote.objects.create(
        complaint=complaint,
        author=user,
        note_text=note_text,
    )