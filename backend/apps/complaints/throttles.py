from rest_framework.throttling import AnonRateThrottle

class ComplaintSubmissionThrottle(AnonRateThrottle):
    scope = "complaint_submission"