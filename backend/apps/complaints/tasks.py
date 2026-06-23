from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from .models import Complaint
from django.template.loader import render_to_string


@shared_task(
    autoretry_for=(Exception,),
    retry_kwargs={
        "max_retries": 5,
        "countdown": 60,   # first retry after 1 minute
    },
    retry_backoff=True,    # exponential backoff
    retry_backoff_max=600, # max 10 minutes delay
    retry_jitter=True,     # random delay to avoid spikes
)

def send_complaint_email(
    email,
    reference_number,
    complainant_name,
    title,
    description,
):

    html_message = render_to_string(
            "email/complaint_received.html",
            {
                "reference_number": reference_number,
                "title": title,
                "description": description,
                "complainant_name": complainant_name,
            }
        )


    send_mail(
            subject="Complaint Submitted",

            #fallback
            message=f"""
    Your complaint has been received successfully.

    Complaint Reference:
    {reference_number}

    Title:
    {title}

    Details:
    {description}
            """,

            from_email=settings.DEFAULT_FROM_EMAIL,

            recipient_list=[
                email
            ],

            html_message=html_message,
        )



@shared_task(
    autoretry_for=(Exception,),
    retry_kwargs={
        "max_retries": 5,
        "countdown": 60,
    },
    retry_backoff=True,
    retry_backoff_max=600,
    retry_jitter=True,
)
def send_status_email(
    email,
    reference_number,
    status
):

    html_message = render_to_string(
        "email/complaint_status.html",
        {
            "reference_number": reference_number,
            "status": status,
        }
    )


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
        ],

        html_message=html_message,
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