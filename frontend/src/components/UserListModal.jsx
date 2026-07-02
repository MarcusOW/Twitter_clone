import React, { useState, useEffect } from "react";
import api from "../api/client";
import FollowButton from "./FollowButton";
import { Link } from "react-router-dom";

const UserListModal = ({ userId, type, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const title = type === "followers" ? "Seguidores" : "Seguindo";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`/users/${userId}/${type}/`);
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userId, type]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        {loading ? (
          <p>Carregando...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">Nenhum usuário encontrado.</p>
        ) : (
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between">
                <Link
                  to={`/profile/${u.id}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  {u.avatar ? (
                    <img
                      src={u.avatar}
                      alt={u.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                      {u.username[0].toUpperCase()}
                    </div>
                  )}
                  <span>{u.username}</span>
                </Link>
                <FollowButton userId={u.id} isFollowing={false} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserListModal;
