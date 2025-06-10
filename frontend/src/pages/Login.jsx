import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Box, Paper,Grid2, TextField, Button, Avatar, } from '@mui/material';
import axios from "../api/axios";
// import fondo from './fondo.jpg'
import "./Login.css";

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", {
        correo,
        clave,
      });
      localStorage.setItem("token", response.data.access_token);
      navigate("/pacientes");
    } catch (error) {
      alert("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmitLogin}>
        <img className="avatar" src="/vite.svg" alt="Avatar" />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        <button type="submit">Iniciar sesión</button>
        <button type="button" onClick={() => navigate("/registro")}>
          Crear una cuenta
        </button>
      </form>
    </div>
  );
}

export default Login;
