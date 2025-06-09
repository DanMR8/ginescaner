import { useState } from 'react';
import './general.css';
import {
  Box, Paper, Grid, TextField, Button, Avatar, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import fondo from '../assets/fondo.jpg';
import ginescaner from '../assets/ginescaner.png';
import { useNavigate } from 'react-router-dom';
import { registrarMedico, login } from '../services/api';

const PaperTransp = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  borderRadius: '30px',
  padding: theme.spacing(4),
  textAlign: 'center',
  maxWidth: 400,
  width: '100%',
}));

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [correoRegistro, setCorreoRegistro] = useState('');
  const [passRegistro, setPassRegistro] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.access_token);
      onLoginSuccess?.(); // si se pasó como prop
      navigate('/principal');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  const [registroError, setRegistroError] = useState('');
  const [registroExito, setRegistroExito] = useState('');
  const handleRegistro = async () => {
  try {
    await registrarMedico(nombre, correoRegistro, passRegistro);
    setRegistroExito('Registro exitoso. Ahora puedes iniciar sesión.');
    setRegistroError('');
    // Si quieres, puedes limpiar los campos:
    setNombre('');
    setCorreoRegistro('');
    setPassRegistro('');
  } catch (err) {
    setRegistroExito('');
    setRegistroError(err.message || 'Error al registrar');
  }
};

  return (
    <Box className='fondo' style={{ backgroundImage: `url(${fondo})` }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 4,
          flexWrap: 'wrap',
        }}
      >
        {/* Tarjeta de Login */}
        <PaperTransp elevation={12} component="form" onSubmit={handleSubmitLogin}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Avatar src={ginescaner} sx={{ width: 120, height: 120 }} />
            </Grid>
            <Grid item>
              <Typography variant="h5" fontWeight="bold">Iniciar Sesión</Typography>
            </Grid>
            <Grid item>
              <TextField
                label="Correo"
                type="email"
                variant="filled"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            {error && (
              <Grid item>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ backgroundColor: '#0D3851' }}
              >
                Entrar
              </Button>
            </Grid>
          </Grid>
        </PaperTransp>

        {/* Tarjeta de Registro (sin conexión aún al backend) */}
        <PaperTransp elevation={12} component="form" onSubmit={(e) => {e.preventDefault();handleRegistro();}}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Avatar src={ginescaner} sx={{ width: 120, height: 120 }} />
            </Grid>
            <Grid item>
              <Typography variant="h5" fontWeight="bold">Registrarse</Typography>
            </Grid>
            <Grid item>
              <TextField
                label="Nombre completo"
                variant="filled"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Correo"
                type="email"
                variant="filled"
                value={correoRegistro}
                onChange={(e) => setCorreoRegistro(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                value={passRegistro}
                onChange={(e) => setPassRegistro(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"  // ✅ Esto activa la validación automática
                variant="contained"
                size="large"
                sx={{ backgroundColor: '#0D3851' }}
              >
                Crear cuenta
              </Button>
              {registroError && (
                <Typography color="error">{registroError}</Typography>
              )}
              {registroExito && (
                <Typography color="primary">{registroExito}</Typography>
              )}
            </Grid>
          </Grid>
        </PaperTransp>
      </Box>
    </Box>
  );
}

export default Login;
