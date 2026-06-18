from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from .models import Complaint


@shared_task
def send_complaint_email(
    email,
    reference_number,
    title,
    description,
):

    send_mail(
        subject="Complaint Submitted",

        message=f"""
Your complaint has been received successfully.

Complaint Reference:
{reference_number}

Title:
{title}

Details:
{description}


You can use the reference number above to track your complaint.

Thank you.
        """,

        from_email="noreply@civicresolve.com",

        recipient_list=[
            email
        ]
    )



@shared_task
def send_status_email(
    email,
    reference_number,
    status
):

    send_mail(
        subject="Complaint Status Updated",

        message=f"""
Complaint:
{reference_number}

New status:
{status}
        """,

        from_email=settings.DEFAULT_FROM_EMAIL,

        recipient_list=[
            email
        ]
    )



@shared_task
def clear_old_complaints():

    cutoff = (
        timezone.now()
        -
        timedelta(hours=5)
    )


    Complaint.objects.filter(
        status=Complaint.Status.RESOLVED,
        resolved_at__isnull=False,
        updated_at__lt=cutoff
    ).delete()