// NuevaSesion.jsx================================================================
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const NuevaSesion = () => {
  const [pacientes, setPacientes] = useState([]);
  const [formulario, setFormulario] = useState({
    id_paciente: '',
    fecha: '',
    motivo: '',
    diagnostico_previo: '',
    peso: '',
    intervenciones_previas: '',
    paridad: '',
    etapa_reproductiva: '',
    tratamientos_anticonceptivos: '',
    plan: '',
    anotaciones: ''
  });

  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios.get('/pacientes')
      .then(res => setPacientes(res.data))
      .catch(() => setMensaje('Error al cargar pacientes'));
  }, []);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/sesiones', formulario)
      .then(() => setMensaje('Sesión creada correctamente'))
      .catch(() => setMensaje('Error al crear sesión'));
  };

  return (
    <div>
      <h2>Crear Nueva Sesión</h2>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <label>Paciente:
          <select name="id_paciente" onChange={handleChange} required>
            <option value="">Seleccione un paciente</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </label>
        <label>Fecha:
          <input type="datetime-local" name="fecha" onChange={handleChange} required />
        </label>
        <label>Motivo:
          <input name="motivo" onChange={handleChange} required />
        </label>
        <label>Diagnóstico Previo:
          <input name="diagnostico_previo" onChange={handleChange} />
        </label>
        <label>Peso:
          <input type="number" name="peso" step="0.01" onChange={handleChange} />
        </label>
        <label>Intervenciones Previas:
          <input name="intervenciones_previas" onChange={handleChange} />
        </label>
        <label>Paridad:
          <input type="number" name="paridad" onChange={handleChange} />
        </label>
        <label>Etapa Reproductiva:
          <input name="etapa_reproductiva" onChange={handleChange} />
        </label>
        <label>Tratamientos Anticonceptivos:
          <input name="tratamientos_anticonceptivos" onChange={handleChange} />
        </label>
        <label>Plan:
          <input name="plan" onChange={handleChange} />
        </label>
        <label>Anotaciones:
          <textarea name="anotaciones" onChange={handleChange} />
        </label>
        <button type="submit">Crear Sesión</button>
      </form>
    </div>
  );
};

export default NuevaSesion;
// NuevaSesion.jsx================================================================