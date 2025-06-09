import { useState } from 'react';
import { register } from '../services/api';

function Register({ onRegisterSuccess }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'medico',
    estatus: 'activo',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      onRegisterSuccess(); // redirige al login o carga perfil
    } catch {
      setError('No se pudo registrar. ¿Email ya registrado?');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
      <select name="rol" onChange={handleChange}>
        <option value="medico">Médico</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Registrarse</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default Register;

