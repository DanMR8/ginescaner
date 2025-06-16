// NuevaSesion.jsx==============================================================
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useLocation } from 'react-router-dom';
import './Pacientes.css'; // Reutilizamos los estilos existentes

const etapas = [
  { valor: 0, etiqueta: 'Prepúber' },
  { valor: 1, etiqueta: 'Fértil' },
  { valor: 2, etiqueta: 'Menopáusica' },
  { valor: 3, etiqueta: 'Postmenopáusica' },
  { valor: 4, etiqueta: 'Otro' }
];

const NuevaSesion = () => {
  const location = useLocation();
  const pacienteSeleccionado = location.state?.id_paciente || '';

  const fechaActual = new Date().toISOString().slice(0, 16);

  const [formulario, setFormulario] = useState({
    id_paciente: pacienteSeleccionado,
    fecha: fechaActual,
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

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/sesiones', formulario)
      .then(() => setMensaje('Sesion creada correctamente'))
      .catch(() => setMensaje('Error al crear sesion'));
  };

  const handleCargarImagen = () => {
    alert('Funcionalidad de carga de imagen de ultrasonido no implementada aun.');
  };

  return (
    <div className="pacientes-container">
      <div className="contenedor-derecho">
        <h3>Crear Nueva Sesión</h3>
        {mensaje && <p>{mensaje}</p>}
        <form onSubmit={handleSubmit}>
          {/* <label>Paciente:
            <input name="id_paciente" value={formulario.id_paciente} readOnly />
          </label> */}
          <label>Fecha:
            <input type="datetime-local" name="fecha" value={formulario.fecha} readOnly />
          </label>
          <label>Motivo:
            <input name="motivo" onChange={handleChange} required />
          </label>
          <label>Diagnóstico Previo:
            <input name="diagnostico_previo" onChange={handleChange} />
          </label>
          <label>Peso (kg):
            <input type="number" name="peso" step="0.01" onChange={handleChange} />
          </label>
          <label>Intervenciones Previas:
            <input name="intervenciones_previas" onChange={handleChange} />
          </label>
          <label>Paridad:
            <input type="number" name="paridad" onChange={handleChange} />
          </label>
          <label>Etapa Reproductiva:</label>
          <select
            name="etapa_reproductiva"
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', border: '1px solid #ccc', fontSize: '1rem' }}
          >
            <option value="">Seleccione etapa</option>
            {etapas.map(et => (
              <option key={et.valor} value={et.valor}>{et.etiqueta}</option>
            ))}
          </select>
          <label>Tratamientos Anticonceptivos:
            <input name="tratamientos_anticonceptivos" onChange={handleChange} />
          </label>
          <label>Plan:
            <input name="plan" onChange={handleChange} />
          </label>
          <label>Anotaciones:
            <textarea name="anotaciones" onChange={handleChange} />
          </label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit">Guardar Sesión</button>
            <button type="button" onClick={handleCargarImagen}>Cargar Imagen de Ultrasonido</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaSesion;
// NuevaSesion.jsx==============================================================
