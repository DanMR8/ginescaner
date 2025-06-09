import { useEffect, useState } from 'react';
import {
  getPacientes,
  crearPaciente,
  eliminarPaciente,
  actualizarPaciente,
} from '../services/api';

function Pacientes() {
  const token = localStorage.getItem('token');
  const [pacientes, setPacientes] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', edad: '', diagnostico: '' });
  const [editandoId, setEditandoId] = useState(null);

  const cargarPacientes = async () => {
    const data = await getPacientes(token);
    setPacientes(data);
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleCrear = async () => {
    await crearPaciente(token, nuevo);
    setNuevo({ nombre: '', edad: '', diagnostico: '' });
    cargarPacientes();
  };

  const handleEliminar = async (id) => {
    await eliminarPaciente(token, id);
    cargarPacientes();
  };

  const handleEditar = async (id) => {
    await actualizarPaciente(token, id, nuevo);
    setEditandoId(null);
    setNuevo({ nombre: '', edad: '', diagnostico: '' });
    cargarPacientes();
  };

  return (
    <div>
      <h2>Pacientes</h2>

      <input name="nombre" placeholder="Nombre" value={nuevo.nombre} onChange={handleChange} />
      <input name="edad" type="number" placeholder="Edad" value={nuevo.edad} onChange={handleChange} />
      <input name="diagnostico" placeholder="Diagnóstico" value={nuevo.diagnostico} onChange={handleChange} />
      {editandoId ? (
        <button onClick={() => handleEditar(editandoId)}>Actualizar</button>
      ) : (
        <button onClick={handleCrear}>Agregar</button>
      )}

      <ul>
        {pacientes.map((p) => (
          <li key={p.id}>
            {p.nombre} — {p.edad} años — {p.diagnostico}
            <button onClick={() => setEditandoId(p.id) || setNuevo(p)}>Editar</button>
            <button onClick={() => handleEliminar(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pacientes;
