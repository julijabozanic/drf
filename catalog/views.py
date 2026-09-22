# from django.shortcuts import get_object_or_404
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView

# from .models import Author, Book
# from .serializers import AuthorSerializer, BookSerializer


# class AuthorListCreateView(APIView):
#     def get(self, request):
#         authors = Author.objects.all()
#         serializer = AuthorSerializer(authors, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = AuthorSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 serializer.data,
#                 status=status.HTTP_201_CREATED,
#             )

#         return Response(
#             serializer.errors,
#             status=status.HTTP_400_BAD_REQUEST,
#         )


# class AuthorDetailView(APIView):
#     def get(self, request, pk):
#         author = get_object_or_404(Author, pk=pk)
#         serializer = AuthorSerializer(author)
#         return Response(serializer.data)

#     def put(self, request, pk):
#         author = get_object_or_404(Author, pk=pk)

#         serializer = AuthorSerializer(
#             author,
#             data=request.data,
#         )

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)

#         return Response(
#             serializer.errors,
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     def patch(self, request, pk):
#         author = get_object_or_404(Author, pk=pk)

#         serializer = AuthorSerializer(
#             author,
#             data=request.data,
#             partial=True,
#         )

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)

#         return Response(
#             serializer.errors,
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     def delete(self, request, pk):
#         author = get_object_or_404(Author, pk=pk)
#         author.delete()

#         return Response(
#             status=status.HTTP_204_NO_CONTENT,
#         )


# class BookListCreateView(APIView):
#     def get(self, request):
#         books = Book.objects.all()
#         serializer = BookSerializer(books, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = BookSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 serializer.data,
#                 status=status.HTTP_201_CREATED,
#             )

#         return Response(
#             serializer.errors,
#             status=status.HTTP_400_BAD_REQUEST,
#         )


# class BookDetailView(APIView):
#     def get(self, request, pk):
#         book = get_object_or_404(Book, pk=pk)
#         serializer = BookSerializer(book)
#         return Response(serializer.data)

#     def put(self, request, pk):
#         book = get_object_or_404(Book, pk=pk)

#         serializer = BookSerializer(
#             book,
#             data=request.data,
#         )

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)

#         return Response(
#             serializer.errors,
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     def patch(self, request, pk):
#         book = get_object_or_404(Book, pk=pk)

#         serializer = BookSerializer(
#             book,
#             data=request.data,
#             partial=True,
#         )

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)

#         return Response(
#             serializer.errors,
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     def delete(self, request, pk):
#         book = get_object_or_404(Book, pk=pk)
#         book.delete()

#         return Response(
#             status=status.HTTP_204_NO_CONTENT,
#         )

from rest_framework.viewsets import ModelViewSet

from .models import Author, Book
from .serializers import AuthorSerializer, BookSerializer


class AuthorViewSet(ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
