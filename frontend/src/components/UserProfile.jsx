import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import FollowButton from "./FollowButton";
import TweetItem from "./TweetItem";
import EditProfile from "./EditProfile";
import UserListModal from "./UserListModal";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const { user, fetchUser } = useAuth();

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

  useEffect(() => {
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

  const handleProfileUpdate = async () => {
    await fetchUser();
    await fetchProfile();
  };

  if (loading) return <div>Carregando...</div>;
  if (!profile) return <div>Usuário não encontrado</div>;

  const isOwnProfile = user && user.id === parseInt(userId);

  // Verifica se o usuário atual segue este perfil
  const isFollowing = profile.user.following?.includes(user?.id) || false;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-4 shadow rounded mb-4">
        <div className="flex items-start gap-4">
          {/* Avatar do perfil */}
          <div className="flex-shrink-0">
            {profile.user.avatar ? (
              <img
                src={profile.user.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold">
                {profile.user.username[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{profile.user.username}</h2>
                <p className="text-gray-600">{profile.bio || "Sem bio"}</p>
                <div className="flex gap-4 text-sm text-gray-500 mt-2">
                  <span
                    onClick={() => setShowFollowers(true)}
                    className="cursor-pointer hover:underline"
                  >
                    {profile.followers_count} seguidores
                  </span>
                  <span
                    onClick={() => setShowFollowing(true)}
                    className="cursor-pointer hover:underline"
                  >
                    {profile.following_count} seguindo
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {isOwnProfile && (
                  <button
                    onClick={() => setShowEdit(true)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600 transition cursor-pointer"
                  >
                    Editar Perfil
                  </button>
                )}
                {!isOwnProfile && (
                  <FollowButton
                    userId={parseInt(userId)}
                    isFollowing={isFollowing}
                  />
                )}
              </div>
            </div>
          </div>
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

      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <EditProfile
              onClose={() => setShowEdit(false)}
              onUpdate={handleProfileUpdate}
            />
          </div>
        </div>
      )}

      {showFollowers && (
        <UserListModal
          userId={userId}
          type="followers"
          onClose={() => setShowFollowers(false)}
        />
      )}
      {showFollowing && (
        <UserListModal
          userId={userId}
          type="following"
          onClose={() => setShowFollowing(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
