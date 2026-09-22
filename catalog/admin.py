from django.contrib import admin

from .models import Author, Book


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "birth_year")
    search_fields = ("name",)
    ordering = ("name",)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "author",
        "published_year",
        "is_available",
    )

    list_filter = (
        "is_available",
        "published_year",
    )

    search_fields = (
        "title",
        "author__name",
    )

    ordering = ("title",)
