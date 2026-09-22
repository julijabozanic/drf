from rest_framework_nested import routers

from .views import CommentViewSet, IssueViewSet

router = routers.SimpleRouter()
router.register("issues", IssueViewSet, basename="issue")

issues_router = routers.NestedSimpleRouter(router, "issues", lookup="issue")
issues_router.register("comments", CommentViewSet, basename="issue-comments")

urlpatterns = router.urls + issues_router.urls
