import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex flex-wrap justify-between items-center">
      <Link
        to="/"
        className="text-xl font-bold text-blue-500 hover:text-blue-700 transition-colors"
      >
        Twitter Clone
      </Link>
      <div className="flex items-center gap-4 flex-wrap">
        {user ? (
          <>
            <Link to="/" className="hover:underline text-gray-700">
              Feed
            </Link>
            <Link to="/explore" className="hover:underline text-gray-700">
              Explorar
            </Link>
            <Link
              to={`/profile/${user.id}`}
              className="hover:underline text-gray-700 flex items-center gap-2"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                  {user.username[0].toUpperCase()}
                </span>
              )}
              {user.username}
            </Link>
            <button
              onClick={handleLogout}
              className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline text-gray-700">
              Login
            </Link>
            <Link to="/register" className="hover:underline text-gray-700">
              Cadastro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
