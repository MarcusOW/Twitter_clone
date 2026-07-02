import React, { useState } from "react";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";

const FollowButton = ({ userId, isFollowing = false, onFollowChange }) => {
  const { user } = useAuth();
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  if (!user || user.id === userId) return null;

  const handleToggle = async () => {
    setLoading(true);
    try {
      const endpoint = following ? "unfollow" : "follow";
      await api.post(`/users/${userId}/${endpoint}/`);
      setFollowing(!following);
      if (onFollowChange) onFollowChange(!following);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`cursor-pointer transition-colors px-4 py-1 rounded-full text-sm font-semibold ${
        following
          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
          : "bg-blue-500 text-white hover:bg-blue-600"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? "..." : following ? "Deixar de seguir" : "Seguir"}
    </button>
  );
};

export default FollowButton;
