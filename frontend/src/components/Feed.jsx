import React, { useState, useEffect, useCallback } from "react";
import api from "../api/client";
import TweetItem from "./TweetItem";
import TweetForm from "./TweetForm";

const Feed = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTweets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/tweets/feed/");
      const data = response.data;
      console.log("Resposta do feed:", data);

      let tweetsArray = [];
      if (data) {
        if (Array.isArray(data)) {
          tweetsArray = data;
        } else if (Array.isArray(data.results)) {
          tweetsArray = data.results;
        }
      }
      setTweets(tweetsArray);
    } catch (error) {
      console.error("Erro ao buscar feed:", error);
      setTweets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

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
