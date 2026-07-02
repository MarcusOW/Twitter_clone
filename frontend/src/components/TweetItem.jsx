import React from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/client";
import { Link } from "react-router-dom";
import CommentSection from "./CommentSection";

const TweetItem = ({ tweet, onLike, onDelete }) => {
  const { user } = useAuth();
  const isAuthor = user && user.id === tweet.author.id;

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/tweets/${tweet.id}/like/`);
      if (onLike) onLike(tweet.id, data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este tweet?")) return;
    try {
      await api.delete(`/tweets/${tweet.id}/`);
      if (onDelete) onDelete(tweet.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded mb-3 border border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar do autor */}
        <Link to={`/profile/${tweet.author.id}`} className="flex-shrink-0">
          {tweet.author.avatar ? (
            <img
              src={tweet.author.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              {tweet.author.username[0].toUpperCase()}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              to={`/profile/${tweet.author.id}`}
              className="font-bold hover:underline truncate"
            >
              {tweet.author.username}
            </Link>
            <span className="text-sm text-gray-500 flex-shrink-0">
              {new Date(tweet.created_at).toLocaleString()}
            </span>
          </div>
          <p className="mt-1 break-words">{tweet.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleLike}
              className="cursor-pointer flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
            >
              <span>{tweet.is_liked ? "❤️" : "🤍"}</span>
              <span>{tweet.likes_count}</span>
            </button>
            {isAuthor && (
              <button
                onClick={handleDelete}
                className="cursor-pointer text-red-500 hover:text-red-700 text-sm transition-colors"
              >
                Excluir
              </button>
            )}
          </div>
          <CommentSection tweetId={tweet.id} />
        </div>
      </div>
    </div>
  );
};

export default TweetItem;
