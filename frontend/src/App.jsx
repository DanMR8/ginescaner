import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Pacientes from './pages/Pacientes';
import NuevaSesion from './pages/NuevaSesion';
import SubirImagenes from './pages/SubirImagenes';
import { getPerfil } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchPerfil = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const perfil = await getPerfil(token);
      setUser(perfil);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      {user && (
        <nav>
          <button onClick={() => navigate('/pacientes')}>Pacientes</button>
          <button onClick={() => navigate('/nueva-sesion')}>Nueva Sesión</button>
          <button onClick={() => navigate('/subir-imagen')}>Subir Imagen</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </nav>
      )}
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/pacientes" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login onLoginSuccess={fetchPerfil} />} />
        <Route path="/registro" element={<Register onRegisterSuccess={() => navigate('/login')} />} />
        <Route
          path="/pacientes"
          element={user ? <Pacientes /> : <Navigate to="/login" />}
        />
        <Route
          path="/nueva-sesion"
          element={user ? <NuevaSesion /> : <Navigate to="/login" />}
        />
        <Route
          path="/subir-imagen"
          element={user ? <SubirImagenes /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </div>
  );
}

export default App;
// import { useEffect, useState } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Pacientes from './pages/Pacientes';
// import { getPerfil } from './services/api';

// function App() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   const fetchPerfil = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;
//     try {
//       const perfil = await getPerfil(token);
//       setUser(perfil);
//     } catch {
//       localStorage.removeItem('token');
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     fetchPerfil();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     navigate('/login');
//   };

//   return (
//     <div>
//       {user && (
//         <nav>
//           <button onClick={() => navigate('/pacientes')}>Pacientes</button>
//           <button onClick={handleLogout}>Cerrar sesión</button>
//         </nav>
//       )}
//       <Routes>
//         <Route
//           path="/"
//           element={
//             user ? (
//               <Navigate to="/pacientes" />
//             ) : (
//               <Navigate to="/login" />
//             )
//           }
//         />
//         <Route path="/login" element={<Login onLoginSuccess={fetchPerfil} />} />
//         <Route path="/registro" element={<Register onRegisterSuccess={() => navigate('/login')} />} />
//         <Route
//           path="/pacientes"
//           element={user ? <Pacientes /> : <Navigate to="/login" />}
//         />
//         <Route path="*" element={<h2>Página no encontrada</h2>} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
