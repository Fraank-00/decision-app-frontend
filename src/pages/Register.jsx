import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        email,
        password,
      });

      alert("Usuario creado");

      navigate("/");
    } catch (err) {
      alert("Error al registrar");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-gray-100 px-4">

    <form
      onSubmit={handleRegister}
      className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Crear cuenta
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
        Registrarse
      </button>

      <p
        className="mt-4 text-center text-sm text-gray-600 cursor-pointer hover:text-indigo-500"
        onClick={() => navigate("/")}
      >
        ¿Ya tenés cuenta? Iniciar sesión
      </p>
    </form>

  </div>
);
}