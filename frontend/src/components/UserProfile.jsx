import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import FollowButton from "./FollowButton";
import TweetItem from "./TweetItem";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await api.get(`/users/${userId}/profile/`);
        setProfile(profileData.data);
        const tweetsData = await api.get("/tweets/", {
          params: { author: userId },
        });
        setTweets(tweetsData.data.results || tweetsData.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleLike = (tweetId, newData) => {
    setTweets((prev) =>
      prev.map((t) =>
        t.id === tweetId
          ? { ...t, likes_count: newData.likes_count, is_liked: newData.liked }
          : t,
      ),
    );
  };

  const handleDelete = (tweetId) => {
    setTweets((prev) => prev.filter((t) => t.id !== tweetId));
  };

  if (loading) return <div>Carregando...</div>;
  if (!profile) return <div>Usuário não encontrado</div>;

  const isOwnProfile = user && user.id === parseInt(userId);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-4 shadow rounded mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{profile.user.username}</h2>
            <p className="text-gray-600">{profile.bio || "Sem bio"}</p>
            <div className="flex gap-4 text-sm text-gray-500 mt-2">
              <span>{profile.followers_count} seguidores</span>
              <span>{profile.following_count} seguindo</span>
            </div>
          </div>
          {!isOwnProfile && (
            <FollowButton
              userId={parseInt(userId)}
              isFollowing={profile.user.following?.includes(user.id)}
            />
          )}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Tweets</h3>
        {tweets.length === 0 ? (
          <p className="text-gray-500">Nenhum tweet ainda.</p>
        ) : (
          tweets.map((tweet) => (
            <TweetItem
              key={tweet.id}
              tweet={tweet}
              onLike={handleLike}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfile;
