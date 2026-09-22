from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAuthorOrAdmin(BasePermission):
    """
    Read: any authenticated user (the queryset already filters what they are allowed to see).

    Write/delete: only the object's author or an admin.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author_id == request.user.id or request.user.is_admin
