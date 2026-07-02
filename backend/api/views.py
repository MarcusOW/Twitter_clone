from rest_framework import viewsets, permissions, status, filters, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from tweets.models import Comment
from .serializers import CommentSerializer
from tweets.models import Tweet
from .serializers import (
    TweetSerializer, TweetCreateSerializer,
    UserSerializer, ProfileSerializer
)

# ---------- TWEET VIEWSET ----------
class TweetViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all().order_by('-created_at')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return TweetCreateSerializer
        return TweetSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=False, methods=['get'])
    def feed(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Not authenticated"}, status=401)

        # Pega os IDs dos usuários que o usuário atual segue
        following_ids = request.user.following.values_list('id', flat=True)
        # Inclui o próprio usuário na lista de autores
        author_ids = list(following_ids) + [request.user.id]
        tweets = Tweet.objects.filter(author__in=author_ids).order_by('-created_at')

        page = self.paginate_queryset(tweets)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(tweets, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        tweet = self.get_object()
        user = request.user
        if user in tweet.likes.all():
            tweet.likes.remove(user)
            liked = False
        else:
            tweet.likes.add(user)
            liked = True
        return Response({'liked': liked, 'likes_count': tweet.likes.count()})

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        tweet_id = self.request.data.get('tweet')
        tweet = get_object_or_404(Tweet, id=tweet_id)
        serializer.save(author=self.request.user, tweet=tweet)

# ---------- USER VIEWSET ----------
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']

    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        user_to_follow = self.get_object()
        if request.user == user_to_follow:
            return Response({'detail': 'You cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)
        profile = user_to_follow.profile
        profile.followers.add(request.user)
        return Response({'status': 'followed'})

    @action(detail=True, methods=['post'])
    def unfollow(self, request, pk=None):
        user_to_unfollow = self.get_object()
        profile = user_to_unfollow.profile
        profile.followers.remove(request.user)
        return Response({'status': 'unfollowed'})

    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        user = self.get_object()
        serializer = ProfileSerializer(user.profile)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# ---------- REGISTER VIEW ----------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer