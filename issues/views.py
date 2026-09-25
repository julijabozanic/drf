from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from accounts.permissions import IsAdmin
from .models import Comment, Issue
from .permissions import IsAuthorOrAdmin, IsIssueParticipantOrAdmin
from .serializers import CommentSerializer, IssueListSerializer, IssueSerializer


class IssueViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsAuthorOrAdmin,IsIssueParticipantOrAdmin]

    def get_queryset(self):
        qs = Issue.objects.visible_to(self.request.user).select_related("author", "assignee")
        if self.action != "list":
            qs = qs.prefetch_related("comments__author")
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return IssueListSerializer
        return IssueSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_permissions(self):
        if self.action == "destroy":
            return [IsAuthenticated(), IsAdmin()]
        return super().get_permissions()


class CommentViewSet(ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrAdmin]

    def get_queryset(self):
        return Comment.objects.filter(
            issue_id=self.kwargs["issue_pk"],
            issue__in=Issue.objects.visible_to(self.request.user),
        ).select_related("author")

    def perform_create(self, serializer):
        issue = get_object_or_404(
            Issue.objects.visible_to(self.request.user),
            pk=self.kwargs["issue_pk"],
        )
        serializer.save(author=self.request.user, issue=issue)
