import React, { useState, useEffect } from "react";
import api from "../api/client";

const CommentSection = ({ tweetId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/?tweet=${tweetId}`);
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [tweetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await api.post("/comments/", { tweet: tweetId, content });
      setContent("");
      fetchComments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 border-t pt-2">
      <div className="space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="text-sm">
            <span className="font-bold">{c.author.username}:</span> {c.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex mt-2 gap-2">
        <input
          type="text"
          placeholder="Comentar..."
          className="flex-1 p-1 border rounded text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {loading ? "..." : "Comentar"}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
