// Pacientes.jsx==========================================================================
import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Pacientes.css";

function Pacientes() {
  const token = localStorage.getItem("token");

  // Datos del usuario/paciente
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");

  // Datos clínicos
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contactoEmergencia, setContactoEmergencia] = useState("");
  const [alergias, setAlergias] = useState("");
  const [enfermedadesCronicas, setEnfermedadesCronicas] = useState("");

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroApellidos, setFiltroApellidos] = useState("");
  const [resultados, setResultados] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const handleSubmitNuevoPaciente = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "/pacientes/registro",
        {
          nombre,
          apellidos,
          email,
          fecha_nacimiento: fechaNacimiento,
          telefono,
          contacto_emergencia: contactoEmergencia,
          alergias,
          enfermedades_cronicas: enfermedadesCronicas,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Paciente registrado correctamente");

      // Reiniciar campos
      setNombre("");
      setApellidos("");
      setEmail("");
      setFechaNacimiento("");
      setTelefono("");
      setContactoEmergencia("");
      setAlergias("");
      setEnfermedadesCronicas("");
      navigate("/nueva-sesion");
    } catch (error) {
      if (error.response?.data?.detail) {
        const detalle = error.response.data.detail;
      
        if (typeof detalle === "string") {
          alert("Error: " + detalle); // Por ejemplo: "El correo ya existe"
        } else if (Array.isArray(detalle)) {
          // Si viene una lista de errores de validación
          const mensajes = detalle.map((e) => `• ${e.msg} (${e.loc.join(" > ")})`).join("\n");
          alert("Error de validación:\n" + mensajes);
        } else {
          alert("Error desconocido al registrar paciente.");
        }
      
      } else {
        alert("Error inesperado al registrar paciente.");
      }
    
      console.error("Respuesta del servidor:", error.response?.data || error);
    }
  };

  const handleBuscarPacientes = async () => {
    try {
      const response = await axios.get(`/pacientes/buscar`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          nombre: filtroNombre,
          apellidos: filtroApellidos
        }
      });
      setResultados(response.data);
    } catch (error) {
      console.error("Error al buscar pacientes", error);
      alert("Error al buscar pacientes");
    }
  };

  return (
    <div className="pacientes-container">
      {/* 🟥 Contenedor izquierdo */}
      <div className="contenedor-izquierdo">
        <h3>Nuevo paciente</h3>
        <form onSubmit={handleSubmitNuevoPaciente}>
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
            type="date"
            placeholder="Fecha de nacimiento"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <input
            type="text"
            placeholder="Contacto de emergencia"
            value={contactoEmergencia}
            onChange={(e) => setContactoEmergencia(e.target.value)}
          />
          <textarea
            placeholder="Alergias"
            value={alergias}
            onChange={(e) => setAlergias(e.target.value)}
          />
          <textarea
            placeholder="Enfermedades crónicas"
            value={enfermedadesCronicas}
            onChange={(e) => setEnfermedadesCronicas(e.target.value)}
          />
          <button type="submit">Guardar paciente</button>
          <button
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#bbb",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
            onClick={() => navigate(-1)} // volver a la página anterior
          >
            Volver
          </button>
        </form>
      </div>

      {/* 🟩 Contenedor derecho (pendiente) */}
      <div className="contenedor-derecho">
        <h3>Buscar pacientes</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellidos"
          value={filtroApellidos}
          onChange={(e) => setFiltroApellidos(e.target.value)}
        />
        <button onClick={handleBuscarPacientes}>Buscar</button>

        <div style={{ marginTop: "1rem" }}>
          {resultados.length === 0 && <p>No hay resultados.</p>}
          {resultados.map((p) => (
            // <div key={p.id} style={{
            //   border: "1px solid #ccc",
            //   borderRadius: "8px",
            //   padding: "10px",
            //   marginBottom: "10px",
            //   backgroundColor: "#ffffffcc"
            // }}>
            <div key={p.id} className="paciente-card">
              <p><strong>{p.nombre} {p.apellidos}</strong></p>
              <p>{p.email}</p>
              <button
                style={{ marginRight: "0.5rem" }}
                onClick={() => {
                  // localStorage.setItem("pacienteSeleccionado", JSON.stringify({ id_paciente: p.id }));
                  // navigate("/nueva-sesion", { state: { id_paciente: p.id } });
                  localStorage.setItem("pacienteSeleccionado", JSON.stringify({ id_paciente: p.id_paciente }));
                  navigate("/nueva-sesion", { state: { id_paciente: p.id_paciente } });
                }}
              >
                Nueva consulta
              </button>
              <button onClick={() => navigate(`/consultas-previas/${p.id_paciente}`)}>
                Consultas previas
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}

export default Pacientes;

// Pacientes.jsx==========================================================================