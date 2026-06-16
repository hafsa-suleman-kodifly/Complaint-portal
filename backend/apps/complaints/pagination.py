from rest_framework.pagination import PageNumberPagination


class ComplaintPagination(
    PageNumberPagination
):

    page_size = 20