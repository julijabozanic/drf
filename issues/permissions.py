from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAuthorOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.author_id == request.user.id or request.user.is_admin


class IsIssueParticipantOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        user = request.user

        return (
            user.is_admin
            or obj.author_id == user.id
            or obj.assignee_id == user.id
        )