import React, { useState } from "react";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";

const EditProfile = ({ onClose, onUpdate }) => {
  const { user, fetchUser } = useAuth();
  const [form, setForm] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    bio: user.profile?.bio || "",
    avatar: user.profile?.avatar || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch("/users/update_profile/", form);
      await fetchUser();
      if (onUpdate) await onUpdate();
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          placeholder="Nome"
          value={form.first_name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          name="last_name"
          placeholder="Sobrenome"
          value={form.last_name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          rows="2"
        />
        <input
          name="avatar"
          placeholder="URL da foto de perfil"
          value={form.avatar}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Nova senha (opcional)"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
