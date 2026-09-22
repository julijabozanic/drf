# from django.urls import path

# from .views import (
#     AuthorDetailView,
#     AuthorListCreateView,
#     BookDetailView,
#     BookListCreateView,
# )

# urlpatterns = [
#     path("authors/", AuthorListCreateView.as_view(), name="author-list-create"),
#     path("authors/<int:pk>/", AuthorDetailView.as_view(), name="author-detail"),

#     path("books/", BookListCreateView.as_view(), name="book-list-create"),
#     path("books/<int:pk>/", BookDetailView.as_view(), name="book-detail"),
# ]

from rest_framework.routers import DefaultRouter

from .views import AuthorViewSet, BookViewSet

router = DefaultRouter()

router.register("authors", AuthorViewSet)
router.register("books", BookViewSet)

urlpatterns = router.urls
