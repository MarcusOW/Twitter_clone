from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import Profile
from tweets.models import Tweet, Comment

# ---------- USER ----------
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'is_following']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.profile.followers.filter(id=request.user.id).exists()
        return False

# ---------- PROFILE ----------
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    followers_count = serializers.IntegerField(source='followers.count', read_only=True)
    following_count = serializers.IntegerField(source='user.following.count', read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'bio', 'avatar', 'followers_count', 'following_count']

# ---------- COMMENT ----------
class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tweet = serializers.PrimaryKeyRelatedField(queryset=Tweet.objects.all(), write_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'tweet', 'author', 'content', 'created_at']
        read_only_fields = ['author', 'created_at']

# ---------- TWEET ----------
class TweetSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Tweet
        fields = ['id', 'author', 'content', 'created_at', 'likes_count', 'is_liked']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

# ---------- TWEET CREATE ----------
class TweetCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = ['content']