import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const SubirImagenes = () => {
  const [sesiones, setSesiones] = useState([]);
  const [sesionSeleccionada, setSesionSeleccionada] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios.get('/sesiones')
      .then(res => setSesiones(res.data))
      .catch(() => setMensaje('Error al cargar sesiones'));
  }, []);

  const handleArchivo = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!archivo || !sesionSeleccionada) return;

    const formData = new FormData();
    formData.append('archivo', archivo);

    axios.post(`/imagenes/${sesionSeleccionada}`, formData)
      .then(res => setResultado(res.data))
      .catch(() => setMensaje('Error al subir imagen'));
  };

  return (
    <div>
      <h2>Subir Imágenes a una Sesión</h2>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <label>Sesión:
          <select onChange={e => setSesionSeleccionada(e.target.value)} required>
            <option value="">Seleccione una sesión</option>
            {sesiones.map(s => (
              <option key={s.id} value={s.id}>{s.fecha} - Paciente #{s.id_paciente}</option>
            ))}
          </select>
        </label>
        <label>Imagen:
          <input type="file" accept="image/*" onChange={handleArchivo} required />
        </label>
        <button type="submit">Subir Imagen</button>
      </form>

      {resultado && (
        <div>
          <h3>Resultado:</h3>
          <img src={`http://localhost:8000/imagenes/ver/${resultado.id}`} alt="Resultado" width="400" />
        </div>
      )}
    </div>
  );
};

export default SubirImagenes;