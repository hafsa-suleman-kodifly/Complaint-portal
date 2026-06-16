from django_filters import FilterSet

from .models import Complaint


class ComplaintFilter(FilterSet):

    class Meta:

        model = Complaint

        fields = [
            "status",
        ]