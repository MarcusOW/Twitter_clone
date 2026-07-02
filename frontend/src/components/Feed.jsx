import React, { useState, useEffect } from "react";
import api from "../api/client";
import TweetItem from "./TweetItem";
import TweetForm from "./TweetForm";

const Feed = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTweets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tweets/feed/");
      setTweets(data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

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

  const handleNewTweet = () => fetchTweets();

  if (loading) return <div>Carregando tweets...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <TweetForm onTweetCreated={handleNewTweet} />
      {tweets.length === 0 ? (
        <p className="text-gray-500">
          Nenhum tweet ainda. Siga alguém para ver tweets!
        </p>
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
  );
};

export default Feed;
