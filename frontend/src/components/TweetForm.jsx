import React, { useState } from "react";
import api from "../api/client";

const TweetForm = ({ onTweetCreated }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await api.post("/tweets/", { content });
      setContent("");
      if (onTweetCreated) onTweetCreated();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
      <textarea
        className="w-full p-2 border rounded resize-none focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        rows="3"
        placeholder="O que está acontecendo?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">{content.length}/280</span>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Publicando..." : "Tweetar"}
        </button>
      </div>
    </form>
  );
};

export default TweetForm;
