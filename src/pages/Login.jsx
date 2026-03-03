import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login({setIsAuth}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      setIsAuth(true);

      navigate("/dashboard");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Error login");
    }

  };

 return (
  <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-200 to-gray-100">
    
    <form 
      onSubmit={handleLogin} 
      className="bg-white p-8 rounded-2xl shadow-xl w-80"
    >
      
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Iniciar sesión
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="block mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="block mb-4 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-indigo-500 text-white py-3 w-full rounded-lg font-semibold hover:bg-indigo-600 transition">
        Ingresar
      </button>

      <p
        className="mt-4 text-sm text-center text-gray-600 cursor-pointer hover:text-indigo-500"
        onClick={() => navigate("/register")}
      >
        Crear cuenta
      </p>

    </form>

  </div>
 );
}