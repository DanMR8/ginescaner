import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Login.css"; // reutilizamos estilos visuales

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const navigate = useNavigate();

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (clave !== confirmarClave) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.post("/register", {
        nombre,
        email,
        clave,
        tipo: "medico" // por ahora todos los registros serán médicos
      });
      navigate("/nuevo-medico"); // irá a pantalla 5
    } catch (error) {
      alert("Error al registrar usuario");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmitRegister}>
        <img className="avatar" src="/vite.svg" alt="Avatar" />
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Repetir contraseña"
          value={confirmarClave}
          onChange={(e) => setConfirmarClave(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
