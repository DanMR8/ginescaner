// Login.jsx ==========================================================================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import logo from "../assets/ginescaner.png";
import "./Login.css";

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", new URLSearchParams({
        username: correo,
        password: clave
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        transformRequest: [(data) => data]
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("usuario", JSON.stringify(response.data.user));
      navigate("/pacientes");
    } catch (error) {
      alert("Correo o contraseña incorrectos");
      console.error(error);
    }
  };

  return (
    <div className="login-container" >
      {/* style={{ backgroundImage: `url(${fondo})` }} */}
      <form className="login-box" onSubmit={handleSubmitLogin}>
        <div className="avatar-container">
          <img className="avatar" src={logo} alt="GineScaner" />
        </div>
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
// Login.jsx ==========================================================================================================
