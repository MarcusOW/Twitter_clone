import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validação simples
    if (formData.password !== formData.password2) {
      setErrors({ password2: "As senhas não coincidem" });
      setLoading(false);
      return;
    }

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
    );
    if (result.success) {
      navigate("/");
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Criar conta</h2>
      {errors.general && (
        <p className="text-red-500 text-sm mb-2">{errors.general}</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuário"
          className="w-full p-2 border rounded mb-2"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          className="w-full p-2 border rounded mb-2"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password2"
          placeholder="Confirmar senha"
          className="w-full p-2 border rounded mb-2"
          value={formData.password2}
          onChange={handleChange}
          required
        />
        {errors.password2 && (
          <p className="text-red-500 text-sm">{errors.password2}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer transition"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
        <p className="text-sm mt-2">
          Já tem conta?{" "}
          <Link to="/login" className="text-blue-500">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
