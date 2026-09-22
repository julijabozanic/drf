from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.contrib.sessions.models import Session

from .models import CustomUser


User = get_user_model()


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "role",
        "is_staff",
        "is_active",
    )

    fieldsets = UserAdmin.fieldsets + (("Role", {"fields": ("role",)}),)

    add_fieldsets = UserAdmin.add_fieldsets + (("Role", {"fields": ("role",)}),)


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = (
        "session_key",
        "user",
        "expire_date",
    )

    readonly_fields = (
        "session_key",
        "decoded_data",
        "expire_date",
    )

    def user(self, obj):
        data = obj.get_decoded()
        user_id = data.get("_auth_user_id")

        if not user_id:
            return None

        return User.objects.filter(pk=user_id).first()

    def decoded_data(self, obj):
        return obj.get_decoded()
