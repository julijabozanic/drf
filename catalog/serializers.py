# from rest_framework import serializers

# from .models import Author, Book


# class AuthorSerializer(serializers.Serializer):
#     id = serializers.IntegerField(read_only=True)
#     name = serializers.CharField(max_length=100)
#     birth_year = serializers.IntegerField(
#         required=False,
#         allow_null=True,
#     )

#     def create(self, validated_data):
#         return Author.objects.create(**validated_data)

#     def update(self, instance, validated_data):
#         instance.name = validated_data.get("name", instance.name)
#         instance.birth_year = validated_data.get(
#             "birth_year",
#             instance.birth_year,
#         )
#         instance.save()
#         return instance


# class BookSerializer(serializers.Serializer):
#     id = serializers.IntegerField(read_only=True)
#     title = serializers.CharField(max_length=200)
#     author = serializers.PrimaryKeyRelatedField(
#         queryset=Author.objects.all()
#     )
#     published_year = serializers.IntegerField()
#     is_available = serializers.BooleanField(default=True)

#     def create(self, validated_data):
#         return Book.objects.create(**validated_data)

#     def update(self, instance, validated_data):
#         instance.title = validated_data.get(
#             "title",
#             instance.title,
#         )
#         instance.author = validated_data.get(
#             "author",
#             instance.author,
#         )
#         instance.published_year = validated_data.get(
#             "published_year",
#             instance.published_year,
#         )
#         instance.is_available = validated_data.get(
#             "is_available",
#             instance.is_available,
#         )

#         instance.save()
#         return instance

from rest_framework import serializers

from .models import Author, Book


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = (
            (
                "id",
                "name",
                "birth_year",
            ),
        )
        read_only_fields = ("id",)


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = (
            (
                "id",
                "title",
                "author",
                "published_year",
                "is_available",
            ),
        )
        read_only_fields = ("id",)
