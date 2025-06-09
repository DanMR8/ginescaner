import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const login = async (email, password) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const response = await api.post('/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data;
};

export const getPerfil = async (token) => {
  const response = await api.get('/perfil', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const register = async (data) => {
  const response = await api.post('/register', data);
  return response.data;
};

export const getPacientes = async (token) => {
  const response = await api.get('/pacientes', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const crearPaciente = async (token, data) => {
  const response = await api.post('/pacientes', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const eliminarPaciente = async (token, id) => {
  await api.delete(`/pacientes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const actualizarPaciente = async (token, id, data) => {
  const response = await api.put(`/pacientes/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
