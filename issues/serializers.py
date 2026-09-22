from rest_framework import serializers

from .models import Comment, Issue


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = Comment
        fields = ("id", "issue", "author", "body", "created_at")
        read_only_fields = ("id", "issue", "author", "created_at")


class IssueSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Issue
        fields = (
            "id",
            "title",
            "description",
            "priority",
            "status",
            "author",
            "comments",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "author", "created_at", "updated_at")

    def get_fields(self):
        fields = super().get_fields()
        user = getattr(self.context.get("request"), "user", None)
        if not (user and user.is_authenticated and user.is_admin):
            fields["status"].read_only = True
        return fields


class IssueListSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = Issue
        fields = ("id", "title", "priority", "status", "author", "created_at")
