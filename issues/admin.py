from django.contrib import admin

from .models import Comment, Issue


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "author", "priority", "status", "created_at"]
    list_filter = ["status", "priority"]
    search_fields = ["title", "author__username"]


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ["id", "issue", "author", "created_at"]
    search_fields = ["body", "author__username"]
