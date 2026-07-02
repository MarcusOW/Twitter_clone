import React, { useState, useEffect } from "react";
import api from "../api/client";
import FollowButton from "../components/FollowButton";
import { Link } from "react-router-dom";

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/users/");
        setUsers(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Explorar Usuários</h2>
      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 shadow rounded mb-2 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <Link
              to={`/profile/${user.id}`}
              className="font-bold hover:underline"
            >
              {user.username}
            </Link>
            <FollowButton
              userId={user.id}
              isFollowing={user.is_following || false}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Explore;
