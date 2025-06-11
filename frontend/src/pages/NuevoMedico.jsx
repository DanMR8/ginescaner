// NuevoMedico.jsx ==========================================================================================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Login.css"; // Reutiliza los estilos de fondo y contenedor
import logo from "../assets/ginescaner.png";

function NuevoMedico() {
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    especialidad: "",
    cedula: "",
    institucion: "",
    telefono: "",
    correo: ""
  });

  const navigate = useNavigate();

  // Al cargar, obtenemos el perfil del usuario actual
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserId(res.data.id);
      } catch {
        alert("No se pudo cargar el perfil. Inicia sesión nuevamente.");
        navigate("/login");
      }
    };

    fetchPerfil();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datos = { ...form, user_id: userId };
      await axios.post("/medicos", datos);
      navigate("/pacientes");
    } catch (error) {
      alert("Error al guardar los datos del médico");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <input name="nombres" placeholder="Nombres" onChange={handleChange} required />
        <input name="apellidos" placeholder="Apellidos" onChange={handleChange} required />
        <input name="especialidad" placeholder="Especialidad" onChange={handleChange} required />
        <input name="cedula" placeholder="Cédula profesional" onChange={handleChange} required />
        <input name="institucion" placeholder="Institución" onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" onChange={handleChange} required />
        <input name="correo" type="email" placeholder="Correo electrónico" onChange={handleChange} required />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default NuevoMedico;
// NuevoMedico.jsx ==========================================================================================================