// Register.jsx ==========================================================================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Login.css";
import logo from "../assets/ginescaner.png";

function Register() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
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
      // 1. Registro
      await axios.post("/register", {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        clave: clave,
        tipo: "medico",
        estatus: "activo" // 🔧 necesario
      });

      // 2. Login automático
      // console.log("Login con:", email, clave);
      // const loginResponse = await axios.post("/login", new URLSearchParams({
      //   username: email,
      //   password: clave
      // }), {
      //   headers: { "Content-Type": "application/x-www-form-urlencoded" }
      // });
      const loginResponse = await axios.post("http://localhost:8000/login", new URLSearchParams({
        username: email,
        password: clave
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        // ⛔ Evita que Axios agregue el token automáticamente
        transformRequest: [(data) => data]
      });


      // 3. Guardar token y usuario
      localStorage.setItem("token", loginResponse.data.access_token);
      localStorage.setItem("usuario", JSON.stringify(loginResponse.data.user));

      // 4. Redirigir
      navigate("/nuevo-medico");
    } catch (error) {
      alert("Error al registrar usuario o iniciar sesión");
      console.error(error);
    }
  };


  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmitRegister}>
        <div className="avatar-container">
          <img className="avatar" src={logo} alt="GineScaner" />
        </div>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
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
// Register.jsx ==========================================================================================================