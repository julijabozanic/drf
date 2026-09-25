from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Comment, Issue


User = get_user_model()


class AssigneeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(
        source="author.username"
    )

    class Meta:
        model = Comment
        fields = (
            "id",
            "issue",
            "author",
            "body",
            "created_at",
        )

        read_only_fields = (
            "id",
            "issue",
            "author",
            "created_at",
        )


class IssueSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(
        source="author.username"
    )

    author_id = serializers.ReadOnlyField(
        source="author.id"
    )

    assignee = AssigneeSerializer(
        read_only=True
    )

    assignee_id = serializers.PrimaryKeyRelatedField(
        source="assignee",
        queryset=User.objects.filter(is_active=True),
        write_only=True,
        required=False,
        allow_null=True,
    )

    comments = CommentSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Issue

        fields = (
            "id",
            "title",
            "description",
            "priority",
            "status",
            "author",
            "author_id",
            "assignee",
            "assignee_id",
            "comments",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "author",
            "author_id",
            "assignee",
            "created_at",
            "updated_at",
        )

    def validate(self, attrs):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated:
            return attrs

        # Admin može sve.
        if user.is_admin:
            return attrs

        # CREATE
        if self.instance is None:
            forbidden = set(attrs) - {
                "title",
                "description",
                "priority",
            }

            if forbidden:
                raise serializers.ValidationError(
                    {
                        self._field_name(field):
                        "You do not have permission to set this field."
                        for field in forbidden
                    }
                )

            return attrs

        # UPDATE
        allowed_fields = set()

        # Autor menja sadržaj issue-a.
        if self.instance.author_id == user.id:
            allowed_fields.update(
                {
                    "title",
                    "description",
                    "priority",
                }
            )

        # Assignee menja status.
        if self.instance.assignee_id == user.id:
            allowed_fields.add("status")

        forbidden = set(attrs) - allowed_fields

        if forbidden:
            raise serializers.ValidationError(
                {
                    self._field_name(field):
                    "You do not have permission to update this field."
                    for field in forbidden
                }
            )

        return attrs

    @staticmethod
    def _field_name(field):
        if field == "assignee":
            return "assignee_id"

        return field


class IssueListSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(
        source="author.username"
    )

    author_id = serializers.ReadOnlyField(
        source="author.id"
    )

    assignee = AssigneeSerializer(
        read_only=True
    )

    class Meta:
        model = Issue

        fields = (
            "id",
            "title",
            "priority",
            "status",
            "author",
            "author_id",
            "assignee",
            "created_at",
        )